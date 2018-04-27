import { Easy, EasySingleton, is } from 'easy-injectionjs';
import { IAuth, AuthType } from '../core'
import { Observable, Subscription } from 'rxjs/Rx';

@EasySingleton()
export class AuthFactory implements IAuth {
  private _auth: IAuth;
  constructor (authtype: AuthType = is('AUTH_TYPE')) {
    this._auth = is((authtype == AuthType.TOKEN_AUTH)? 'TOKEN_AUTH': 'SESSION_AUTH')
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

  public validateData(data: Object): Observable<any> {
    return this._auth.validateData(data)
  }
  public get Auth(): IAuth {
    return this._auth;
  }
}

export const Login = (loginParams: Object): Observable<any> => is(AuthFactory).login(loginParams)
export const Logout = (): Observable<any> => is(AuthFactory).logout()
export const Register = (registerParams: Object): Observable<any> => is(AuthFactory).register(registerParams)
export const Validate = (): Observable<any> => is(AuthFactory).validate()
export const ValidateData = (data: Object): Observable<any> => is(AuthFactory).validateData(data)