import { Observable } from 'rxjs/Rx';
import { Cachable } from '../util/util';
import { Actions } from './actions';
import { Store } from './store';
import { IStore, IMutex } from '../core/core';
import * as _ from 'lodash';

export class Mutex implements IMutex {
  store: IStore;
  private static _instance: Mutex;

  private constructor () {
    this.store = Store.Instance;
  }

  public static get Instance() {
    return this._instance || (this._instance = new this());
  }

  public getAll<T> (Type: (new () => T), force?: boolean, url?: string): Observable<T|T[]> {
    return (force)
    ? this.store.putData(Type, Actions.getData(Type))
    : (this.store.check(Type))
    ? this.store.getData(Type)
    : this.store.putData(Type, Actions.getData(Type));
  }

  public getByKey<T> (Type: (new () => T), id: any, force?: boolean, url?: string): Observable<T> {
    return (force)
    ? this.store.putDataByKey(Type, Actions.getDataById(Type, id), id)
    : (this.store.checkByKey(Type, id))
    ? this.store.getDataByKey(Type, id)
    : this.store.putDataByKey(Type, Actions.getDataById(Type, id), id);
  }

  public getByFilter<T> (Type: (new () => T), key: any, force?: boolean, url?: string): Observable<T> {
    return (force)
    ? this.store.putDataByKey(Type, Actions.getDataByFilter(Type, key), key)
    : (this.store.checkByKey(Type, key))
    ? this.store.getDataByKey(Type, key)
    : this.store.putDataByKey(Type, Actions.getDataByFilter(Type, key), key);
  }
}