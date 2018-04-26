import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/fromPromise';
import 'rxjs/add/operator/map'
import 'rxjs/add/operator/catch'
import { create, 
         access,
         accessKey,
         construct, 
         constructArray, 
         createApiData, 
         updateApiData, 
         deleteApiData } from '../util';
import { EasySingleton } from 'easy-injectionjs';

@EasySingleton()
export class Actions {
  public getData<T> (Type: (new(...args:any[]) => T), url?: string): Observable<T[]> {
    let _keys = access(create(Type));
    return (url)
    ? Observable.fromPromise(constructArray(Type, url))
    : (_keys.getAll)
    ? Observable.fromPromise(constructArray(Type, (_keys.baseUrl) ? _keys.baseUrl + '/' +_keys.getAll: _keys.getAll))
    : Observable.throw('No data url was defined.');
  }

  public getDataById <T> (Type: (new(...args:any[]) => T), id: any, url?: string): Observable<T> {
    let _keys = access(create(Type));
    return (url && id)
    ? Observable.fromPromise(construct(Type, _keys.baseUrl + '/' + url, id))
    : (_keys.getById)
    ? Observable.fromPromise(construct(Type, (_keys.baseUrl) ? _keys.baseUrl + '/' +_keys.getById: _keys.getById, id))
    : Observable.throw('No data url or id was defined.');
  }

  public getDataByFilter <T> (Type: (new(...args:any[]) => T), key: any, url?: string): Observable<T> {
    let _keys = access(create(Type));
    let _accessor = accessKey(create(Type));
    return (url)
    ? Observable.fromPromise(construct(Type, url, key))
    : (_accessor.filterKey)
    ? Observable.fromPromise(construct(Type, (_accessor.appendBaseUrl)
      ? _keys.baseUrl + '/' + _accessor.filterKey
      : _accessor.filterUrl + '/' + _accessor.filterKey, key))
    : Observable.throw('No data url or key was defined.');
  }

  public postData <T> (Type: (new(...args:any[]) => T), data: T | T[], url?: string): Observable<any> {
    let _keys = access(create(Type));
    return (url)
    ? Observable.fromPromise(createApiData(Type, url, data))
    : (_keys.create)
    ? Observable.fromPromise(createApiData(Type, (_keys.baseUrl) ? _keys.baseUrl + '/' + _keys.create: _keys.create, data) )
    : Observable.throw('No data url was defined.');
  }

  public updateData<T> (Type: (new(...args:any[]) => T), data: T| T[], url?: string): Observable<any> {
    let _keys = access(create(Type));
    return (url)
    ? Observable.fromPromise(updateApiData(Type, url, data))
    : (_keys.update)
    ? Observable.fromPromise(updateApiData(Type, (_keys.baseUrl) ? _keys.baseUrl + '/' + _keys.update: _keys.update, data))
    : Observable.throw('No data url was defined.'); 
  }

  public updateDataById<T> (Type: (new(...args:any[]) => T), data: T| T[], id?: any, url?: string): Observable<any> {
    let _keys = access(create(Type));
    return (url)
    ? Observable.fromPromise(updateApiData(Type, (id)
      ? url + '/' + id
      : url + '/' + data[_keys.id], data))
    : (_keys.update)
    ? Observable.fromPromise(updateApiData(Type, (_keys.baseUrl) 
      ? _keys.baseUrl + '/' + _keys.update + (id) ? id: data[_keys.id]
      : _keys.update + (id) ? id: data[_keys.id], data))
    : Observable.throw('No data url was defined.');
  }

  public deleteData<T> (Type: (new(...args:any[]) => T), url?: string, data?: T | T[]): Observable<any> {
    let _keys = access(create(Type));
    return (url)
    ? Observable.fromPromise(deleteApiData(Type, url, data))
    : (_keys.delete)
    ? Observable.fromPromise(deleteApiData(Type, (_keys.baseUrl) ? _keys.baseUrl + '/' + _keys.delete: _keys.delete, data))
    : Observable.throw('No data url was defined.');
  }

  public deleteDataById<T> (Type: (new(...args:any[]) => T), data: T| T[], id?: any, url?: string): Observable<any> {
    let _keys = access(create(Type));
    return (url)
    ? Observable.fromPromise(updateApiData(Type, (id)
      ? url + '/' + id
      : url + '/' + data[_keys.id], data))
    : (_keys.delete)
    ? Observable.fromPromise(updateApiData(Type, (_keys.baseUrl) 
      ? _keys.baseUrl + '/' + _keys.delete + (id) ? id: data[_keys.id]
      : _keys.delete + (id) ? id: data[_keys.id], data))
    : Observable.throw('No data url was defined.');
  }
}