import { cacheable } from '../util';

@cacheable()
export class Token {
  prefix: string;
  token: string;
  key: string;

  constructor(prefix?: string, key?:string, token?: string) {
  	this.prefix = (prefix) ? prefix: 'Bearer';
  	this.key= (key) ? key: '';
  	this.token = (token) ? token: '';
  }
}