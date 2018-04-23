import { Easy, EasySingleton, is } from 'easy-injectionjs';
import { IAuth, AuthType } from '../core'
import { Observable } from 'rxjs/Rx';

@EasySingleton()
export class AuthFactory implements IAuth {
  private _auth: IAuth;
  constructor (authtype: AuthType = is('AUTH_TYPE')) {
    this._auth = (authtype = AuthType.TOKEN_AUTH) 
                 ? is('TOKEN_AUTH')
                 : is('SESSION_AUTH');
  }

  public login(loginParams: Object): Observable<any> {
    return this._auth.login(loginParams);
  }

  public logout(): Observable<any> {
    return this._auth.logout();
  }

  public register(registerParams: Object): Observable<any> {
    return this._auth.register(registerParams);
  }

  public validate(): Observable<any> {
    return this._auth.validate();
  }

}