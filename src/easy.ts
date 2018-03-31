import { Cache } from './fetch/cache';
import { Mutex } from './fetch/mutex';
import { Injectable } from '@angular/core';
import { create, Cachable } from './util/util';
import { Observable } from 'rxjs/Rx';
import * as _ from 'lodash';
import { Actions } from './fetch/actions';


@Injectable()
export class Easy {
  mutex: Mutex;
  interval: number;
  all: boolean;
  get: boolean;
  
  constructor(interval?: number,
              prefix?: string,
              mutex?: Mutex) {
    this.mutex = (mutex)? mutex: new Mutex();
    this.interval = (interval)? interval : 30000;
    this.all = true;
    this.get = true;
  }

  public getAll<T> (Type: (new () => T),
    url?: string, 
    force?: boolean): Observable<T|T[]> {
    return this.mutex.getAll(Type, (force || this.all))
    .do(x => {
      if (create(Type) instanceof Cachable)
        Cache.setItem(Type, x); 
    })
  }

  public getByKey<T> (Type: (new () => T), 
    id: any,
    force?: boolean,
    url?: string): Observable<T|T[]> {
    return this.mutex.getByKey(Type, id, (force || this.get))
    .do(x => {
      if (create(Type) instanceof Cachable)
        Cache.setItemByKey(Type, x, id);
    })
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