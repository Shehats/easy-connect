import { EasySingleton, Easy, EasyFactory } from 'easy-injectionjs';
import { AuthType } from '../core';
import { Token } from '../auth';

export const API = {
  api: Symbol('api'),
  config: Symbol('config'),
  query: Symbol('query'),
  cacheable: Symbol('cacheable'),
  key: Symbol('key'),
  id: Symbol('id')
}


@EasySingleton()
export class Config {
  @Easy('BaseUrl')
  private _base: string;
  @Easy()
  private _token: Token;

  public get BaseUrl(): string {
    return this._base;
  }

  public get AuthToken(): Token {
    return this._token
  }
}
