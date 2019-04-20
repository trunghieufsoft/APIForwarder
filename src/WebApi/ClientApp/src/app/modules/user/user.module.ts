import { NgModule } from "@angular/core";
import { CommonModule } from '@angular/common';
import { TranslateLoader, TranslateModule } from "@ngx-translate/core";
import { SharedModule } from "src/app/shared/shared.module";
import { TranslateHttpLoader } from "@ngx-translate/http-loader";
import { HttpClient } from "@angular/common/http";
import { ToastModule } from 'primeng/toast';
export function createTranslateLoader(http: HttpClient): TranslateHttpLoader {
  return new TranslateHttpLoader(http, "./assets/i18n/", ".json");
}

@NgModule({
  imports: [
    SharedModule,
    CommonModule,
    ToastModule,
    TranslateModule.forChild({
      loader: {
        provide: TranslateLoader,
        useFactory: createTranslateLoader,
        deps: [HttpClient]
      }
    })
  ],

  entryComponents: [

  ],
  declarations: [

  ],
  exports: [

  ],
  providers: []
})
export class UserManagementModule {}
