import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { BlankComponent } from './modules/master/blank/blank.component';
import { ErrorComponent } from './modules/master/error/error.component';
import { SharedModule } from './shared/shared.module';
import { AuthGuardService } from './shared/services/auth-guard.service';

const routes: Routes = [
  { path: "", redirectTo: "/user", pathMatch: "full" },
  {
    path: "user",
    loadChildren: "./modules/user/user.module#UserManagementModule",
    data: { title: "User Management" },
    canActivate: [AuthGuardService]
  },
  {
    path: "log",
    loadChildren:
      "./modules/audit-log/audit-log.module#AuditLogManagementModule",
    data: { title: "Audit Log Management" },
    canActivate: [AuthGuardService]
  },
  {
    path: "system-configuration",
    loadChildren:
      "./modules/system-configuration/system-configuration.module#SystemConfigurationManagementModule",
    data: { title: "System Configuration Management" },
    canActivate: [AuthGuardService]
  },
  {
    path: "view-profile",
    loadChildren:
      "./modules/view-profile/view-profile.module#ViewProfileManagementModule",
    data: { title: "View Profile Management" },
    canActivate: [AuthGuardService]
  },
  {
    path: 'error',
    component: ErrorComponent
  },
  {
    path: 'blank',
    component: BlankComponent
  }
];

@NgModule({
  imports: [SharedModule, RouterModule.forRoot(routes)],
  exports: [RouterModule],
  declarations: []
})
export class AppRoutingModule { }
