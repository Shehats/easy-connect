import { Easily, is, EasyPrototype } from 'easy-injectionjs';
import { ApiBase, Api, Filter, IConfig, AuthType } from '../core'

export const isPrimitive = (type: any): boolean => (typeof type === "string" 
  || typeof type === "number" || typeof type === "boolean");


@EasyPrototype()
export class FilterContainer {}

@EasyPrototype()
export class QueryContainer {}

// Decorators
export const config = <T extends {new(...args:any[]):{}}> (value: ApiBase): any => function(target: T) {
  Easily('BASE_URL', value.baseUrl)
  Easily('AUTH_TYPE', value.authtype)
}

export const authConfig = <T extends {new(...args:any[]):{}}> (config: IConfig, authType?: AuthType): any => function(target: T) {
  Easily('CONFIG', config)
  Easily('AUTH_TYPE', authType)
}

export const api = <T extends {new(...args:any[]):{}}> (value: Api) => function (target: T): any {
  Easily('API_' + target.name, value);
}

export const key = (value?: string | Filter) => function (target: Object, propertykey: string): any {
  let _existing: FilterContainer = is('FILTER_' + target.constructor.name) || new FilterContainer();
  let _key: string = '';
  let _filter: Filter;
  if (!value || isPrimitive(value)) {
    if (value)
      _key = value.toString()
    _filter =  {
      key: (_key || propertykey),
      appendBase: true
    }
  }
  else {
    _filter = <Filter> value;
    if (!_filter.key)
      _filter.key = propertykey;
  }
  _existing[(_key || propertykey)] = _filter
  Easily('FILTER_' + target.constructor.name, _existing)
}

export const query = (value?: string | Filter) => function (target: Object, propertykey: string): any {
  let _existing: QueryContainer = is('QUERY_' + target.constructor.name) || new FilterContainer();
  let _key: string = '';
  let _filter: Filter;
  if (!value || isPrimitive(value)) {
    if (value)
      _key = value.toString()
    _filter =  {
      key: (_key || propertykey),
      appendBase: true
    }
  }
  else {
    _filter = <Filter> value;
    if (!_filter.key)
      _filter.key = propertykey;
  }
  if (! is('QUERY_CONFIG_' + target.constructor.name)) {
    _existing[(_key || propertykey)] = _filter
    Easily('QUERY_CONFIG_' + target.constructor.name , _existing);
    Easily('QUERY_KEY_'+target.constructor.name+'_'+(_key || propertykey), propertykey)
  }
}

export function id (target: Object, key: string) {
  Easily('ID_' + target.constructor.name, key);
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

export const accessQuery = <T extends {new(...args:any[]):{}}> (target: T, key: string): Filter => is('QUERY_CONFIG_'+target.name)[key]

export const accessFilter = <T extends {new(...args:any[]):{}}> (target: T, key: string): Filter => is('FILTER_' + target.name)[key]

export const isSecure = <T extends {new(...args:any[]):{}}> (target: T) => is('SECURE_'+target.name)

export const isCacheable = <T extends {new(...args:any[]):{}}> (target: T): number => is('CACHE_' + target.name)

export const getName = <T extends {new(...args:any[]):{}}> (instance: T): string => instance.name;

export const getBaseUrl = (): string => is('BASE_URL')

export const getQueryKey = <T extends {new(...args:any[]):{}}> (target: T, key: string): string => is('QUERY_KEY_'+target.name+'_'+key)
