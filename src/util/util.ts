import "reflect-metadata";
import { EasySingleton, EasyPrototype, Easily } from 'easy-injectionjs';

// Decorators

export const config = <T extends {new(...args:any[]):{}}> (value: {}): any => function(target: T) {
  @EasyPrototype()
  class Data extends target {
    
  }
  var val = Data;
  return val;
}

export const api = <T extends {new(...args:any[]):{}}> (value: {
  baseUrl?: string,
  getAll?: string,
  getById?: string,
  create?: string,
  update?: string,
  updateById?: string,
  delete?: string,
  deleteById?: string,
  id?: string,  
  queryUrl?: string,
}) => function (target: T): any {
  Reflect.defineMetadata('api', value, target);
  @EasyPrototype(target.name)
  class Data extends target {}
  let val: T = Data;
  return val;
}

export function id (target: Object, key: string) {
  Easily(target.constructor.name + '_ID', key);
}

export function query (target: Object, key: string) {
  Easily(target.constructor.name + '_QUERY', key);
}


export const cacheable = (expiry?: number) => function (target: Function) {
  Reflect.defineMetadata('cacheable', expiry, target)
}

export const secure = (value?: boolean) => function (target: Function) {
  Reflect.defineMetadata('secure', value, target);
}

// Accessors
export function create<T>(type: (new(...args:any[]) => T)): T {
  return new type();
}

export const access = (instance: any) => Reflect.getMetadata('api', instance.constructor);

export const accessKey = (instance: any) => Reflect.getMetadata('key', instance.constructor);

export const accessQuery = (instance: any) => Reflect.getMetadata('query', instance.constructor);

export const isSecure = (instance: any) => Reflect.hasMetadata('secure', instance.constructor);

export const cacheExpiry = (instance: any) => Reflect.getMetadata('cacheable', instance.constructor);

export const isCacheable = (instance: any) => Reflect.hasMetadata('cacheable', instance.constructor)

export const getName = <T extends {new(...args:any[]):{}}> (instance: T): string => instance.name;
