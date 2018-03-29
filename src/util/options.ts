import { HttpFactory } from '../auth/auth-interceptor';
import { create, access } from './util';
import * as _ from 'lodash';

export function construct<T> (Type: (new () => T), url: string, id: any): Promise<T> {
	let _data = create(Type);
	return HttpFactory.getHttp(Type).toPromise()
	.then(http => http.get(url+`/${id}`)
		.then(x => {
			_.forEach(Object.getOwnPropertyNames(x.data), key => {
				_data[key] = x.data[key]
			});
			return _data;
		}))
}

export function constructArray<T> (Type: (new () => T), url: string): Promise<T[]> {
	let items: T[] = [];
	return HttpFactory.getHttp(Type).toPromise()
	.then(http => http.get(url))
	.then(x => {
		_.forEach(x.data, y => {
			let item: T = create(Type);
			_.forEach(Object.getOwnPropertyNames(y), key => {
				item[key] = y[key]
			})
			items.push(item);
		})
		return items;
	})
}

export function createApiData<T> (Type: (new () => T), url: string, data: T | T[]): Promise<any> {
  return HttpFactory.getHttp(Type).toPromise()
  .then(http => http.post(url, data));
}

export function updateApiData<T> (Type: (new () => T), url: string, data: T | T[]): Promise<any> {
  return HttpFactory.getHttp(Type).toPromise()
  .then(http => http.put(url, data));
}

export function deleteApiData<T> (Type: (new () => T), url: string, data?: T | T[]): Promise<any> {
  return HttpFactory.getHttp(Type).toPromise()
  .then(http => (data) ? http.put(url, data): http.put(url));
}

