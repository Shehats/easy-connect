import { is, EasyPrototype, Easily } from 'easy-injectionjs';
import { IConfig } from '../core'

@EasyPrototype()
export class Token {
	prefix: string;
  key: string;
  token: string;
  expiry: number;

  constructor (config: IConfig = is('CONFIG')) {
  	if (config) {
  		this.prefix = config.prefix
      this.key = config.key;
      this.expiry = config.tokenExpiry;
      Easily('CACHE_Token', this.expiry);
  	}
  }
}