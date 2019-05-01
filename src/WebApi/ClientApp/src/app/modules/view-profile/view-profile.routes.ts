import { ViewProfileComponent } from './view-profile.component';
import { Routes, RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';

const ROUTER: Routes = [
  {
    path: "",
    component: ViewProfileComponent,
    data: { title: "View Profile Management" }
  }
];

@NgModule({
  imports: [RouterModule.forChild(ROUTER)],
  exports: [RouterModule]
})
export class ViewProfileManagementRoutingModule {}
