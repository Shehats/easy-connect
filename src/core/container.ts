import { Observable } from 'rxjs/Rx';
import { Easy } from './easy';
import * as _ from 'lodash';
import { create, 
         access } from '../util/util';

export class Container<T> {
  private easy: Easy;
  private list: T[] = [];
  private querySet: T[] = [];
  private interval: number;
  private timeStamp: number;
  private Type: (new () => T);
  private id: any;

  constructor(Type: (new () => T), interval?: number) {
    this.Type = Type;
    let _key= access(create(this.Type));
    this.id = _key.id;
    this.easy = new Easy();
    this.interval = interval || 3000;
    this.easy.getAll(this.Type, true)
    .subscribe((x:T[]) => {
      x.forEach(y => this.list.push(y))
      this.timeStamp = (this.interval/this.list.length);
    })

    setInterval(() => {
      this.list.forEach(x => {
        this.easy.getByKey(this.Type, x[this.id], true)
        .subscribe((g: T) => this.list[g[this.id]] = g)
      })
    }, (this.timeStamp) ? this.timeStamp : this.interval)
  }

  public get All(): T[] {
    return this.list;
  }

  public get QuerySet(): T[] {
    return this.querySet;
  }

  public query(args: string): void {
    this.easy.query(this.Type, args)
    .subscribe((x:T[]) => x.forEach(y => {
      this.querySet.push(y);
    }))
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
