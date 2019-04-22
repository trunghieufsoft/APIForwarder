import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { TranslateService } from "@ngx-translate/core";

@Injectable()
export class ErrorMessageService {
  constructor(private translate: TranslateService) {}

  public getErrorMessage(errors: any): Observable<string> {
    if (errors) {
      let property;
      for (property in errors) {
        if (errors.hasOwnProperty(property) && errors[property]) {
          return this.getMultilangMessage(
            `common.messages.${property}`,
            errors[property]
          );
        }
      }
    }

    return Observable.create(observer => {
      observer.next("");
      observer.complete();
    });
  }

  public getMultilangMessage(key: string, params?: any): Observable<string> {
    return this.translate.get(key, params);
  }
}
