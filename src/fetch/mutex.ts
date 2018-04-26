import { Observable } from 'rxjs/Rx';
import { Actions, Store } from './';
import { IStore, IMutex } from '../core';
import * as _ from 'lodash';
import { EasySingleton, Easy } from 'easy-injectionjs';

@EasySingleton()
export class Mutex implements IMutex {
  @Easy('STORE')
  private store: IStore;

  @Easy()
  private actions: Actions;
  
  private force: boolean = true;

  constructor () {
    setInterval(() => {
      this.force = true;
    }, 15000)
  }

  public getAll<T> (Type: (new(...args:any[]) => T), force?: boolean, url?: string): Observable<T|T[]> {
    return (force || this.force)
    ? this.store.putData(Type, this.actions.getData(Type))
      .do(_ => this.force = false)
    : (this.store.check(Type))
    ? this.store.getData(Type)
      .do(_ => this.force = false)
    : this.store.putData(Type, this.actions.getData(Type))
      .do(_ => this.force = false);
  }

  public getByKey<T> (Type: (new(...args:any[]) => T), id: any, force?: boolean, url?: string): Observable<T> {
    return (force || this.force)
    ? this.store.putDataByKey(Type, this.actions.getDataById(Type, id), id)
      .do(_ => this.force = false)
    : (this.store.checkByKey(Type, id))
    ? this.store.getDataByKey(Type, id)
      .do(_ => this.force = false)
    : this.store.putDataByKey(Type, this.actions.getDataById(Type, id), id)
      .do(_ => this.force = false);
  }

  public getByFilter<T> (Type: (new(...args:any[]) => T), key: any, force?: boolean, url?: string): Observable<T> {
    return (force || this.force)
    ? this.store.putDataByKey(Type, this.actions.getDataByFilter(Type, key), key)
      .do(_ => this.force = false)
    : (this.store.checkByKey(Type, key))
    ? this.store.getDataByKey(Type, key)
      .do(_ => this.force = false)
    : this.store.putDataByKey(Type, this.actions.getDataByFilter(Type, key), key)
      .do(_ => this.force = false);
  }
}