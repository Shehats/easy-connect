import { Observable } from 'rxjs/Rx';
import * as _storage from 'localforage';
import { getName, create } from '../util';
import * as _ from 'lodash';
import { Easy, EasySingleton } from 'easy-injectionjs';

@EasySingleton()
export class Cache {
  public getItem<T>(key: (new(...args:any[]) => T)): Observable<T[]|T>{
    let _key = getName(key);
    let items: T[] = [];
    return Observable.fromPromise(
      _storage.getItem(_key)
      .then((x: Object| Object[]) => 
        (_.isArray(x))
        ? this.constructArray(key,x as Object[])
        : this.construct(key,x as Object)))
  }

  private constructArray<T> (type: (new(...args:any[]) => T), x: Object[]) {
    let _key = getName(type);
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

  private construct<T> (type: (new(...args:any[]) => T), x: Object) {
    let _data = create(type);
    _.forEach(Object.getOwnPropertyNames(x), key => {
        _data[key] = x[key]
      });
    return _data;
  }

  public setItem<T>(key: (new(...args:any[]) => T) | string, data: T[]|T): Observable<T[]|T> {
    return Observable.fromPromise(_storage.setItem((typeof key === "string")? key : getName(key), data));
  }
  
  public setItemByKey<T> (key: (new(...args:any[]) => T), data: T[]|T, id: any): Observable<T[]|T> {
    return this.getItem(key)
    .flatMap(x => {
      x[id] = data;
      return this.setItem(key,x)
    });
  }

  public setAsyncItemByKey <T> (key: (new(...args:any[]) => T), data: Observable<T[]|T>, id: any): Observable<T[]|T> {
    return data.do((x: T[]|T) => {
        _storage.getItem(getName(key))
        .then(y => {
          y[id] = x;
          _storage.setItem(getName(key), y);
        })
    });
  }

  public setAsycItem <T> (key: (new(...args:any[]) => T), data: Observable<T[]|T>): Observable<T[]|T> {
  	return data.do((x: T[]|T) => {
  			_storage.setItem((typeof key === "string")? key : getName(key), x)
  	});
  }

  public static removeItem<T>(key: (new(...args:any[]) => T) | string): Observable<void> {
    return Observable.fromPromise(_storage.removeItem((typeof key === "string")? key : getName(key)));
  }

}
