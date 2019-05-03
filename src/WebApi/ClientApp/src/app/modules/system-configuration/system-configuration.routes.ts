import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";
import { SystemConfigurationComponent } from "./system-configuration.component";
import { CONSTANT } from 'src/app/shared/common/constant';
const ROUTER: Routes = [
  {
    path: "",
    component: SystemConfigurationComponent,
    data: {
      title: "System Configuration Management",
      roles: [CONSTANT.userType.super]
    }
  }
];

@NgModule({
  imports: [RouterModule.forChild(ROUTER)],
  exports: [RouterModule]
})
export class SystemConfigurationManagementRoutingModule {}
