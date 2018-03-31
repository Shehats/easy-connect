import { Observable } from 'rxjs/Rx';
import { Cachable } from '../util/util';
import { Actions } from './actions';
import { Store, IStore } from './store';
import * as _ from 'lodash';
import { Injectable } from '@angular/core';

@Injectable()
export class Mutex {
  store: IStore;
  constructor (store?: IStore) {
    this.store = (store) ? store: new Store();
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
}