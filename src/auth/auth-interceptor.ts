import axios, { AxiosInstance } from 'axios';
import { Observable } from 'rxjs/Rx';
import { Cache } from '../fetch/cache';
import { Token } from './auth-util';
import { create, isSecure } from '../util/util';

export class HttpFactory {
  public static getHttp <T> (type: (new () => T)): Observable<AxiosInstance> {
    let http = axios.create();
    return Cache.getItem(Token)
    .map((x: Token) => http.interceptors.request.use(config => {
      if (isSecure(create(type))) {
        config.headers['post']['Authorization'] = x.prefix + ' ' + x.token;
        config.headers['get']['Authorization'] = x.prefix + ' ' + x.token;
        config.headers['put']['Authorization'] = x.prefix + ' ' + x.token;
        config.headers['delete']['Authorization'] = x.prefix + ' ' + x.token;
        config.headers['patch']['Authorization'] = x.prefix + ' ' + x.token;
        config.headers['head']['Authorization'] = x.prefix + ' ' + x.token;
      }
      config.headers['post']['Content-Type'] = 'application/json';
      config.headers['put']['Content-Type'] = 'application/json';
      config.headers['patch']['Content-Type'] = 'application/json';
      return config;
    })).map(_ => http);
  }
}
