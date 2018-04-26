import { HttpFactory } from '../auth';
import { create, access } from './';
import * as _ from 'lodash';
import { is } from 'easy-injectionjs';

export function construct<T> (Type: (new () => T), 
							  url: string, id: any,
							  _http: HttpFactory = is(HttpFactory)): Promise<T> {
	let _data = create(Type);
	return _http.getHttp(Type).toPromise()
	.then(http => http.get(url+`/${id}`)
		.then(x => {
			_.forEach(Object.getOwnPropertyNames(x.data), key => {
				_data[key] = x.data[key]
			});
			return _data;
		}))
}

export function constructArray<T> (Type: (new () => T), 
	                               url: string,
	                               _http: HttpFactory = is(HttpFactory)): Promise<T[]> {
	let items: T[] = [];
	return _http.getHttp(Type).toPromise()
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

export function createApiData<T> (Type: (new () => T),
	                              url: string, data: T | T[],
	                              _http: HttpFactory = is(HttpFactory)): Promise<any> {
  return _http.getHttp(Type).toPromise()
  .then(http => http.post(url, data));
}

export function updateApiData<T> (Type: (new () => T), 
								  url: string, data: T | T[],
								  _http: HttpFactory = is(HttpFactory)): Promise<any> {
  return _http.getHttp(Type).toPromise()
  .then(http => http.put(url, data));
}

export function deleteApiData<T> (Type: (new () => T), 
								  url: string, data?: T | T[],
								  _http: HttpFactory = is(HttpFactory)): Promise<any> {
  return _http.getHttp(Type).toPromise()
  .then(http => (data) ? http.put(url, data): http.put(url));
}

