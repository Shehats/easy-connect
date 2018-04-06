import { Injectable, Inject } from '@angular/core';
import { IConfig,
         AuthType, 
         IAuth,
         EasyAuth,
         EasyTokenAuth } from '../index';
import { Observable } from 'rxjs/Rx';


@Injectable()
export class AuthService implements IAuth {
  private auth: IAuth;
  constructor (
    @Inject('AUTH_CONFIG') private config: IConfig,
    @Inject('AUTH_TYPE') private authType: AuthType
    ) {
    this.auth =(authType == AuthType.TOKEN_AUTH)
    ? new EasyTokenAuth(config)
    : new EasyAuth(config);
  }

  public login (loginParams: Object): Observable<any> {
    return this.auth.login (loginParams);
  }

  public logout (): Observable<any> {
    return this.auth.logout ();
  }

  public validate(): Observable<any> {
    return this.auth.validate();
  }

  public register(registerParams: Object): Observable<any> {
    return this.auth.register(registerParams);
  }
}