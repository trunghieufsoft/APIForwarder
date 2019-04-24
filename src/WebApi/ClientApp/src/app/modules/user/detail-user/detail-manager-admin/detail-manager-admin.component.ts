import { Component, DoCheck, ChangeDetectorRef } from "@angular/core";
import { FormGroup, Validators } from "@angular/forms";
import { DialogBaseComponent } from "src/app/base/dialog.component";
import { UserService } from "src/app/api-service/service/user-management.service";
import { customEmailValidator } from "src/app/shared/directives/custom-email-validator";
import { CommonService } from "src/app/api-service/service/common.service";
import { dateValidator, dateRangeValidator } from "src/app/shared/directives/date-range-validator";
import { ALL } from "src/app/app.constant";
import { CONSTANT } from "src/app/shared/common/constant";
import { ManagerDto } from 'src/app/api-service/model/user-management-dto';
@Component({
  selector: "app-detail-manager-admin",
  templateUrl: "./detail-manager-admin.component.html",
  providers: [UserService]
})
export class DetailManagerAdminComponent extends DialogBaseComponent implements DoCheck {
  public form: FormGroup;
  public formInit: FormGroup;
  public formReset: FormGroup;
  public idUser: number;
  public flagManager: boolean;
  public detailManager: any;
  public arrData: any = CONSTANT.arrData;
  public dataManager: any;
  public countryArr: any;
  public groupsArr: any;
  public adid: string;
  public name: string;
  public email: string;
  public startDate: string;
  public expiredDate: string;
  public groups: string;
  private countryStr: any = ALL;
  private groupStr: any = ALL;
  constructor(
    private userService: UserService,
    private changeDetector: ChangeDetectorRef
  ) {
    super();
    this.currentUser = this.userService.getCurrentUser();
  }

  public ngBeforeOnInit(): void {
    this.show();
  }
  public ngBeforeOnDestroy(): void {}

  public init(params: any): void {
    this.setForm();
    this.idUser = params.idUser;
    this.detailManager = params;
    if (params.arrData) {
      this.arrData = params.arrData;
      this.countryArr = this.arrData.countries;
      this.countryStr = this.getDefaultCountry(this.countryArr);
      this.groupsArr = this.arrData.groups;
      this.groupStr = this.formatGroupsArr(this.groupsArr, null);
      if (this.countryStr && this.groupStr) {
        this.form.controls.country.setValue(this.countryStr);
        this.form.controls.groups.setValue(this.groupStr);
        this.formReset = this.form.value;
      }
    }
    this.setData();
  }

  /**
   * Init Form
   * @memberof VendorComponent
   */
  public setForm(): any {
    this.flagManager = false;
    let expiredDate = new Date();
    expiredDate.setMonth(new Date().getMonth() + 6);
    this.form = this.formBuilder.group({
      status: [true, Validators.required],
      adid: ["", Validators.required],
      name: ["", Validators.required],
      email: ["", [customEmailValidator, Validators.required]],
      groups: ["", Validators.required],
      country: ["", Validators.required],
      startDate: [this.currentDate],
      expiredDate: [expiredDate]
    },
    {
      validator: [
        dateValidator(["startDate", "expiredDate"]),
        dateRangeValidator("startDate", "expiredDate")
      ]
    });
  }

  public countryChange(e: any): void {
    this.changeDetector.detectChanges();
  }

  public setData(): void {
    if (this.detailManager.idUser > 0) {
      this.flagManager = true;
      this.startBlockUI();
      this.userService.viewUserByID(this.detailManager.idUser).subscribe(res => {
        if (res.data) {
          var controls = this.form.controls;
          controls.status.setValue(
            res.data.status === "Active" ? true : false
          );
          var country = this.getObjectArrayFromString(
            this.countryArr,
            res.data.countryId
          );
          controls.country.setValue(country);
          if (country) {
            // this.slicArr = country.slic;
          } else {
            country = res.data.countryId;
          }
          controls.adid.setValue(res.data.username);
          controls.name.setValue(res.data.fullName);
          setTimeout(() => {
            controls.groups.setValue(res.data.groups);
          }, 300);
          controls.email.setValue(res.data.email);
          this.stopBlockUI();
          this.dataManager = res.data;
        }
      });
    }
  }

  public onCancel(): void {
    this.hide();
    this.canceledEvent.emit();
  }

  public onSave(): void {
    var controls = this.form.controls;
    if (!controls.groups.value) {
      controls.groups.markAsDirty();
      controls.groups.setErrors({ requiredSelect: true });
    }
    if (!controls.country.value) {
      controls.country.markAsDirty();
      controls.country.setErrors({ requiredSelect: true });
    }
    if (!this.isValidForm(this.form)) {
      return;
    }
    if (this.form.value === this.formInit) {
      var msg = this.translate.get("dialog.noChange")["value"];
      this.afterSave(msg);
    }
    if (this.idUser === undefined) {
      this.create();
    } else {
      this.update();
    }
  }

  public create(): void {
    const param: ManagerDto = {
      countryId: this.form.controls.country.value.id,
      fullName: this.form.controls.name.value,
      username: this.form.controls.adid.value,
      password: "",
      groups: this.form.controls.groups.value,
      address: "No-Address",
      phoneNo: "No-Phone",
      email: this.form.controls.email.value,
      startDate: this.form.controls.startDate.value,
      expiredDate: this.form.controls.expiredDate.value
    };
    this.startBlockUI();
    this.userService.createNewManager(param).subscribe(data => {
      var msg = this.translate.get("dialog.success")["value"];
      this.afterSave(msg);
      this.stopBlockUI();
    });
  }

  public update(): void {
    const param: any = {
      status: this.form.controls.status.value,
      adid: this.form.controls.adid.value,
      name: this.form.controls.name.value,
      email: this.form.controls.email.value,
      country: this.form.controls.country.value.id,
      groups: this.form.controls.groups.value.id,
      password: ""
    };
    this.startBlockUI();
    this.userService.updateManager(param).subscribe(data => {
      var msg = this.translate.get("dialog.success")["value"];
      this.afterSave(msg);
      this.stopBlockUI();
    });
  }

  public afterSave(msg: string): void {
    this.hide();
    this.submittedEvent.emit({ success: true, msg: msg });
  }

  public ngDoCheck(): void {
    this.adid = this.form.controls.adid.value;
    this.name = this.form.controls.name.value;
    this.email = this.form.controls.email.value;
    // this.startDate = this.form.controls.startDate.value;
    // this.expiredDate = this.form.controls.expiredDate.value;
  }
}
