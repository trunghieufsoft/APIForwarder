import { NgModule } from "@angular/core";
import { TranslateLoader, TranslateModule } from "@ngx-translate/core";
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { SharedModule } from "src/app/shared/shared.module";
import { HttpClient } from '@angular/common/http';
import { ViewProfileManagementRoutingModule } from './view-profile.routes';
import { ViewProfileComponent } from './view-profile.component';
export function createTranslateLoader(http: HttpClient): TranslateHttpLoader {
  return new TranslateHttpLoader(http, "./assets/i18n/", ".json");
}

@NgModule({
  imports: [
    SharedModule,
    ViewProfileManagementRoutingModule,
    TranslateModule.forChild({
      loader: {
        provide: TranslateLoader,
        useFactory: createTranslateLoader,
        deps: [HttpClient]
      }
    })
  ],
  entryComponents: [],
  declarations: [ViewProfileComponent],
  exports: [ViewProfileComponent, TranslateModule],
  providers: []
})
export class ViewProfileManagementModule {}
