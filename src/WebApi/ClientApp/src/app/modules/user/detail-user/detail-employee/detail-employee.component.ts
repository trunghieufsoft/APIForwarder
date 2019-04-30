import { Component, DoCheck, ChangeDetectorRef } from "@angular/core";
import { FormGroup, Validators } from "@angular/forms";
import { DialogBaseComponent } from "src/app/base/dialog.component";
import { UserService } from "src/app/api-service/service/user-management.service";
import { customEmailValidator } from "src/app/shared/directives/custom-email-validator";
import { ALL, SPACE } from "src/app/app.constant";
import { CONSTANT } from "src/app/shared/common/constant";
import { dateValidator, dateRangeValidator } from 'src/app/shared/directives/date-range-validator';

@Component({
  selector: "app-detail-employee",
  templateUrl: "./detail-employee.component.html",
  providers: [UserService]
})
export class DetailEmployeeComponent extends DialogBaseComponent
  implements DoCheck {
  public form: FormGroup;
  public formInit: FormGroup;
  public formReset: FormGroup;
  public flagUpdate: boolean;
  public countryArr: any[];
  public groupArr: any[];
  public arrData: any = CONSTANT.arrData;
  public username: string;
  public fullname: string;
  public contactNo: string;
  public email: string;
  public address: string;
  public endOfDay: string;
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
    this.paramsInput = params;
    if (params.arrData) {
      this.arrData = params.arrData;

      this.countryArr = this.arrData.countries;
      let countryStr: any[] = this.getDefaultCountry(this.countryArr);
      this.groupArr = this.formatDropdownForGroup(this.arrData.groups);
      let groupStr: any[] = this.getDefaultGroup(this.groupArr);

      if (countryStr && groupStr) {
        this.form.controls.country.setValue(countryStr);
        this.form.controls.group.setValue(groupStr);
      }
    }
    this.setData();
  }

  /**
   * Set Form
   * @memberof DetailEmployeeComponent
   */
  public setForm(): void {
    this.flagUpdate = false;
    let expiredDate = new Date();
    expiredDate.setMonth(new Date().getMonth() + 6);
    this.form = this.formBuilder.group({
      status: [true],
      availability: [true],
      country: [SPACE],
      group: [SPACE],
      userName: [SPACE, Validators.required],
      fullName: [SPACE, Validators.required],
      address: [SPACE, Validators.required],
      phoneNo: [SPACE, Validators.required],
      email: [SPACE, [Validators.required, customEmailValidator]],
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
  
  public setData(): void {
    if (this.paramsInput.idUser) {
      this.flagUpdate = true;
      this.startBlockUI();
      this.userService.viewUserByID(this.paramsInput.idUser).subscribe(res => {
        this.stopBlockUI();
        if (res.data) {
          this.stopBlockUI();
          this.endOfDay = this.setEndOfDate(res.data.statusDetail.endOfDay);
          var controls = this.form.controls;
          controls.status.setValue(res.data.statusDetail.active);
          controls.availability.setValue(res.data.statusDetail.availability);
          var country = this.getObjectArrayFromString(
            this.countryArr,
            res.data.countryId
          );
          if (!country) {
            country = res.data.countryId;
          }
          var group = this.getObjectArrayFromString(
            this.groupArr,
            res.data.groups
          );
          if (!group) {
            group = res.data.groups;
          }
          controls.country.setValue(country);
          controls.group.setValue(group);
          controls.userName.setValue(res.data.username);
          controls.fullName.setValue(res.data.fullName);
          controls.address.setValue(res.data.address);
          controls.phoneNo.setValue(res.data.phoneNo);
          controls.email.setValue(res.data.email);
          controls.startDate.setValue(res.data.startDate);
          controls.expiredDate.setValue(res.data.expiredDate);
        }
        this.formInit = this.form.value;
      });
    }
  }

  public onSave(): void {
    this.markFormDirty();
    var controls = this.form.controls;
    if (!controls.country.value) {
      controls.country.markAsDirty();
      controls.country.setErrors({ requiredSelect: true });
    }
    if (!controls.group.value) {
      controls.group.markAsDirty();
      controls.group.setErrors({ requiredSelect: true });
    }
    if (!this.isValidForm(this.form)) {
      return;
    }
    if (this.form.value === this.formInit) {
      var msg = this.translate.get("dialog.noChange")["value"];
      this.afterSave(msg);
    }
    if (this.paramsInput.idUser === undefined) {
      this.create();
    } else {
      this.update();
    }
  }

  public onCancel(): void {
    this.hide();
    this.canceledEvent.emit();
  }

  public update(): void {
    const param: any = {
      id: this.paramsInput.idUser,
      status: {
        active: this.form.controls.status.value,
        availability: this.form.controls.availability.value,
        endOfDay: this.endOfDay === "Yes"
      },
      countryId: this.form.controls.country.value.id,
      fullName: this.form.controls.fullName.value,
      group: this.form.controls.group.value.id,
      addressInfo: {
        address: this.form.controls.address.value,
        phoneNo: this.form.controls.phoneNo.value,
        email: this.form.controls.email.value,
      },
      expiredDate: this.form.controls.expiredDate.value
    };
    this.startBlockUI();
    this.userService.updateEmployee(param).subscribe(data => {
      var msg = this.translate.get("dialog.success")["value"];
      this.afterSave(msg);
      this.stopBlockUI();
    });
  }

  public create(): void {
    const param: any = {
      status: this.form.controls.status.value,
      countryId: this.form.controls.country.value.id,
      group: this.form.controls.group.value.id,
      username: this.form.controls.userName.value,
      fullName: this.form.controls.fullName.value,
      address: this.form.controls.address.value,
      phoneNo: this.form.controls.phoneNo.value,
      email: this.form.controls.email.value,
      startDate: this.form.controls.startDate.value,
      expiredDate: this.form.controls.expiredDate.value,
      password: ""
    };
    this.startBlockUI();
    this.userService.createNewEmployee(param).subscribe(data => {
      var msg = this.translate.get("dialog.success")["value"];
      this.afterSave(msg);
      this.stopBlockUI();
    });
  }

  public afterSave(msg: any): void {
    this.hide();
    this.submittedEvent.emit({ success: true, msg: msg });
  }

  public setEndOfDate(param: boolean): string {
    if (param === true) {
      return "Yes";
    } else {
      return "No";
    }
  }

  public ngDoCheck(): void {
    this.username = this.form.controls.userName.value;
    this.fullname = this.form.controls.fullName.value;
    this.address = this.form.controls.address.value;
    this.contactNo = this.form.controls.phoneNo.value;
    this.email = this.form.controls.email.value;
  }
}
