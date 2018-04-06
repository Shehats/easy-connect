import { Observable } from 'rxjs/Rx';
import { Easy } from './easy';
import * as _ from 'lodash';
import { create, 
         access } from '../util/util';

export class Container<T> {
  private easy: Easy;
  private list: T[];
  private querySet: T[];
  private interval: number;
  private timeStamp: number;
  private Type: (new () => T);
  private id: any;

  constructor(interval?: number) {
    this.id = access(create(this.Type));
    this.easy = new Easy();
    this.interval = interval || 30000;
    this.easy.getAll(this.Type)
    .subscribe((x:T[]) => {
      this.list = x;
      this.timeStamp = (this.interval/this.list.length);
      Observable.interval(this.timeStamp || this.interval,
        (this.timeStamp)
        ? _.forEach(this.list, y => {
          this.easy.getByKey(this.Type, y[this.id])
          .subscribe((g:T) => {
            this.list[g[this.id]] = g;
          })
        }) 
        : this.easy.getAll(this.Type)
          .subscribe((g:T[]) => this.list = g)
        )
    })
  }

  public get All(): T[] {
    return this.list;
  }

  public get QuerySet(): T[] {
    return this.querySet;
  }

  public query(args: string): void {
    this.easy.query(this.Type, args)
    .subscribe(x => this.querySet = x)
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
