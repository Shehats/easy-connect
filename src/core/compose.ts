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
  	let _container: Container = this.content[getName(create(Type))];
  	if (!_container) {
  		Easily('CURRENT', Type);
  		_container = (this.content[getName(create(Type))] = is(Container));
  	}
    return _container
  }
}

export const container = () => function (target) {
  let value: Container = is(Compose).getContainer(target);
  value.All()
  Reflect.defineMetadata('container', value, target);
}

export const Get_All = (target) => Reflect.getMetadata('container', create(target).constructor).All();
export const Get_Query = (target, args: string) => (Reflect.getMetadata('container', create(target).constructor)).Query(args);
export const Add = (target, data) => (Reflect.getMetadata('container', create(target).constructor)).add(data);
export const Update = (target, data) => (Reflect.getMetadata('container', create(target).constructor)).update(data);
export const Delete = (target, data) => (Reflect.getMetadata('container', create(target).constructor)).delete(data);
export const All = <T extends {new(...args:any[]):{}}> (target: T) => <any[]>  is('ALL_'+target.name);
export const Query = <T extends {new(...args:any[]):{}}> (target: T) => <any[]> is('QUERY_'+target.name);
