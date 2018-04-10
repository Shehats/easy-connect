import { Observable } from 'rxjs/Rx';
import * as _storage from 'localforage';
import { getName, create } from '../util';
import * as _ from 'lodash';

export class Cache {
  public static getItem<T>(key: (new () => T)): Observable<T[]|T>{
    let _key = getName(create(key));
    let items: T[] = [];
    return Observable.fromPromise(
      _storage.getItem(_key)
      .then((x: Object| Object[]) => 
        (_.isArray(x))
        ? this.constructArray(key,x as Object[])
        : this.construct(key,x as Object)))
  }

  private static constructArray<T> (type: (new () => T), x: Object[]) {
    let _key = getName(create(type));
    let items: T[] = [];
    _.forEach(x, y => {
      let item: T = create(type);
      _.forEach(Object.getOwnPropertyNames(y), key => {
        item[_key] = y[key]
      })
      items.push(item);
    })
    return items;
  }

  private static construct<T> (type: (new () => T), x: Object) {
    let _data = create(type);
    _.forEach(Object.getOwnPropertyNames(x), key => {
        _data[key] = x[key]
      });
    return _data;
  }

  public static setItem<T>(key: (new () => T) | string, data: T[]|T): Observable<T[]|T> {
    return Observable.fromPromise(_storage.setItem((typeof key === "string")? key : getName(create(key)), data));
  }
  
  public static setItemByKey<T> (key: (new () => T), data: T[]|T, id: any): Observable<T[]|T> {
    return Cache.getItem(key)
    .flatMap(x => {
      x[id] = data;
      return Cache.setItem(key,x)
    });
  }

  public static setAsyncItemByKey <T> (key: (new () => T), data: Observable<T[]|T>, id: any): Observable<T[]|T> {
    return data.do((x: T[]|T) => {
        _storage.getItem(getName(create(key)))
        .then(y => {
          y[id] = x;
          _storage.setItem(getName(create(key)), y);
        })
    });
  }

  public static setAsycItem <T> (key: (new () => T), data: Observable<T[]|T>): Observable<T[]|T> {
  	return data.do((x: T[]|T) => {
  			_storage.setItem((typeof key === "string")? key : getName(create(key)), x)
  	});
  }

  public static removeItem<T>(key: (new () => T) | string): Observable<void> {
    return Observable.fromPromise(_storage.removeItem((typeof key === "string")? key : getName(create(key))));
  }

}
