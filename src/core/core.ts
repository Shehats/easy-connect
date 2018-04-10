import { Observable } from 'rxjs/Rx';

export interface IStore {
  check<T> (key: (new () => T) | string): boolean;
  checkByKey<T> (key: (new () => T) | string, id: any): boolean;
  getData<T>(key: (new () => T) | string): Observable<T|T[]>;
  getDataByKey<T> (key: (new () => T) | string, id: any): Observable<T>;
  putData<T> (key: (new () => T) | string, data: Observable<T|T[]>): Observable<T|T[]>;
  putDataByKey<T> (key: (new () => T) | string, data: Observable<T>, id: any): Observable<T>;
}

export interface ISession {}

export enum AuthType {
  TOKEN_AUTH,
  SESSION_AUTH
}

export interface IExtra {
  query<T>(Type: (new () => T), url?: string): Observable<T|T[]>;
}

export interface IAuth {
  login(loginParams: Object): Observable<any>;
  logout(): Observable<any>;
  register(registerParams: Object): Observable<any>;
  validate(): Observable<any>;
}

export interface IMutex {
  getAll<T> (Type: (new () => T), force?: boolean, url?: string): Observable<T|T[]>;
  getByKey<T> (Type: (new () => T), id: any, force?: boolean, url?: string): Observable<T>;
  getByFilter<T> (Type: (new () => T), key: any, force?: boolean, url?: string): Observable<T>;
}

export interface IConfig {
  loginUrl?: string,
  logoutUrl?: string,
  registerUrl?: string,
  validateUrl?: string,
  prefix?: string, 
  key?:string
}

export interface IEasy {
  getAll<T> (Type: (new () => T), force?: boolean, url?: string): Observable<T|T[]>;
  getById<T> (Type: (new () => T), id: any, force?: boolean, url?: string): Observable<T|T[]>;
  getByFilter<T> (Type: (new () => T), key: any, force?: boolean, url?: string): Observable<T|T[]>;
  query <T> (Type: (new () => T), args: string, url?: string): Observable<T[]>;
  create<T> (Type: (new () => T), data: T | T[], url?: string): Observable<any>;
  update<T> (Type: (new () => T), data: T| T[], url?: string): Observable<any>;
  updateById <T> (Type: (new () => T), data: T| T[], id?: any, url?: string): Observable<any>;
  delete<T> (Type: (new () => T), data: T | T[], url?: string): Observable<any>;
  deleteDataById<T> (Type: (new () => T), data: T | T[], url?: string, id?: any): Observable<any>;
}
