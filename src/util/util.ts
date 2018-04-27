import { Easily, is, EasyPrototype } from 'easy-injectionjs';
import { ApiBase, Api, Filter } from '../core'

@EasyPrototype()
export class FilterContainer {} 

// Decorators
export const config = <T extends {new(...args:any[]):{}}> (value: ApiBase): any => function(target: T) {
  Easily('BASE_URL', value.baseUrl)
  Easily('AUTH_TYPE', value.authtype)
}

export const api = <T extends {new(...args:any[]):{}}> (value: Api) => function (target: T): any {
  Easily('API_' + target.name, value);
}

export const key = (url?: string) => function (target: Object, key: string): any {
  let _existing: FilterContainer = is('FILTER_' + target.constructor.name) || new FilterContainer();
  _existing[key] = class implements Filter {
    filterKey = key;
    filterUrl = url;
  }
  Easily('FILTER_' + target.constructor.name, _existing)
}

export function id (target: Object, key: string) {
  Easily('ID_' + target.constructor.name, key);
}

export function query (target: Object, key: string) {
  Easily('QUERY_' + target.constructor.name , key);
}

export const cacheable = <T extends {new(...args:any[]):{}}>(expiry?: number) => function (target: T) {
  Easily('CACHE_' + target.name, expiry || 6480000);
}

export function secure <T extends {new(...args:any[]):{}}> (target: T) {
  Easily('SECURE_' + target.name, true);
}

// Accessors
export function create<T>(type: (new(...args:any[]) => T)): T {
  return new type();
}

export const access = <T extends {new(...args:any[]):{}}> (target: T) => is('API_'+target.name)

export const accessId = <T extends {new(...args:any[]):{}}> (target: T) => is('ID_'+target.name)

export const accessQuery = <T extends {new(...args:any[]):{}}> (target: T) => is('QUERY_'+target.name)

export const accessFilter = <T extends {new(...args:any[]):{}}> (target: T, key: string): Filter => is('FILTER_' + target.name)[key]

export const isSecure = <T extends {new(...args:any[]):{}}> (target: T) => is('SECURE_'+target.name)

export const isCacheable = <T extends {new(...args:any[]):{}}> (target: T): number => is('CACHE_' + target.name)

export const getName = <T extends {new(...args:any[]):{}}> (instance: T): string => instance.name;

export const getBaseUrl = (): string => is('BASE_URL')

export const isPrimitive = (type: any): boolean => (typeof type === "string" 
  || typeof type === "number" || typeof type === "boolean");
