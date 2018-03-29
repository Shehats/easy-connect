import {Cachable} from '../util/util';

export class Token implements Cachable{
  prefix: string;
  token: string;

  constructor(prefix?: string, token?: string) {
  	this.prefix = prefix;
  	this.token = token;
  }
}