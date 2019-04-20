import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { BlankComponent } from './modules/master/blank/blank.component';
import { ErrorComponent } from './modules/master/error/error.component';
import { SharedModule } from './shared/shared.module';

const routes: Routes = [

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
