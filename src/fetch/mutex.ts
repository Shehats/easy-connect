import { Observable } from 'rxjs/Rx';
import { Cachable } from '../util/util';
import { Actions } from './actions';
import { Store } from './store';
import { IStore, IMutex, ITypes } from '../core';
import * as _ from 'lodash';
import { injectable, inject } from "inversify";

@injectable()
export class Mutex implements IMutex {
  store: IStore;
  constructor (
    @inject(ITypes.IStore) store?: IStore
    ) {
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