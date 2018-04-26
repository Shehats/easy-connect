import { Observable } from 'rxjs/Rx';
import * as _ from 'lodash';
import { create,
         access,
         accessQuery, 
         constructArray } from '../util';

export class Extra {
  public static query <T> (Type: (new(...args:any[]) => T), args: string, url?: string): Observable<T[]> {
    let _data = create(Type);
    let _keys = access(_data);
    let _query = accessQuery(_data);
    return Observable.fromPromise(
      constructArray(Type, (url) 
      ? url + '?' + _query.queryKey + '=' + args
      : (_query.appendBase)
      ? _.keys.baseUrl + '/' + _query.queryUrl + '?' + _query.queryKey + '=' + args
      : _query.queryUrl + '?' + _query.queryKey + '=' + args))
  }
} 