import {
  HttpErrorResponse,
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest,
  HttpResponse
} from "@angular/common/http";
import { Router } from "@angular/router";
import { Observable, throwError } from "rxjs";
import { catchError, map } from "rxjs/operators";
import { LoaderService } from "../services/loader.service";
import { AuthenticationService } from "src/app/api-service/service/authentication.service";
import { AlertService } from "../services/alert.service";
import { TranslateService } from "@ngx-translate/core";
import { NavigatorService } from "../services/navigator.service";

export class ResponseInterceptor implements HttpInterceptor {
  private errorToLogin: string =
    "YouHaveLogged, SessionExpired, UserDeleted, UserInactivated";
  private showInChild: string = "MultiplePasswordResetting, PasswordExpired, CannotDeleteSlicFromVendor";
  constructor(
    private router: Router,
    private loaderService: LoaderService,
    private alertService: AlertService,
    private auth: AuthenticationService,
    private translate: TranslateService,
    private navigate: NavigatorService
  ) {}

  public intercept(
    request: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    return next.handle(request).pipe(
      map((event: HttpEvent<any>) => {
        if (event instanceof HttpResponse) {
          this.loaderService.emit(false);
          this.loaderService.isForceBlockUI = false;
          setTimeout(() => {
            this.loaderService.toggleBlockUI(false);
          }, 300);
          const bodyData = event.body;
          const error = event.body.error;
          if (
            error &&
            error.message &&
            this.showInChild.indexOf(error.message) === -1
          ) {
            let msg = this.translate.get(`error.${error.message}`)["value"];
            let title = this.translate.get("error.Error")["value"];
            if (error.message === "UserDeleted" || error.message === "UserInactivated") {
              title = this.translate.get("button.logout")["value"];
            }
            this.alertService.error(msg, title).subscribe(action => {
              if (error.message === "PasswordExpired") {
                this.navigate.navigate("change-password");
              }
              if (this.errorToLogin.indexOf(error.message) !== -1) {
                localStorage.clear();
                this.navigate.navigateLoginPage();
                // window.location.reload(false);
                location.reload();
              }
            });

            return;
          }

          event = event.clone({
            body: bodyData
          });
        }

        return event;
      }),
      catchError((err: any) => {
        this.loaderService.emit(false);
        this.loaderService.isForceBlockUI = false;
        setTimeout(() => {
          this.loaderService.toggleBlockUI(false);
        }, 300);

        if (err instanceof HttpErrorResponse) {
          let errorMessage = this.translate.get("error.lostConnect")["value"];

          switch (err.status) {
            case 401:
              // document.location.href = AppConfig.settings.eamLoginUrl;
              this.router.navigate(["login"]);
              this.auth.clearData();
              break;

            case 404:
              errorMessage = this.translate.get("error.pageNotFound")["value"];
              this.router.navigate([this.router.url]);
              break;
            case 400:
              errorMessage = this.translate.get("error.requestError")["value"];
              this.router.navigate([this.router.url]);
              break;
            case 500:
              // Log error message to console
              // Display error message as error dialog
              console.log(`Error in response: ${err.message}`);
              this.router.navigate([this.router.url]);
              break;

            case 0:
              errorMessage = this.translate.get("error.lostConnect")["value"];
              // Log error message to console
              // Display error message as error dialog
              console.log(`Error in response: ${err.message}`);
              // this.router.navigate(["login"]);
              // this.auth.clearData();
              // document.location.href = AppConfig.settings.eamLoginUrl;
              // this.router.navigate(['login']);
              break;

            default:
              break;
          }
          let title = this.translate.get("error.Error")["value"];
          this.alertService.error(errorMessage, title);

          return throwError(err);
        }
      })
    );
  }
}
