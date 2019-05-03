import { NgModule } from "@angular/core";
import { TranslateLoader, TranslateModule } from "@ngx-translate/core";
import { TranslateHttpLoader } from "@ngx-translate/http-loader";
import { SharedModule } from "src/app/shared/shared.module";
import { HttpClient } from "@angular/common/http";
import { AuditLogManagementRoutingModule } from "./audit-log.routes";
// import { TransactionLogComponent } from "./transaction-log/transaction-log.component";
// import { SynchronizationLogComponent } from "./synchronization-log/synchronization-log.component";
import { SystemLogComponent } from "./system-log/system-log.component";
import { MessageService } from 'primeng/api';
import { CommonModule } from '@angular/common';
import { ToastModule } from 'primeng/toast';
export function createTranslateLoader(http: HttpClient): TranslateHttpLoader {
  return new TranslateHttpLoader(http, "./assets/i18n/", ".json");
}

@NgModule({
  imports: [
    SharedModule,
    CommonModule,
    ToastModule,
    AuditLogManagementRoutingModule,
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
    // TransactionLogComponent,
    // SynchronizationLogComponent,
    SystemLogComponent
  ],
  // exports: [TransactionLogComponent, TranslateModule],
  exports: [TranslateModule],
  providers: [MessageService]
})
export class AuditLogManagementModule {}
