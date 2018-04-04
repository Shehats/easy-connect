import { Cache } from '../fetch/cache';
import { create, Cachable } from '../util/util';
import { Observable } from 'rxjs/Rx';
import * as _ from 'lodash';
import { Actions } from '../fetch/actions';
import { injectable, inject } from "inversify";
import { ITypes, IEasy, IAccess } from '../core'
import { Easy } from '../easy';
import { Injectable } from '@angular/core';

@Injectable()
@injectable()
export class EasyAccess implements IAccess {
  easy: IEasy;
  constructor(@inject(ITypes.IEasy) easy?: IEasy) {
    this.easy = (easy)?easy: new Easy();
  }

  public getAll<T> (Type: (new () => T),
    url?: string, 
    force?: boolean): Observable<T|T[]> {
    return this.easy.getAll(Type, url, force);
  }

  public getByKey<T> (Type: (new () => T), 
    id: any,
    force?: boolean,
    url?: string): Observable<T|T[]> {
    return this.easy.getByKey(Type, id, force, url);
  }

  public create<T> (Type: (new () => T), data: T | T[], url?: string): Observable<any> {
    return this.easy.create(Type, data, url);
  }

  public update<T> (Type: (new () => T), data: T| T[], url?: string): Observable<any> {
    return this.easy.create(Type, data, url);
  }

  public delete<T> (Type: (new () => T), url?: string, data?: T | T[]): Observable<any> {
    return this.easy.delete(Type, url, data);
  } 
}