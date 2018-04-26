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
