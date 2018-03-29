import { Observable } from 'rxjs/Rx';
import { Cachable } from '../util/util';
import { Actions } from './actions';
import { Store, IStore } from './store';
import * as _ from 'lodash';

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

  public create<T> (Type: (new () => T), data: T | T[], url?: string): Observable<any> {
    return Actions.postData(Type, data, url);
  }

  public update<T> (Type: (new () => T), data: T| T[], url?: string): Observable<any> {
    return Actions.updateData(Type, data, url);
  }

  public delete<T> (Type: (new () => T), url?: string, data?: T | T[]): Observable<any> {
    return Actions.deleteData(Type, url, data);
  }

}