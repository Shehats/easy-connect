import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/from'
import 'rxjs/add/operator/do'
import { getName, create } from '../util/util';
import { IStore, ISession } from '../core/core';

export class Store implements IStore{
  contents: ISession;
  private static _instance: Store;

  private constructor () {
    this.contents= new class implements ISession {}()
  }

  public static get Instance() {
    return this._instance || (this._instance = new this());
  }

  public getData<T> (key: (new () => T)): Observable<T|T[]> {
    return Observable.from(this.contents[getName(create(key))]);
  }

  public getDataByKey<T> (key: (new () => T), id: any): Observable<T> {
    return Observable.from(this.contents[getName(create(key))][id]);
  }

  public putData<T> (key: (new () => T), data: Observable<T|T[]>): Observable<T|T[]> {
    return data.do(x => {
      this.contents[getName(create(key))] = x;
    });
  }

  public putDataByKey<T> (key: (new () => T), data: Observable<T>, id: any): Observable<T> {
    return data.do(x => {
      this.contents[getName(create(key))][id] = x;
    });
  }

  public check<T> (key: (new () => T)): boolean {
    return this.contents[getName(create(key))] ? true : false;
  }

  public checkByKey<T> (key: (new () => T), id: any): boolean {
    return this.contents[getName(create(key))][id]
    ? true : false; 
  }
}
