export { api,
         id,
         query,
         secure,
         cacheable,
         key,
         config } from './util';
         
export { IAuth,
         IConfig,
         EasyConnect,
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
         AuthFactory,
         Login,
         Register,
         Validate,
         ValidateData } from './auth';

export { EasyPrototype, EasyFactory, EasySingleton, Easy } from 'easy-injectionjs'
