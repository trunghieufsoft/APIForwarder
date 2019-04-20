import {
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest
} from "@angular/common/http";
import { Observable } from "rxjs";

import { LoaderService } from "../services/loader.service";
import { AuthenticationService } from 'src/app/api-service/service/authentication.service';

export class RequestInterceptor implements HttpInterceptor {
  constructor(
    private loaderService: LoaderService,
    private auth: AuthenticationService
  ) {}

  public intercept(
    request: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    this.loaderService.emit(true);

    if (this.auth.isAuthenticated()) {
      request = request.clone({
        setHeaders: {
          Authorization: `Bearer ${this.auth.getToken()}`,
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*",
          "Cache-Control": "no-cache, no-store",
          Pragma: "no-cache",
          Expires: "-1"
        }
      });
    } else {
      request = request.clone({
        setHeaders: {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*",
          "Cache-Control": "no-cache, no-store",
          Pragma: "no-cache",
          Expires: "-1"
        }
      });
    }

    return next.handle(request);
  }
}
