import { Observable } from 'rxjs/Rx';
import * as _storage from 'localforage';
import { getName, create, isCacheable, isPrimitive } from '../util';
import * as _ from 'lodash';
import { Easy, EasySingleton, is } from 'easy-injectionjs';

export interface CacheData {
  data: Object | Object[],
  expiry: number
}

@EasySingleton()
export class Cache {
  public getItem<T>(key: (new(...args:any[]) => T)): Observable<T[]|T|any>{
    let _key = getName(key);
    return Observable.fromPromise(this.getData(key));
  }

  private getData<T>(key: (new(...args:any[]) => T)): Promise<T[]|T>{
    let _key = getName(key);
    return _storage.getItem(_key)
      .then((x: CacheData) =>
        (x.expiry < Date.now())
        ? (_.isArray(x.data))
        ? this.constructArray(key,x.data as Object[])
        : this.construct(key,x.data as Object)
        : (_storage.removeItem(_key).then(y => null)))
  }

  private setData<T> (key: (new(...args:any[]) => T), data: T[]|T): Promise<T[]|T> {
    return _storage.setItem(getName(key),  class implements CacheData {
      data = data;
      expiry = <number> isCacheable(key) + Date.now()
    }).then(_ => data);
  }

  private constructArray<T> (type: (new(...args:any[]) => T), x: Object[]) {
    let _key = getName(type);
    let items: T[] = [];
    _.forEach(x, y => {
      let item: T = is(type);
      _.forEach(Object.getOwnPropertyNames(y), key => {
        if(item[key] && !isPrimitive(y[key])) {
          _.forEach(Object.getOwnPropertyNames(y[key]), g => {
            item[key][g] = y[key][g]
          })
        } else {
          item[key] = y[key]
        }
      })
      items.push(item);
    })
    return items;
  }

  private construct<T> (type: (new(...args:any[]) => T), x: Object) {
    let _data = is(type);
    _.forEach(Object.getOwnPropertyNames(x), key => {
        if(_data[key] && !isPrimitive(x[key])) {
          _.forEach(Object.getOwnPropertyNames(x[key]), y => {
            _data[key][y] = x[key][y]
          })
        } else {
          _data[key] = x[key]
        }
      });
    return _data;
  }

  public setItem<T>(key: (new(...args:any[]) => T), data: T[]|T): Observable<T[]|T> {
    return Observable.fromPromise(this.setData(key, data));
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
  			this.setData(key, x);
  	});
  }

  public static removeItem<T>(key: (new(...args:any[]) => T)): Observable<void> {
    return Observable.fromPromise(_storage.removeItem(getName(key)));
  }

}
