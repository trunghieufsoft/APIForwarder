import { CommonModule } from "@angular/common";
import { HttpClient } from "@angular/common/http";
import { NgModule } from "@angular/core";
import { TranslateLoader, TranslateModule } from "@ngx-translate/core";
import { SharedModule } from "src/app/shared/shared.module";
import { SystemConfigurationComponent } from "./system-configuration.component";
import { SystemConfigurationManagementRoutingModule } from "./system-configuration.routes";
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { ToastModule } from 'primeng/toast';
export function createTranslateLoader(http: HttpClient): TranslateHttpLoader {
  return new TranslateHttpLoader(http, "./assets/i18n/", ".json");
}
@NgModule({
  imports: [
    SharedModule,
    CommonModule,
    ToastModule,
    SystemConfigurationManagementRoutingModule,
    TranslateModule.forChild({
      loader: {
        provide: TranslateLoader,
        useFactory: createTranslateLoader,
        deps: [HttpClient]
      }
    })
  ],
  entryComponents: [],
  declarations: [SystemConfigurationComponent],
  exports: [SystemConfigurationComponent, TranslateModule],
  providers: []
})
export class SystemConfigurationManagementModule {}
