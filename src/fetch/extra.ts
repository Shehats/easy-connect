import { Observable } from 'rxjs/Rx';
import * as _ from 'lodash';
import { create,
         access,
         accessQuery, 
         constructArray,
         getBaseUrl } from '../util';
import { Api, Filter } from '../core'
import { EasySingleton } from 'easy-injectionjs';

@EasySingleton()
export class Extra {
  public query <T> (Type: (new(...args:any[]) => T), 
    key: string, args: string, url?: string): Observable<T[]> {
    let _keys = <Api> access(Type);
    let _baseUrl = getBaseUrl();
    let _query: Filter = accessQuery(Type, key);
    return Observable.fromPromise(
      constructArray(Type, (url) 
      ? url + '?' + _query.key + '=' + args
      : (_keys.baseUrl && _query.url && _query.appendBase)
      ? _keys.baseUrl + '/' + _query.url + '?' + _query.key + '=' + args
      : _keys.baseUrl + '?' + _query.key + '=' + args))
  }
} 