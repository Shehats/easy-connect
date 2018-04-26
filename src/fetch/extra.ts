import { Observable } from 'rxjs/Rx';
import * as _ from 'lodash';
import { create,
         access,
         accessQuery, 
         constructArray,
         getBaseUrl } from '../util';
import { Api } from '../core'

export class Extra {
  public static query <T> (Type: (new(...args:any[]) => T), args: string, url?: string): Observable<T[]> {
    let _keys = <Api> access(Type);
    let _baseUrl = getBaseUrl();
    let _query = accessQuery(Type);
    return Observable.fromPromise(
      constructArray(Type, (url) 
      ? url + '?' + _query + '=' + args
      : (_baseUrl && _keys.queryUrl)
      ? _baseUrl + '/' + _keys.queryUrl + '?' + _query + '=' + args
      : (_baseUrl)
      ? _baseUrl + '?' + _query + '=' + args
      : (_keys.baseUrl && _keys.queryUrl)
      ? _keys.baseUrl + '/' + _keys.queryUrl + '?' + _query + '=' + args
      : _keys.queryUrl + '?' + _query + '=' + args))
  }
} 