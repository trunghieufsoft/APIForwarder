import { NgModule } from "@angular/core";
import { TranslateLoader, TranslateModule } from "@ngx-translate/core";
import { TranslateHttpLoader } from "@ngx-translate/http-loader";
import { SharedModule } from "src/app/shared/shared.module";
import { HttpClient } from "@angular/common/http";
import { MasterRoutingModule } from "./master.routes";
import { CommonModule } from "@angular/common";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { LoginComponent } from "./login/login.component";
import { ForgotPassWordComponent } from "./forgot-password/forgot-password.component";
import { ChangePasswordComponent } from "./changepassword/change-password.component";
import { ToastModule } from 'primeng/toast';

export function createTranslateLoader(http: HttpClient): TranslateHttpLoader {
  return new TranslateHttpLoader(http, "./assets/i18n/", ".json");
}

@NgModule({
  imports: [
    ToastModule,
    FormsModule,
    ReactiveFormsModule,
    SharedModule,
    MasterRoutingModule,
    CommonModule,
    TranslateModule.forChild({
      loader: {
        provide: TranslateLoader,
        useFactory: createTranslateLoader,
        deps: [HttpClient]
      }
    })
  ],
  entryComponents: [],
  declarations: [
    LoginComponent,
    ForgotPassWordComponent,
    ChangePasswordComponent
  ],
  exports: [TranslateModule],
  providers: []
})
export class MasterModule {}
