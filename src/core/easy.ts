import { Cache } from '../fetch/cache';
import { Mutex } from '../fetch/mutex';
import { create, Cachable } from '../util/util';
import { Observable } from 'rxjs/Rx';
import * as _ from 'lodash';
import { Actions } from '../fetch/actions';
import { injectable, inject } from "inversify";
import { ITypes, IEasy } from './core'

@injectable()
export class Easy implements IEasy {
  mutex: Mutex;
  
  constructor(@inject(ITypes.IMutex) mutex?: Mutex) {
    this.mutex = (mutex)? mutex: new Mutex();
  }

  public getAll<T> (Type: (new () => T),
    force?: boolean,
    url?: string, 
    ): Observable<T|T[]> {
    return this.mutex.getAll(Type, force, url)
    .do(x => {
      if (create(Type) instanceof Cachable) 
        Cache.setItem(Type, x); 
    })
  }

  public getByKey<T> (Type: (new () => T), 
    id: any,
    force?: boolean,
    url?: string): Observable<T|T[]> {
    return this.mutex.getByKey(Type, id, force, url)
    .do(x => {
      if (create(Type) instanceof Cachable)
        Cache.setItemByKey(Type, x, id);
    })
  }

  public getByFilter<T> (Type: (new () => T), 
    key: any, 
    force?: boolean, 
    url?: string): Observable<T> {
    return this.mutex.getByFilter(Type, key, force, url)
    .do(x => {
      if (create(Type) instanceof Cachable)
        Cache.setItemByKey(Type, x, key);
    })
  }

  public create<T> (Type: (new () => T), data: T | T[], url?: string): Observable<any> {
    return Actions.postData(Type, data, url);
  }

  public update<T> (Type: (new () => T), data: T| T[], url?: string): Observable<any> {
    return Actions.updateData(Type, data, url);
  }

  public updateById<T> (Type: (new () => T), data: T| T[], id?: any, url?: string): Observable<any> {
    return Actions.updateDataById(Type, data, id, url);
  }

  public delete<T> (Type: (new () => T), url?: string, data?: T | T[]): Observable<any> {
    return Actions.deleteData(Type, url, data);
  }

  public deleteDataById<T> (Type: (new () => T), data: T | T[], url?: string, id?: any): Observable<any> {
    return Actions.deleteDataById(Type, data, id, url);
  }
}