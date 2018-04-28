import { Observable } from 'rxjs/Rx';

export interface IStore {
  check<T> (key: (new(...args:any[]) => T) | string): boolean;
  checkByKey<T> (key: (new(...args:any[]) => T) | string, id: any): boolean;
  getData<T>(key: (new(...args:any[]) => T) | string): Observable<T|T[]>;
  getDataByKey<T> (key: (new(...args:any[]) => T) | string, id: any): Observable<T>;
  putData<T> (key: (new(...args:any[]) => T) | string, data: Observable<T|T[]>): Observable<T|T[]>;
  putDataByKey<T> (key: (new(...args:any[]) => T) | string, data: Observable<T>, id: any): Observable<T>;
}

export interface ISession {}

export interface Api {
  baseUrl?: string,
  getAll?: string,
  getById?: string,
  create?: string,
  update?: string,
  updateById?: string,
  delete?: string,
  deleteById?: string,  
  queryUrl?: string
}

export interface ApiBase {
  baseUrl: string,
  authtype?: AuthType
}

export interface Filter {
  key?: string,
  url?: string,
  appendBase?: boolean
}

export enum AuthType {
  TOKEN_AUTH,
  SESSION_AUTH
}

export interface IExtra {
  query<T>(Type: (new(...args:any[]) => T), url?: string): Observable<T|T[]>;
}

export interface IAuth {
  login(loginParams: Object): Observable<any>;
  logout(): Observable<any>;
  register(registerParams: Object): Observable<any>;
  validate(): Observable<any>;
  validateData(data: Object): Observable<any>;
}

export interface IMutex {
  getAll<T> (Type: (new(...args:any[]) => T), force?: boolean, url?: string): Observable<T|T[]>;
  getByKey<T> (Type: (new(...args:any[]) => T), id: any, force?: boolean, url?: string): Observable<T>;
  getByFilter<T> (Type: (new(...args:any[]) => T), key: any, force?: boolean, url?: string): Observable<T>;
}

export interface IConfig {
  loginUrl?: string,
  logoutUrl?: string,
  registerUrl?: string,
  validateUrl?: string,
  validateDataUrl?: string,
  prefix?: string, 
  key?:string,
  tokenExpiry?: number
}

export interface IEasy {
  getAll<T> (Type: (new(...args:any[]) => T), force?: boolean, url?: string): Observable<T|T[]>;
  getById<T> (Type: (new(...args:any[]) => T), id: any, force?: boolean, url?: string): Observable<T|T[]>;
  getByFilter<T> (Type: (new(...args:any[]) => T), key: any, force?: boolean, url?: string): Observable<T|T[]>;
  query <T> (Type: (new(...args:any[]) => T), args: string, url?: string): Observable<T[]>;
  create<T> (Type: (new(...args:any[]) => T), data: T | T[], url?: string): Observable<any>;
  update<T> (Type: (new(...args:any[]) => T), data: T| T[], url?: string): Observable<any>;
  updateById <T> (Type: (new(...args:any[]) => T), data: T| T[], id?: any, url?: string): Observable<any>;
  delete <T> (Type: (new(...args:any[]) => T), url?: string): Observable<any>;
  deleteDataById<T> (Type: (new(...args:any[]) => T), data: T | T[], url?: string, id?: any): Observable<any>;
}
