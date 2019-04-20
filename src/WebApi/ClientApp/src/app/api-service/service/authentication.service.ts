import { BaseService } from "src/app/base/base.service";
import { Observable } from "rxjs";
import { ApiHttpClient } from "src/app/shared/common/api-http-client";
import { Injectable } from "@angular/core";
import { API } from "../api";
import { ILogin, IForgotPassword } from '../model/login';

@Injectable({ providedIn: "root" })
export class AuthenticationService extends BaseService {
  constructor(private http: ApiHttpClient) {
    super();
  }

  public login(input: ILogin): Observable<any> {
    return this.http.post(API.user.login, input);
  }

  public logout(): Observable<any> {
    return this.http.get(API.user.logout);
  }

  public forgotPassword(params: IForgotPassword): Observable<any> {
    return this.http.post(API.user.resetPass, params);
  }
  public keepAlive(): Observable<any> {
    return this.http.get(API.user.keepAlive);
  }
}
