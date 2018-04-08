import { Container } from './';
import { getName, create, api } from '../util';

interface Content {}

export class Compose {
  private content: Content;
  private static _instance: Compose;
  private constructor () {
    this.content = new class implements Content {}();
  }

  public static get Instance() {
    return this._instance || (this._instance = new this());
  }

  public getContainer<T> (Type: (new () => T)): Container<T> {
    return this.content[getName(create(Type))] || (this.content[getName(create(Type))] = new Container<T>(Type));
  }
}

export const container = () => function (target) {
  let value = (Compose.Instance).getContainer(target);
  Reflect.defineMetadata('container', value, target);
}

export const All = (target) => (Reflect.getMetadata('container', create(target).constructor)).All;
export const executeQuery = (target, args: string) => (Reflect.getMetadata('container', create(target).constructor)).query(args);
export const Query = (target) => (Reflect.getMetadata('container', create(target).constructor)).QuerySet;
export const Add = (target, data) => (Reflect.getMetadata('container', create(target).constructor)).add(data);
export const Update = (target, data) => (Reflect.getMetadata('container', create(target).constructor)).update(data);
export const Delete = (target, data) => (Reflect.getMetadata('container', create(target).constructor)).delete(data);
