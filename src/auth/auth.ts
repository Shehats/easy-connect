import { Token } from './';
import { Cache } from '../fetch';
import { Observable } from 'rxjs/Rx';
import { IAuth, IConfig } from '../core'
import axios, { AxiosInstance, AxiosResponse } from 'axios';
import { EasySingleton, is, Easy, Easily } from 'easy-injectionjs';

@EasySingleton('TOKEN_AUTH')
export class EasyTokenAuth implements IAuth {
  constructor (
    private config: IConfig = is('CONFIG'),
    private token: Token = is(Token),
    private cache: Cache = is(Cache)) {
  }

  public login(loginParams: Object): Observable<any> {
    return Observable.fromPromise(axios.post(this.config.loginUrl, loginParams))
    .map((x: AxiosResponse<any>) => (this.token.token =(this.token.key)? x.data[this.token.key]: x.headers['Authorization']))
    .flatMap((token: Token) => this.cache.setItem(Token, token))
  }

  public logout(): Observable<any> {
    return Cache.removeItem(Token)
    .flatMap(_ => axios.delete(this.config.logoutUrl));
  }

  public register(registerParams: Object): Observable<any> {
    return Observable.fromPromise(axios.post(this.config.registerUrl, registerParams))
    .flatMap((x: AxiosResponse<any>) => (x.headers['Authorization'] || x.data[this.token.key]) 
      ? this.cache.setItem(Token, (this.token.token = (x.headers['Authorization'])
        ? x.headers['Authorization']
        : x.data[this.token.key]))
      : Observable.fromPromise(x.data))
  }

  public validate(): Observable<any> {
    return Observable.fromPromise(axios.get(this.config.validateUrl));
  }

  public validateData(data: Object): Observable<any> {
    return Observable.fromPromise(axios.post(this.config.validateDataUrl, data));
  }
}

@EasySingleton('SESSION_AUTH')
export class EasyAuth implements IAuth{
  constructor (private config: IConfig = is('CONFIG')) {
  }

  public login (loginParams: Object): Observable<any> {
    return Observable.fromPromise(
      axios.post(this.config.loginUrl, loginParams)
      .then((x: AxiosResponse<any>) => x.data));
  }

  public logout (): Observable<any> {
    return Observable.fromPromise(axios.delete(this.config.logoutUrl));
  }

  public validate(): Observable<any> {
    return Observable.fromPromise(axios.get(this.config.validateUrl));
  }

  public register(registerParams: Object): Observable<any> {
    return Observable.fromPromise(axios.post(this.config.registerUrl, registerParams));
  }
  public validateData(data: Object): Observable<any> {
    return Observable.fromPromise(axios.post(this.config.validateDataUrl, data));
  }
}
