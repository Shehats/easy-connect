import { Observable, Subscription } from 'rxjs/Rx';
import { EasyConnect } from './';
import * as _ from 'lodash';
import { create, 
         access,
         accessQuery,
         accessId } from '../util';
import { Easy, EasyPrototype, Easily, is} from 'easy-injectionjs';

@EasyPrototype()
export class Container {
  @Easy()
  private _easy: EasyConnect;
  public _all: Subscription;
  public _query: Subscription;
  public _current: Subscription;
  private _id: any;
  private _key: any;

  constructor(private _type: {new(...args:any[]):{}} = is('CURRENT')) {
  }

  private createSubArray <T extends {new(...args:any[]):{}}> 
    (sub: Subscription,
     obs: Observable<Object|Object[]>,
     prefix: string,
     errCallBack?: any): Subscription {
  	return sub || (sub = obs.subscribe({
  		next: (arr: T[]) => {
  			Easily(prefix+this._type.name, arr);
  		},
  		error: (errCallBack)? errCallBack: (err: any) =>{ throw err }
  	}))
  }

  private removeSub() {
  	if(this._all)
  		this._all.unsubscribe()
  	if (this._query)
  		this._query.unsubscribe()
  }

  private ensure() {
    if (!this._key || !this._id) {
      this._key = accessQuery(this._type);
      this._id = accessId(this._type);
    }
  }

  public All(): Subscription {
    this.ensure();
  	return this.createSubArray(this._all, this._easy.getAll(this._type),'ALL_');
  }

  public Current(selected: Object): Subscription {
    if (this._current)
      this._current.unsubscribe()
    return (this._current = this._easy.getById(this._type, selected[this._id])
    .subscribe(x => {
      Easily('CURRENT_'+this._type.name, x);
    }))
  }

  public 
  
  public Query <T extends {new(...args:any[]):{}}> (args: string): Subscription {
    this.ensure();
  	return this.createSubArray(this._query, this._easy.query(this._type, args),
  		'QUERY_', () => {
  		let arr: T[] = is('ALL_'+this._type.name);
  		arr.filter(x => x[this._key] == args)
  		Easily('QUERY_'+this._type.name, arr);
  	});	
  }

  public add <T extends {new(...args:any[]):{}}> (data: T): void {
  	this.removeSub();
  	this._easy.create(this._type, data)
    .subscribe(_ => {
    	let arr: T[] = is('ALL_'+this._type.name);
    	arr.push(data)
    	Easily('ALL_'+this._type.name, arr,);
    });
  }

  public update <T extends {new(...args:any[]):{}}> (data: T): void {
  	this.removeSub();
    this._easy.update(this._type, data)
    .subscribe(_ => {
    	let arr: T[] = is('ALL_'+this._type.name);
    	arr[data[this._id]] = data
    	Easily('ALL_'+this._type.name, arr);
    });
  }

  public delete <T extends {new(...args:any[]):{}}> (data: T): void {
  	this.removeSub();
    this._easy.delete(this._type, data)
    .subscribe(_ => {
    	let arr: T[] = is('ALL_'+this._type.name);
    	arr.splice(arr.indexOf(data,0), 1);
    	Easily('ALL_'+this._type.name, arr);
    });
  }
}
