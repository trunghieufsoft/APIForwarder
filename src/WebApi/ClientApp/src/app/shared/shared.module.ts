import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { BlankComponent } from '../modules/master/blank/blank.component';
import { ErrorComponent } from '../modules/master/error/error.component';
import { ModalBlockUIDirective } from './components/block-ui/modal-block-ui.directive';

@NgModule({
  imports: [
    CommonModule
  ],
  declarations: [
    ModalBlockUIDirective,
    ErrorComponent,
    BlankComponent
  ],
  providers: [

  ],
  exports: [
    ErrorComponent,
    BlankComponent
  ]
})
export class SharedModule {}
