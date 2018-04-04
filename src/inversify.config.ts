import { Container } from "inversify";
import { EasyAccess } from './angular/easy';
import { 
  IAuth, 
  IMutex, 
  IConfig, 
  ISession, 
  IStore, 
  IEasy,
  IAccess,
  ITypes} from './core';
  
import { EasyTokenAuth, EasyAuth } from './auth/auth';
import { Mutex } from './fetch/mutex';
import { Store } from './fetch/store';
import { Easy } from './easy';

const container = new Container();
container.bind<IAuth>(ITypes.IAuth).toConstructor(EasyTokenAuth);
// container.bind<IAuth>(ITypes.IAuth).toConstructor(EasyAuth);
container.bind<IStore>(ITypes.IStore).toConstructor(Store);
container.bind<IMutex>(ITypes.IMutex).toConstructor(Mutex);
container.bind<IEasy>(ITypes.IEasy).toConstructor(Easy);
container.bind<IAccess>(ITypes.IAccess).toConstructor(EasyAccess);

let store = container.get<IStore>(ITypes.IStore);
let mutex = container.get<IMutex>(ITypes.IMutex);
console.log(store)
console.log(mutex)
export { container };
