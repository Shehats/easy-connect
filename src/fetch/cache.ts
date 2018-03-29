import { Observable } from 'rxjs/Rx';
import * as _storage from 'localforage';
import { getName, create, Cachable } from '../util/util';


export class Cache {
  public static getItem<T extends Cachable>(key: (new () => T)): Observable<T[]|T>{
    // return Observable.fromPromise(_storage.getItem((typeof key === "string")? key : getName(create(key))));
    return Observable.of(create(key))
  }
  public static setItem<T extends Cachable>(key: (new () => T) | string, data: T[]|T): Observable<T[]|T> {
    return Observable.fromPromise(_storage.setItem((typeof key === "string")? key : getName(create(key)), data));
  }
  public static removeItem<T extends Cachable>(key: (new () => T) | string): Observable<void> {
    return Observable.fromPromise(_storage.removeItem((typeof key === "string")? key : getName(create(key))));
  }

}
