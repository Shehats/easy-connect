export { api,
         id,
         query,
         secure,
         cacheable } from './util';
         
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
         EasyAuth } from './auth';

export { EasyPrototype, EasySingleton, Easy } from 'easy-injectionjs'
