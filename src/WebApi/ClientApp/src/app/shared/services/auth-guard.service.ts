import { Injectable } from "@angular/core";
import {
  ActivatedRouteSnapshot,
  CanActivate,
  Router,
  RouterStateSnapshot
} from "@angular/router";
import { Observable } from "rxjs";
import { AuthenticationService } from "src/app/api-service/service/authentication.service";
import { CONSTANT } from "../common/constant";

@Injectable({ providedIn: "root" })
export class AuthGuardService implements CanActivate {
  private _auth: AuthenticationService;

  private staffNotAccess: any = [
    "system-configuration",
    "log/system-log"
  ];
  private managerNotAccess: any = ["log/system-log"];

  constructor(private auth: AuthenticationService, private router: Router) {
    this._auth = auth;
  }

  public canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean> | Promise<boolean> | boolean {
    if (!this._auth.isAuthenticated()) {
      this.auth.logout();

      return false;
    }

    const currentUser = this._auth.getCurrentUser();
    if (+currentUser.ExpiredPassword < 1) {
      this.router.navigate(["change-password"]);

      return false;
    }

    if (currentUser && currentUser.UserType) {
      if (currentUser.UserType === CONSTANT.userType.super) {
        return true;
      }
      var notAccess =
        currentUser.UserType === CONSTANT.userType.manager
          ? this.managerNotAccess
          : this.staffNotAccess;
      for (let i = 0; i < notAccess.length; i++) {
        if (state.url.indexOf(notAccess[i]) > -1) {
          return false;
        }
      }

      // authorised so return true
      return true;
    }



    // not logged in so redirect to login page with the return url
    this.router.navigate(["/login"], { queryParams: { returnUrl: state.url } });

    return false;
  }
}
