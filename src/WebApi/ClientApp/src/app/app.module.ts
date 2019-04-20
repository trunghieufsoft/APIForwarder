import { BrowserModule } from "@angular/platform-browser";
import {
  NgModule,
  APP_INITIALIZER,
  Injector,
  CUSTOM_ELEMENTS_SCHEMA
} from "@angular/core";
import { AppRoutingModule } from "./app-routing.module";
import { AppComponent } from "./app.component";
import {
  HttpClientModule,
  HttpClient,
  HTTP_INTERCEPTORS
} from "@angular/common/http";
import { SharedModule } from "./shared/shared.module";
import {
  LocationStrategy,
  HashLocationStrategy,
  CommonModule
} from "@angular/common";
import { ToastModule } from 'primeng/toast';
import { LoadingBarHttpClientModule } from "@ngx-loading-bar/http-client";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { LoaderService } from "./shared/services/loader.service";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { HttpModule } from "@angular/http";
import { TranslateModule, TranslateLoader, TranslateService } from "@ngx-translate/core";
import { AppConfig } from "./shared/services/app.config.service";
import { DialogService } from "./shared/services/dialog.service";
import { RequestInterceptor } from "./shared/interceptors/request.interceptor";
import { ResponseInterceptor } from "./shared/interceptors/response.interceptor";
import { DefinedMessageService } from "./shared/services/message.service";
import { Router } from "@angular/router";
import { ServiceManager } from "./shared/services/service-manager.service";
import { TranslateHttpLoader } from "@ngx-translate/http-loader";
import { UserIdleModule } from "angular-user-idle";
import { ApiHttpClient } from "./shared/common/api-http-client";
import { SideBarComponent } from './modules/master/side-bar/side-bar.component';
import { MasterModule } from "./modules/master/master.module";
import { UserManagementModule } from './modules/user/user.module';
import { AuthenticationService } from './api-service/service/authentication.service';
import { AlertService } from './shared/services/alert.service';
import { MessageService } from 'primeng/api';
import { NavigatorService } from './shared/services/navigator.service';

export function initializeApp(appConfig: AppConfig): Function {
  return () => appConfig.load();
}

export function createTranslateLoader(http: HttpClient): TranslateHttpLoader {
  return new TranslateHttpLoader(http, "./assets/i18n/", ".json");
}

@NgModule({
  declarations: [AppComponent, SideBarComponent],
  entryComponents: [],
  exports: [CommonModule, FormsModule ],
  imports: [
    ToastModule,
    HttpClientModule,
    BrowserModule,
    BrowserAnimationsModule,
    SharedModule,
    MasterModule,
    FormsModule,
    LoadingBarHttpClientModule,
    AppRoutingModule,
    HttpModule,
    UserManagementModule,
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: createTranslateLoader,
        deps: [HttpClient]
      }
    }),
    UserIdleModule.forRoot({ idle: 900, timeout: 1, ping: 5 })
  ],
  providers: [
    DefinedMessageService,
    MessageService,
    AppConfig,
    ApiHttpClient,
    DialogService,
    TranslateService,
    {
      provide: APP_INITIALIZER,
      useFactory: initializeApp,
      deps: [AppConfig],
      multi: true
    },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: RequestInterceptor,
      multi: true,
      deps: [LoaderService, AuthenticationService]
    },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: ResponseInterceptor,
      multi: true,
      deps: [Router, LoaderService, AlertService, AuthenticationService, TranslateService, NavigatorService]
    },
    {
      provide: LocationStrategy,
      useClass: HashLocationStrategy
    }
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  bootstrap: [AppComponent]
})
export class AppModule {
  constructor(private injector: Injector) {
    ServiceManager.injector = this.injector;
  }
}
