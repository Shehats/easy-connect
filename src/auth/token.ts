import { is, EasyPrototype } from 'easy-injectionjs';
import { IConfig } from '../core'

@EasyPrototype()
export class Token {
	prefix: string;
  key: string;
  token: string;

  constructor (config: IConfig = is('CONFIG')) {
  	if (config) {
  		this.prefix = config.prefix
      this.key = config.key;
  	}
  }
}