import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/from'
import 'rxjs/add/operator/do'
import { getName, create } from '../util';
import { IStore, ISession } from '../core';
import { Easy, EasySingleton } from 'easy-injectionjs';

@EasySingleton('STORE')
export class Store implements IStore{
  private contents: ISession;
  constructor () {
    this.contents= new class implements ISession {}()
  }

  public getData<T> (key: (new(...args:any[]) => T)): Observable<T|T[]> {
    return Observable.of(this.contents[getName(key)]);
  }

  public getDataByKey<T> (key: (new(...args:any[]) => T), id: any): Observable<T> {
    return Observable.of(this.contents[getName(key)][id]);
  }

  public putData<T> (key: (new(...args:any[]) => T), data: Observable<T|T[]>): Observable<T|T[]> {
    return data.do(x => {
      this.contents[getName(key)] = x;
    });
  }

  public putDataByKey<T> (key: (new(...args:any[]) => T), data: Observable<T>, id: any): Observable<T> {
    return data.do(x => {
      this.contents[getName(key)][id] = x;
    });
  }

  public check<T> (key: (new(...args:any[]) => T)): boolean {
    return this.contents[getName(key)] ? true : false;
  }

  public checkByKey<T> (key: (new(...args:any[]) => T), id: any): boolean {
    return this.contents[getName(key)][id]
    ? true : false; 
  }
}
