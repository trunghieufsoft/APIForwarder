import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";
//import { UserComponent } from "./user.component";
const ROUTER: Routes = [
  {
    path: "",
    //component: UserComponent,
    data: { title: "User Management" }
  }
];

@NgModule({
  imports: [RouterModule.forChild(ROUTER)],
  exports: [RouterModule]
})
export class UserManagementRoutingModule {}
