import "reflect-metadata";

export const access = (instance: any) => Reflect.getMetadata('api', instance.constructor);

export const secure = (value: boolean) => function (target: Function) {
	Reflect.defineMetadata('secure', value, target);
}

export const isSecure = (instance: any) => Reflect.getMetadata('secure', instance.constructor);

export const getName = (instance: any) => instance.constructor.name;

export function create<T>(type: (new () => T)): T {
	return new type();
}

export const api = (value: {
	getAll?: string,
	getById?: string,
	create?: string,
	update?: string,
	delete?: string
}) => function (target: Function) {
	Reflect.defineMetadata('api', value, target);
}


export interface Cachable {}
