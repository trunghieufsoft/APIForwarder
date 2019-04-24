import { CommonModule } from '@angular/common';
import { HttpClient } from "@angular/common/http";
import { NgModule } from '@angular/core';
import { BlankComponent } from '../modules/master/blank/blank.component';
import { ErrorComponent } from '../modules/master/error/error.component';
import { ApiDialogComponent } from './components/api-dialog.component';
import { ErrorMessageService } from "./services/error-message.service";
import { TranslateLoader, TranslateModule } from "@ngx-translate/core";
import { DateDirective } from "./directives/date.directive";
import { BlockUIComponent } from "./components/block-ui/block-ui.component";
import { TrimInputDirective } from "./directives/trim-input.directive";
import { NoSpaceDirective } from './directives/no-space.directive';
import { ModalBlockUIDirective } from "./components/block-ui/modal-block-ui.directive";
import { DateTimeComponent } from "./components/date-time/date-time.component";
import { MultiSelectComponent } from "./components/multi-select/multi-select.component";
import { PageLimitOptionsComponent } from "./components/page-limit-options/page-limit-options.component";
import { SingleSelectComponent } from "./components/single-select/single-select.component";
import { TableFooterComponent } from "./components/table-footer/table-footer.component";
import { TableComponent } from "./components/table/table.component";
import { ErrorTooltipModule } from "./directives/error-tooltip";
import { WeekPickerComponent } from "./components/week-picker/week-picker.component";
import { TranslateHttpLoader } from "@ngx-translate/http-loader";
import { ReactiveFormsModule } from "@angular/forms";
import { MessageService } from "primeng/api";
import { ToastModule } from "primeng/toast";
import { WeekPipe } from './pipe/week.pipe';
import { CellValuePipe } from './pipe/cell-value.pipe';
import { CellTitlePipe } from './pipe/cell-title.pipe';
export function createTranslateLoader(http: HttpClient): TranslateHttpLoader {
  return new TranslateHttpLoader(http, "./assets/i18n/", ".json");
}

@NgModule({
  imports: [
    CommonModule,
    ReactiveFormsModule,
    ErrorTooltipModule,
    ToastModule,
    CommonModule,
    TranslateModule.forChild({
      loader: {
        provide: TranslateLoader,
        useFactory: createTranslateLoader,
        deps: [HttpClient]
      }
    })
  ],
  declarations: [
    WeekPickerComponent,
    PageLimitOptionsComponent,
    DateTimeComponent,
    ModalBlockUIDirective,
    MultiSelectComponent,
    SingleSelectComponent,
    DateDirective,
    ErrorComponent,
    BlockUIComponent,
    BlankComponent,
    WeekPipe,
    TableComponent,
    TableFooterComponent,
    ApiDialogComponent,
    CellValuePipe,
    CellTitlePipe,
    NoSpaceDirective,
    TrimInputDirective
  ],
  providers: [ErrorMessageService, MessageService],
  exports: [
    WeekPickerComponent,
    PageLimitOptionsComponent,
    DateTimeComponent,
    TableComponent,
    TableFooterComponent,
    ReactiveFormsModule,
    BlockUIComponent,
    ErrorComponent,
    ErrorTooltipModule,
    MultiSelectComponent,
    SingleSelectComponent,
    ApiDialogComponent,
    TrimInputDirective,
    NoSpaceDirective,
    BlankComponent
  ]
})
export class SharedModule {}
