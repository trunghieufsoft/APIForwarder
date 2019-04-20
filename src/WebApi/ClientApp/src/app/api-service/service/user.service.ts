import { Injectable } from "@angular/core";
import { ApiHttpClient } from "src/app/shared/common/api-http-client";
import { Observable } from "rxjs";
import { User } from "../model/user";
import { GetAllUser } from "../model/total-user";
import { API } from "../api";
import { BaseService } from "src/app/base/base.service";

@Injectable({
  providedIn: "root"
})
export class UserService extends BaseService {
  constructor(private http: ApiHttpClient) {
    super();
  }

  public getAllUsers(): Observable<GetAllUser> {
    return this.http.get(API.user.totalUsers, "");
  }

  /**
   * Get profile by userId
   */
  public getProfile(): Observable<User> {
    return this.http.get(API.user.getProfile);
  }

  /**
   * Handles update user password
   * @param newPassword Object Username and password
   */
  public changePassword(newPassword: any): Observable<any> {
    return this.http.post(API.user.changePassword, newPassword);
  }
}
