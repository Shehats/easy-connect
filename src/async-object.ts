import { Observable,Scheduler, Subject } from 'rxjs/Rx';
import { Easy } from './easy';
import * as _ from 'lodash';

export abstract class AsyncObject<T> {
  easy: Easy;
  state: Subject<T|T[]>;
  Type: (new () => T);
  constructor() {
    this.easy = new Easy();
    this.state = Subject.create(Observable.interval(30000)
    .map(_ => this.easy.getByKey(this.Type, this.getKey())));
  }

  public getData() {
    return this.state.next();
  }
  public abstract getKey(): any;
}

export class AsyncList<T> {
  easy: Easy;
  Type: (new () => T);
  state: Subject<T|T[]>

  constructor (key: string) {
    this.easy = new Easy();
    this.state = Subject.create(Observable.interval(30000)
      .flatMap(_1 => this.easy.getAll(this.Type)
        .map((x: T[]) => _.map(x, y => {
          Subject.create(Observable.interval(30000)
            .map(_2 => this.easy.getByKey(this.Type, y[key])))
        }))
       ))
  }
} 