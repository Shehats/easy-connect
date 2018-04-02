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

export interface IAuth {
  login(loginParams: Object): Observable<any>;
  logout(): Observable<any>;
  register(registerParams: Object): Observable<any>;
  validate(): Observable<any>;
}

export interface IMutex {
  getAll<T> (Type: (new () => T), force?: boolean, url?: string): Observable<T|T[]>;
  getByKey<T> (Type: (new () => T), id: any, force?: boolean, url?: string): Observable<T>;
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
  getAll<T> (Type: (new () => T), url?: string, force?: boolean): Observable<T|T[]>;
  getByKey<T> (Type: (new () => T), id: any, force?: boolean, url?: string): Observable<T|T[]>;
  create<T> (Type: (new () => T), data: T | T[], url?: string): Observable<any>;
  update<T> (Type: (new () => T), data: T| T[], url?: string): Observable<any>;
  delete<T> (Type: (new () => T), url?: string, data?: T | T[]): Observable<any>
}

export const ITypes = {
  IStore: Symbol('IStore'),
  ISession: Symbol('ISession'),
  IAuth: Symbol('IAuth'),
  IMutex: Symbol('IMutex'),
  IConfig: Symbol('IConfig'),
  IEasy: Symbol('IEasy')
}