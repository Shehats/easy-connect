import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/fromPromise';
import 'rxjs/add/operator/map'
import 'rxjs/add/operator/catch'
import { create, access } from '../util/util';
import { construct, constructArray, createApiData, updateApiData, deleteApiData } from '../util/options';
import { Injectable } from '@angular/core';

@Injectable()
export class Actions {
  public static getData<T> (Type: (new () => T), url?: string): Observable<T[]> {
    let _data = create(Type);
    let _keys = access(_data);
    return (url)
    ? Observable.fromPromise(constructArray(Type, url))
    : (_keys.getAll)
    ? Observable.fromPromise(constructArray(Type, _keys.getAll))
    : Observable.throw('No data url was defined.');
  }

  public static getDataById <T> (Type: (new () => T), id: any, url?: string): Observable<T> {
    let _keys = access(create(Type));
    return (url)
    ? Observable.fromPromise(construct(Type, url, id))
    : (_keys.getById)
    ? Observable.fromPromise(construct(Type, _keys.getById, id))
    : Observable.throw('No data url was defined.');
  }

  public static postData <T> (Type: (new () => T), data: T | T[], url?: string): Observable<any> {
    let _keys = access(create(Type));
    return (url)
    ? Observable.fromPromise(createApiData(Type, url, data))
    : (_keys.create)
    ? Observable.fromPromise(createApiData(Type, _keys.create, data))
    : Observable.throw('No data url was defined.');
  }

  public static updateData<T> (Type: (new () => T), data: T| T[], url?: string): Observable<any> {
    let _keys = access(create(Type));
    return (url)
    ? Observable.fromPromise(updateApiData(Type, url, data))
    : (_keys.update)
    ? Observable.fromPromise(updateApiData(Type, _keys.update, data))
    : Observable.throw('No data url was defined.'); 
  }

  public static deleteData<T> (Type: (new () => T), url?: string, data?: T | T[]): Observable<any> {
    let _keys = access(create(Type));
    return (url)
    ? Observable.fromPromise(deleteApiData(Type, url, data))
    : (_keys.delete)
    ? Observable.fromPromise(deleteApiData(Type, _keys.delete, data))
    : Observable.throw('No data url was defined.');
  }
}