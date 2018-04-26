import { Cache, Mutex,  Extra} from '../fetch';
import { create, isCacheable } from '../util';
import { Observable } from 'rxjs/Rx';
import * as _ from 'lodash';
import { Actions } from '../fetch';
import { IEasy, IMutex } from './';
import { Easy, EasySingleton } from 'easy-injectionjs';

@EasySingleton()
export class EasyConnect implements IEasy {
  @Easy()
  private mutex: Mutex;

  @Easy()
  private cache: Cache;

  @Easy()
  private actions: Actions;

  constructor() {
  }

  public getAll<T> (Type: (new(...args:any[]) => T),
    force?: boolean,
    url?: string, 
    ): Observable<T|T[]> {
    return this.mutex.getAll(Type, force, url)
    .do(x => {
      if (isCacheable(Type)) 
        this.cache.setItem(Type, x); 
    }).catch(err => isCacheable(Type)
      ? this.cache.getItem(Type)
      : Observable.throw("Couldn't get the data"));
  }

  public getById<T> (Type: (new(...args:any[]) => T), 
    id: any,
    force?: boolean,
    url?: string): Observable<T|T[]> {
    return this.mutex.getByKey(Type, id, force, url)
    .do(x => {
      if (isCacheable(Type))
        this.cache.setItemByKey(Type, x, id);
    }).catch(err => isCacheable(Type)
      ? this.cache.getItem(Type)
      : Observable.throw("Couldn't get the data"));
  }

  public getByFilter<T> (Type: (new(...args:any[]) => T), 
    key: any, 
    force?: boolean, 
    url?: string): Observable<T|T[]>{
    return this.mutex.getByFilter(Type, key, force, url)
    .do(x => {
      if (isCacheable(Type))
        this.cache.setItemByKey(Type, x, key);
    }).catch(err => isCacheable(Type)
      ? this.cache.getItem(Type)
      : Observable.throw("Couldn't get the data"));
  }

  public query <T> (Type: (new(...args:any[]) => T), args: string, url?: string): Observable<T[]> {
    return Extra.query(Type, args, url);
  }

  public create <T> (Type: (new(...args:any[]) => T), data: T | T[], url?: string): Observable<any> {
    return this.actions.postData(Type, data, url);
  }

  public update <T> (Type: (new(...args:any[]) => T), data: T| T[], url?: string): Observable<any> {
    return this.actions.updateData(Type, data, url);
  }

  public updateById <T> (Type: (new(...args:any[]) => T), data: T| T[], id?: any, url?: string): Observable<any> {
    return this.actions.updateDataById(Type, data, id, url);
  }

  public delete <T> (Type: (new(...args:any[]) => T), data: T | T[], url?: string): Observable<any> {
    return this.actions.deleteData(Type, url, data);
  }

  public deleteDataById <T> (Type: (new(...args:any[]) => T), data: T | T[], url?: string, id?: any): Observable<any> {
    return this.actions.deleteDataById(Type, data, id, url);
  }
}