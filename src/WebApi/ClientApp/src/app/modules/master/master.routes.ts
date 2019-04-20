import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";
import { LoginComponent } from "./login/login.component";
import { ForgotPassWordComponent } from "./forgot-password/forgot-password.component";
import { ChangePasswordComponent } from "./changepassword/change-password.component";
import { AuthGuardService } from "src/app/shared/services/auth-guard.service";

const ROUTES: Routes = [
  {
    path: "login",
    component: LoginComponent,
    data: { title: "Login" }
  },
  {
    path: "forgot-password",
    component: ForgotPassWordComponent,
    data: { title: "Forgot Password" }
  },
  {
    path: "change-password",
    component: ChangePasswordComponent,
    data: { title: "Change Password" }
  }
];

@NgModule({
  imports: [RouterModule.forChild(ROUTES)],
  exports: [RouterModule]
})
export class MasterRoutingModule {}
