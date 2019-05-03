import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component
} from "@angular/core";
import { FormGroup } from "@angular/forms";
import { API } from "src/app/api-service/api";
import { SystemConfigService } from "src/app/api-service/service/system-config.service";
import { ListBaseComponent, SortEvent } from "src/app/base/list-base.component";
import { CONSTANT } from "src/app/shared/common/constant";
import {
  dateRangeValidator,
  dateValidator
} from "src/app/shared/directives/date-range-validator";
import { AppConfig } from "src/app/shared/services/app.config.service";
import { ALL } from 'src/app/app.constant';

@Component({
  selector: "app-system-log",
  templateUrl: "./system-log.component.html",
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [SystemConfigService]
})
export class SystemLogComponent extends ListBaseComponent {
  public formGroup: FormGroup;
  public formReset: FormGroup;
  public url: string = API.log;
  public columns: any = [
    { name: "table.description", prop: "description", sort: true },
    { name: "table.message", prop: "message", sort: true },
    { name: "table.time", prop: "time", sort: true }
  ];
  public arrayDes: any = ["Information", "Error", "Warning"];
  private params: any = {
    type: 3,
    search: {
      keySearch: {},
      pageIndex: 0,
      limit: AppConfig.settings.pageItems,
      orderBy: "",
      isSortDescending: true
    },
    from: null,
    to: null
  };
  constructor(
    private service: SystemConfigService,
    private changeDetector: ChangeDetectorRef
  ) {
    super();
  }

  public ngOnInit(): void {
    this.startBlockUI();
    this.initForm();
    this.getFilter();
    this.onSearch();
  }

  public getFilter(): void {
    this.service.getByKey(CONSTANT.config.systemLog).subscribe(res => {
      this.stopBlockUI();
      if (res.success && res.data && res.data.value) {
        var data = JSON.parse(res.data.value);
        if (!data.Error) {
          this.arrayDes = this.arrayDes.filter(x => x !== "Error");
        }
        if (!data.Information) {
          this.arrayDes = this.arrayDes.filter(x => x !== "Information");
        }
        if (!data.Warning) {
          this.arrayDes = this.arrayDes.filter(x => x !== "Warning");
        }
      }
    });
  }

  public onReset(): void {
    this.formGroup.reset();
    this.formGroup.setValue(this.formReset);
  }

  public initForm(): void {
    this.createFormBuilder();
  }

  public convertData(data: any): void {
    this.rows = data.dataResult;
    for (let i = 0; i < this.rows.length; i++) {
      this.rows[i].time = this.formatDate(
        this.rows[i].time,
        CONSTANT.format.dateTime
      );
    }
  }

  public onSortChange(event: SortEvent): void {
    this.sortChange(event).subscribe(res => {
      this.changeDetector.detectChanges();
      if (!res.success) {
        this.alertService.error(res.errorMessage);
      }
    });
  }

  public onPageChange(event: any): void {
    this.pageChange(event).subscribe(res => {
      this.changeDetector.detectChanges();
      if (!res.success) {
        this.alertService.error(res.errorMessage);
      }
    });
  }

  public onLimitChange(event: any): void {
    this.limitChange(event).subscribe(res => {
      this.changeDetector.detectChanges();
    });
  }

  public onSearch(): void {
    if (!this.isValidForm(this.formGroup)) {
      return;
    }
    var description = this.formGroup.controls.description.value.id;
    var message = this.formGroup.controls.message.value;
    this.params.search.keySearch["description"] =
      description === ALL ? "" : description;
    this.params.search.keySearch["message"] = message;
    this.params.from = this.formGroup.controls.from.value;
    this.params.to = this.formGroup.controls.to.value;
    this.startBlockUI();
    this.retrieveData(this.params, 1).subscribe(res => {
      this.stopBlockUI();
      this.changeDetector.detectChanges();
    });
  }

  private createFormBuilder(): any {
    this.formGroup = this.formBuilder.group(
      {
        description: [ALL],
        message: [],
        from: [this.currentDate],
        to: [this.currentDate]
      },
      {
        validator: [
          dateRangeValidator("from", "to"),
          dateValidator(["from", "to"])
        ]
      }
    );
    this.formReset = this.formGroup.value;
  }
}
