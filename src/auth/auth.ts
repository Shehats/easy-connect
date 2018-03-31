import { Token } from './auth-util';
import { Cache } from '../fetch/cache';
import { Observable } from 'rxjs/Rx';
import axios, { AxiosInstance, AxiosResponse } from 'axios';

export class EasyTokenAuth {
  token: Token;
  loginUrl: string;
  logoutUrl: string;
  registerUrl: string;

  constructor (config: {
    loginUrl?: string,
    logoutUrl?: string,
    registerUrl?: string,
    prefix?: string, 
    key?:string
  }) {
    this.token = new Token(config.prefix, config.key);
    this.loginUrl = config.loginUrl;
    this.logoutUrl = config.logoutUrl;
    this.registerUrl = config.registerUrl;
  }

  public login(loginParams: Object): Observable<any> {
    return Observable.fromPromise(axios.post(this.loginUrl, loginParams))
    .map((x: AxiosResponse<any>) => (this.token.token =(this.token.key)? x.data[this.token.key]: x.headers['Authorization']))
    .flatMap((token: Token) => Cache.setItem(Token, token))
  }

  public logout(): Observable<any> {
    return Cache.removeItem(Token)
    .flatMap(_ => axios.delete(this.logoutUrl));
  }

  public register(registerParams: Object): Observable<any> {
    return Observable.fromPromise(axios.post(this.registerUrl, registerParams))
    .flatMap((x: AxiosResponse<any>) => (x.headers['Authorization'] || x.data[this.token.key]) 
      ? Cache.setItem(Token, (this.token.token = (x.headers['Authorization'])
        ? x.headers['Authorization']
        : x.data[this.token.key]))
      : Observable.fromPromise(x.data))
  }
}

export class EasyAuth {
  loginUrl: string;
  logoutUrl: string;
  registerUrl: string;
  validateUrl: string;

  constructor (config: {
    loginUrl: string,
    logoutUrl: string,
    registerUrl: string,
    validateUrl: string
  }) {
    this.loginUrl = config.loginUrl;
    this.logoutUrl = config.logoutUrl;
    this.registerUrl = config.registerUrl;
    this.validateUrl = config.validateUrl;
  }

  public login (loginParams: Object): Observable<any> {
    return Observable.fromPromise(
      axios.post(this.logoutUrl, loginParams)
      .then((x: AxiosResponse<any>) => x.data));
  }

  public logout (): Observable<any> {
    return Observable.fromPromise(axios.delete(this.logoutUrl));
  }

  public validate(): Observable<any> {
    return Observable.fromPromise(axios.get(this.validateUrl));
  }

  public register(registerParams: Object): Observable<any> {
    return Observable.fromPromise(axios.post(this.registerUrl, registerParams));
  }
}
