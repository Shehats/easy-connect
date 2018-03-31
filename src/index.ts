import { NgModule } from '@angular/core';
import { Actions } from './fetch/actions';
import { Cache } from './fetch/cache';
import { Mutex } from './fetch/mutex';
import { Store } from './fetch/store';
import { HttpFactory } from './auth/auth-interceptor';

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

@NgModule({
  providers: [
  Actions,
  Cache,
  Mutex,
  Store,
  HttpFactory
  ]
})
export class EasyAccessModule {}