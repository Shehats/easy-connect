import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/from'
import 'rxjs/add/operator/do'
import { getName, create } from '../util/util';
import { IStore, ISession, ITypes } from '../core';

export class Store implements IStore{
  contents: ISession;
  private static _instance: Store;

  private constructor () {
    this.contents= new class implements ISession {}()
  }

  public static get Instance() {
    return this._instance || (this._instance = new this());
  }

  public getData<T> (key: (new () => T) | string): Observable<T|T[]> {
    return Observable.from(this.contents[(typeof key === "string")? key:getName(create(key))]);
  }

  public getDataByKey<T> (key: (new () => T) | string, id: any): Observable<T> {
    return Observable.from(this.contents[(typeof key === "string")? key:getName(create(key))][id]);
  }

  public putData<T> (key: (new () => T) | string, data: Observable<T|T[]>): Observable<T|T[]> {
    return data.do(x => {
      this.contents[(typeof key === "string")? key:getName(create(key))] = x;
    });
  }

  public putDataByKey<T> (key: (new () => T) | string, data: Observable<T>, id: any): Observable<T> {
    return data.do(x => {
      this.contents[(typeof key === "string")? key:getName(create(key))][id] = x;
    });
  }

  public check<T> (key: (new () => T) | string): boolean {
    return this.contents[(typeof key === "string")? key:getName(create(key))]
    ? true : false;
  }

  public checkByKey<T> (key: (new () => T) | string, id: any): boolean {
    return this.contents[(typeof key === "string")? key:getName(create(key))][id]
    ? true : false; 
  }
}
