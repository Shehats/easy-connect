import { Container } from "inversify";

import { 
  IAuth, 
  IMutex, 
  IConfig, 
  ISession, 
  IStore, 
  IEasy,
  ITypes} from './core';
  
import { EasyTokenAuth, EasyAuth } from './auth/auth';
import { Mutex } from './fetch/mutex';
import { Store } from './fetch/store';
import { Easy } from './easy';

let container = new Container();
container.bind<IAuth>(ITypes.IAuth).to(EasyTokenAuth);
container.bind<IAuth>(ITypes.IAuth).to(EasyAuth);
container.bind<IMutex>(ITypes.IMutex).to(Mutex);
container.bind<IStore>(ITypes.IStore).to(Store);
container.bind<IEasy>(ITypes.IEasy).to(Easy);

export default container;