import { Container } from './';
import { getName, create, api } from '../util';
import { EasySingleton, is, Easily } from 'easy-injectionjs';
import { Subscription } from 'rxjs/Rx'

interface Content {}

@EasySingleton()
export class Compose {
  private content: Content;

  constructor () {
    this.content = new class implements Content {}();
  }

  public getContainer<T> (Type: (new () => T)): Container {
  	let _container: Container = this.content[getName(Type)];
  	if (!_container) {
  		Easily('CURRENT', Type);
  		_container = (this.content[getName(Type)] = is(Container));
  	}
    return _container
  }
}

export const container = <T extends {new(...args:any[]):{}}> () => function (target: T) {
  let _container: Container = is(Compose).getContainer(target);
  Easily('CONTAINER_'+ target.name, _container)
}

export const Get_All = <T extends {new(...args:any[]):{}}> (target:T) => (<Container>is('CONTAINER_'+ target.name)).All();
export const Get_Query = <T extends {new(...args:any[]):{}}> (target: T, key: string, args: string) => (<Container>is('CONTAINER_'+ target.name)).Query(key, args);
export const Add = <T extends {new(...args:any[]):{}}> (target: T, data) => (<Container>is('CONTAINER_'+ target.name)).add(data);
export const Update = <T extends {new(...args:any[]):{}}> (target: T, data) => (<Container>is('CONTAINER_'+ target.name)).update(data);
export const Delete = <T extends {new(...args:any[]):{}}> (target: T, data) => (<Container>is('CONTAINER_'+ target.name)).delete(data);
export const All = <T extends {new(...args:any[]):{}}> (target: T) => <any[]>  is('ALL_'+target.name);
export const Query = <T extends {new(...args:any[]):{}}> (target: T) => <any[]> is('QUERY_'+target.name);
export const Get_Current = (target:Object, key?: any): Subscription => {
  let _container: Container = <Container>is('CONTAINER_'+ target.constructor.name);
  return (!key) 
  ? _container.Current(target)
  : _container.CurrentByKey(target, key)
}
export const Current = <T extends {new(...args:any[]):{}}> (target: T) => is('CURRENT_DATA_'+target.name);
