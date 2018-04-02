import { NgModule } from '@angular/core';
import { Actions } from './fetch/actions';
import { Cache } from './fetch/cache';
import { Mutex } from './fetch/mutex';
import { Store } from './fetch/store';
import { HttpFactory } from './auth/auth-interceptor';
import { Easy } from './easy';
import { EasyAccess } from './angular/easy';

export { 
  access, 
  api,
  secure,
  isSecure,
  getName,
  create,
  Cachable
} from './util/util';

export { Actions } from './fetch/actions';

export { Cache } from './fetch/cache';

export { Mutex } from './fetch/mutex';

export { Store } from './fetch/store';

export { Token } from './auth/auth-util';

export { HttpFactory } from './auth/auth-interceptor';

export { Easy } from './easy';

export { EasyTokenAuth, EasyAuth } from './auth/auth';

import { EasyTokenAuth, EasyAuth } from './auth/auth';


import container  from './inversify.config';


export { 
  IAuth, 
  IMutex, 
  IConfig, 
  ISession, 
  IStore, 
  IEasy} from './core';


// export { AsyncObject, AsyncList } from './async-object';

@NgModule({
  exports: [
  Actions,
  EasyTokenAuth,
  EasyAuth,
  Cache,
  Mutex,
  Easy,
  Store,
  HttpFactory,
  EasyAccess
  ]
})
export class EasyAccessModule {}