import {Cachable} from '../util/util';

export class Token extends Cachable{
  prefix: string;
  token: string;
  key: string;

  constructor(prefix?: string, key?:string, token?: string) {
  	super();
  	this.prefix = (prefix) ? prefix: '';
  	this.key= (key) ? key: '';
  	this.token = (token) ? token: '';
  }
}