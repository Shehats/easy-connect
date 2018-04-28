export { authConfig,
         api,
         id,
         query,
         secure,
         cacheable,
         key } from './util';
         
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
         Get_Query,
         Get_Current,
         Current } from './core';

export { Token,
         HttpFactory, 
         EasyTokenAuth, 
         EasyAuth,
         AuthFactory,
         Login,
         Logout,
         Register,
         Validate,
         ValidateData } from './auth';

export { EasyPrototype, EasyFactory, EasySingleton, Easy } from 'easy-injectionjs'
