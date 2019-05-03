import { NgModule } from "@angular/core";
import { CommonModule } from '@angular/common';
import { TranslateLoader, TranslateModule } from "@ngx-translate/core";
import { SharedModule } from "src/app/shared/shared.module";
import { UserComponent } from "./user.component";
import { TranslateHttpLoader } from "@ngx-translate/http-loader";
import { UserManagementRoutingModule } from "./user.routes";
import { EmployeeComponent } from "./employee/employee.component";
import { StaffComponent } from "./staff/staff.component";
import { ManagerComponent } from "./manager/manager.component";
import { HttpClient } from "@angular/common/http";
import { DetailManagerAdminComponent } from "./detail-user/detail-manager-admin/detail-manager-admin.component";
import { DetailEmployeeComponent } from "./detail-user/detail-employee/detail-employee.component";
import { DetailStaffComponent } from "./detail-user/detail-staff/detail-staff.component";
import { ToastModule } from 'primeng/toast';
export function createTranslateLoader(http: HttpClient): TranslateHttpLoader {
  return new TranslateHttpLoader(http, "./assets/i18n/", ".json");
}

@NgModule({
  imports: [
    SharedModule,
    CommonModule,
    ToastModule,
    UserManagementRoutingModule,
    TranslateModule.forChild({
      loader: {
        provide: TranslateLoader,
        useFactory: createTranslateLoader,
        deps: [HttpClient]
      }
    })
  ],

  entryComponents: [
    DetailManagerAdminComponent,
    DetailStaffComponent,
    DetailEmployeeComponent
  ],
  declarations: [
    UserComponent,
    ManagerComponent,
    StaffComponent,
    EmployeeComponent,

    DetailManagerAdminComponent,
    DetailStaffComponent,
    DetailEmployeeComponent

  ],
  exports: [
    UserComponent,
    CommonModule,
    TranslateModule,
    DetailManagerAdminComponent,
    DetailStaffComponent,
    DetailEmployeeComponent
  ],
  providers: []
})
export class UserManagementModule {}
