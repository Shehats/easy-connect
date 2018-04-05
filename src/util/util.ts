import "reflect-metadata";

// Decorators
export const api = (value: {
  baseUrl?: string,
  getAll?: string,
  getById?: string,
  create?: string,
  update?: string,
  updateById?: string,
  delete?: string,
  deleteById?: string,
  id?: string
}) => function (target: Function) {
  Reflect.defineMetadata('api', value, target);
}

export const key = (value: {
  filterKey: string,
  appendBaseUrl: boolean,
  filterUrl?: string
}) => function (target: Function) {
  Reflect.defineMetadata('key', value, target);
}

export const query = (value: {
  queryKey: string,
  queryUrl?: string
}) => function (target: Function) {
  Reflect.defineMetadata('query', value, target);
}

export const secure = (value: boolean) => function (target: Function) {
  Reflect.defineMetadata('secure', value, target);
}

// Accessors
export function create<T>(type: (new () => T)): T {
  return new type();
}

export const access = (instance: any) => Reflect.getMetadata('api', instance.constructor);

export const accessKey = (instance: any) => Reflect.getMetadata('key', instance.constructor);

export const accessQuery = (instance: any) => Reflect.getMetadata('query', instance.constructor);

export const isSecure = (instance: any) => Reflect.getMetadata('secure', instance.constructor);

export const getName = (instance: any) => instance.constructor.name;

export abstract class Cachable {}
