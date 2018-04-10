import { Observable, Subscription } from 'rxjs/Rx';
import { Easy } from './';
import * as _ from 'lodash';
import { create, 
         access,
         accessQuery } from '../util';

export class Container<T> {
  private easy: Easy;
  private list: T[];
  private checkedList: T[];
  private listSub: Subscription;
  private subArr: Subscription[];
  private querySet: T[];
  private interval: number;
  private Type: (new () => T);
  private id: any;

  constructor(Type: (new () => T), interval?: number) {
    this.Type = Type;
    let _key= access(create(this.Type));
    this.id = _key.id;
    this.easy = new Easy();
    this.interval = interval || 30000;
    let obs = this.easy.getAll(this.Type)
                     .map((x: T[]) => x);
    this.listSub = this.createSub(obs, (val: T[]) => this.setData(obs, val))
  }

  private assure(lis: T[]): void {
    this.subArr = new Array<Subscription>();
    setInterval(() => {
      _.each(lis, x => {
        if (this.id) {
          let obs = this.easy.getById(this.Type, x[this.id]).map((x:T) => x);
          this.subArr.push(this.createSub(obs, (val: T) => this.setSubData(obs, val)));
        } else {
          this.dispose(this.listSub);
          let obs = this.easy.getAll(this.Type)
                     .map((x: T[]) => x);
          this.listSub = this.createSub(obs, (val: T[]) => this.setData(obs, val));
        }
      })
    }, this.interval)
  }

  private createSub(obs: Observable<T|T[]>, updateNext: any): Subscription {
    return obs.subscribe({next: updateNext, error: (err:any) => {throw err}})
  }

  private setData(lis: Observable<T[]>, val: T[]) {
    if (!this.list || this.list.length != val.length)
      this.list = val;
    else {
      _.each(val, (x, index) => {
        if (this.list[index] != x)
          this.list[index] = x;
      })
    }
    this.assure(this.list);
  }

  private setSubData(item: Observable<T>, val: T) {
    let x: T = null;
    let i: number;
    _.each(this.list, (y, index) => {
      if (y[this.id] == val[this.id]) {
        x = y;
        i = index;
      }
    })
    if (x)
      this.list[i] = val;
  }

  private dispose(sub: Subscription): void {
    sub.unsubscribe();
  }

  public get All(): T[] {
    return this.list;
  }

  public get QuerySet(): T[] {
    return this.querySet;
  }

  public query(args: string): void {
    let _query = accessQuery(create(this.Type));
    this.easy.query(this.Type, args)
    .subscribe(
      (x:T[]) => x.forEach(y => {
      this.querySet.push(y);}),
      _ => {
        this.querySet = _.filter(this.list, x => (x[_query.queryKey] == args))
      }
    )
  }

  public add(data: T): void {
    this.easy.create(this.Type, data)
    .subscribe(_ => this.list.push(data))
  }

  public update(data: T): void {
    this.easy.update(this.Type, data)
    .subscribe(_ => this.list[data[this.id]] = data)
  }

  public delete(data: T): void {
    this.easy.delete(this.Type, data)
    .subscribe(_ => this.list.splice(this.list.indexOf(data,0), 1))
  }
}
