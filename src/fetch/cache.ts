import { Observable } from 'rxjs/Rx';
import * as _storage from 'localforage';
import { getName, create, Cachable } from '../util/util';
import * as _ from 'lodash';

export class Cache {
  public static getItem<T>(key: (new () => T) | string): Observable<T[]|T>{
    return Observable.fromPromise(_storage.getItem((typeof key === "string")? key : getName(create(key))));
  }

  public static setItem<T>(key: (new () => T) | string, data: T[]|T): Observable<T[]|T> {
    return Observable.fromPromise(_storage.setItem((typeof key === "string")? key : getName(create(key)), data));
  }
  
  public static setItemByKey<T> (key: (new () => T) | string, data: T[]|T, id: any): Observable<T[]|T> {
    return Cache.getItem(key)
    .flatMap(x => {
      x[id] = data;
      return Cache.setItem(key,x)
    });
  }

  public static setAsyncItemByKey <T> (key: (new () => T) | string, data: Observable<T[]|T>, id: any): Observable<T[]|T> {
    return data.do((x: T[]|T) => {
        _storage.getItem((typeof key === "string")? key : getName(create(key)))
        .then(y => {
          y[id] = x;
          _storage.setItem((typeof key === "string")? key : getName(create(key)), y);
        })
    });
  }

  public static setAsycItem <T> (key: (new () => T) | string, data: Observable<T[]|T>): Observable<T[]|T> {
  	return data.do((x: T[]|T) => {
  			_storage.setItem((typeof key === "string")? key : getName(create(key)), x)
  	});
  }

  public static removeItem<T>(key: (new () => T) | string): Observable<void> {
    return Observable.fromPromise(_storage.removeItem((typeof key === "string")? key : getName(create(key))));
  }

}
