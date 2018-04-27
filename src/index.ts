export { api,
         id,
         query,
         secure,
         cacheable,
         key } from './util';
         
export { IAuth,
         IConfig,
         EasyConnect,
         Container,
         container,
         All,
         Add,
         Query,
         Update,
         Delete,
         AuthType,
         Get_All, 
         Get_Query } from './core';

export { Token,
         HttpFactory, 
         EasyTokenAuth, 
         EasyAuth,
         AuthFactory } from './auth';

export { EasyPrototype, EasyFactory, EasySingleton, Easy } from 'easy-injectionjs'
