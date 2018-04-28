import { HttpFactory } from '../auth';
import { create, access, isPrimitive } from './';
import * as _ from 'lodash';
import { is } from 'easy-injectionjs';

export function genInstance<T> (Type: (new (...args: any[]) => T), target: T, match: Object) {
  _.forEach(Object.getOwnPropertyNames(match), x => {
    if(target[x] && !isPrimitive(match[x])) {
      genInstance(Type, target[x], match[x])
    } else {
      target[x] = match[x]
    }
  })
  return target;
}

export function construct<T> (Type: (new (...args: any[]) => T),
							  url: string, id: any,
							  _http: HttpFactory = is(HttpFactory)): Promise<T> {
	let _data = is(Type);
	return _http.getHttp(Type).toPromise()
	.then(http => http.get(url+`/${id}`)
		.then(x => {
      return genInstance(Type, _data, x.data)
		}))
}

export function constructArray<T> (Type: (new (...args: any[]) => T),
	                               url: string,
	                               _http: HttpFactory = is(HttpFactory)): Promise<T[]> {
	let items: T[] = [];
	return _http.getHttp(Type).toPromise()
	.then(http => http.get(url))
	.then(x => {
		_.forEach(x.data, y => {
			let item: T = is(Type);
			items.push(genInstance(Type, item, y));
		})
		return items;
	})
}

export function createApiData<T> (Type: (new (...args: any[]) => T),
	                              url: string, data: T | T[],
	                              _http: HttpFactory = is(HttpFactory)): Promise<any> {
  return _http.getHttp(Type).toPromise()
  .then(http => http.post(url, data));
}

export function updateApiData<T> (Type: (new (...args: any[]) => T),
								  url: string, data: T | T[],
								  _http: HttpFactory = is(HttpFactory)): Promise<any> {
  return _http.getHttp(Type).toPromise()
  .then(http => http.put(url, data));
}

export function deleteApiData<T> (Type: (new (...args: any[]) => T),
								  url: string,_http: HttpFactory = is(HttpFactory)): Promise<any> {
  return _http.getHttp(Type).toPromise()
  .then(http => http.delete(url));
}
