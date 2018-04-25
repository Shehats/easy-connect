import axios, { AxiosInstance, AxiosResponse } from 'axios';
import { Observable } from 'rxjs/Rx';
import { Cache } from '../fetch';
import { Token } from './';
import { create, isSecure } from '../util';
import { EasySingleton, Easy } from 'easy-injectionjs';

@EasySingleton()
export class HttpFactory {
  private _http: Observable<AxiosInstance>;

  @Easy()
  private cache: Cache;
  
  public getHttp <T> (type: (new () => T)): Observable<AxiosInstance> {
    return this._http || this.genHttp(type);
  }

  private genHttp <T> (type: (new () => T)): Observable<AxiosInstance> {
    let http = axios.create();
    return isSecure(create(type))
    ? this.cache.getItem(Token).map((x: Token) => { 
      http.interceptors.request.use(config => {
      if (isSecure(create(type)) && x.token) {
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
    })
    http.interceptors.response.use((response: AxiosResponse<any>) => {
      if(x && x.key && response.data[x.key])
        x.token = response.data[x.key]
      return response;
    })
    return http;
  })
  : Observable.of(http).map(x => {
    http.interceptors.request.use(config => {
      config.headers['post']['Content-Type'] = 'application/json';
      config.headers['put']['Content-Type'] = 'application/json';
      config.headers['patch']['Content-Type'] = 'application/json';
      return config;
    })
    return x;
  })
  }
}
