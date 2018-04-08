import { Observable } from 'rxjs/Rx';
import { Actions, Store } from './';
import { IStore, IMutex } from '../core';
import * as _ from 'lodash';

export class Mutex implements IMutex {
  store: IStore;
  force: boolean = true;
  private static _instance: Mutex;

  private constructor () {
    this.store = Store.Instance;
    setInterval(() => {
      this.force = true;
    }, 15000)
  }

  public static get Instance() {
    return this._instance || (this._instance = new this());
  }

  public getAll<T> (Type: (new () => T), force?: boolean, url?: string): Observable<T|T[]> {
    return (force || this.force)
    ? this.store.putData(Type, Actions.getData(Type))
      .do(_ => this.force = false)
    : (this.store.check(Type))
    ? this.store.getData(Type)
      .do(_ => this.force = false)
    : this.store.putData(Type, Actions.getData(Type))
      .do(_ => this.force = false);
  }

  public getByKey<T> (Type: (new () => T), id: any, force?: boolean, url?: string): Observable<T> {
    return (force || this.force)
    ? this.store.putDataByKey(Type, Actions.getDataById(Type, id), id)
      .do(_ => this.force = false)
    : (this.store.checkByKey(Type, id))
    ? this.store.getDataByKey(Type, id)
      .do(_ => this.force = false)
    : this.store.putDataByKey(Type, Actions.getDataById(Type, id), id)
      .do(_ => this.force = false);
  }

  public getByFilter<T> (Type: (new () => T), key: any, force?: boolean, url?: string): Observable<T> {
    return (force || this.force)
    ? this.store.putDataByKey(Type, Actions.getDataByFilter(Type, key), key)
      .do(_ => this.force = false)
    : (this.store.checkByKey(Type, key))
    ? this.store.getDataByKey(Type, key)
      .do(_ => this.force = false)
    : this.store.putDataByKey(Type, Actions.getDataByFilter(Type, key), key)
      .do(_ => this.force = false);
  }
}