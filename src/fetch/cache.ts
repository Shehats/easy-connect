import { Observable } from 'rxjs/Rx';
import * as _storage from 'localforage';
import { getName, create, isCacheable, isPrimitive, genInstance } from '../util';
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
    const _in = {
      data: data,
      expiry: <number> isCacheable(key) + Date.now()
    }
    return _storage.setItem(getName(key), _in as CacheData).then(_ => data);
  }

  private constructArray<T> (type: (new(...args:any[]) => T), x: Object[]) {
    let _key = getName(type);
    let items: T[] = [];
    _.forEach(x, y => {
      let item: T = is(type);
      items.push(genInstance(type, item, y));
    })
    return items;
  }

  private construct<T> (type: (new(...args:any[]) => T), x: Object) {
    let _data = is(type);
    return genInstance(type, _data, x);
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
        this.getData(key)
        .then(y => {
          y[id] = x;
          this.setData(key, y);
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
