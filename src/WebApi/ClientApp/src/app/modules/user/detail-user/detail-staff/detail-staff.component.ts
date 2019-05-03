import { Component, DoCheck, ChangeDetectorRef, EventEmitter } from "@angular/core";
import { FormGroup, Validators } from "@angular/forms";
import { DialogBaseComponent } from "src/app/base/dialog.component";
import { UserService } from "src/app/api-service/service/user-management.service";
import { customEmailValidator } from "src/app/shared/directives/custom-email-validator";
import { ALL, SPACE } from "src/app/app.constant";
import { CONSTANT } from "src/app/shared/common/constant";
import { dateValidator, dateRangeValidator } from 'src/app/shared/directives/date-range-validator';
import { CommonService } from 'src/app/api-service/service/common.service';

@Component({
  selector: "app-detail-staff",
  templateUrl: "./detail-staff.component.html",
  providers: [UserService]
})
export class DetailStaffComponent extends DialogBaseComponent implements DoCheck {
  public form: FormGroup;
  public formInit: FormGroup;
  public formReset: FormGroup;

  public countryArr: any[];
  public groupArr: any[];
  public userArr: any[];

  public arrData: any = CONSTANT.arrData;
  public flagUpdate: boolean;

  public username: string;
  public fullname: string;
  public contactNo: string;
  public email: string;
  public address: string;

  private user: any;
  private country: string;

  constructor(
    private userService: UserService,
    private common: CommonService,
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

      this.user = params.idUser ? this.arrData.userByType[1].users.filter(x => x.username === params.username)[0] : [];
      this.userArr = this.formatDropdownForUsers(params.idUser ? this.user.users : []);
      let userStr: any[] = this.getObjectArrayFromParentArray(this.userArr, null);

      if (countryStr && groupStr) {
        this.form.controls.country.setValue(countryStr);
        this.form.controls.group.setValue(groupStr);
        this.form.controls.users.setValue(userStr);
      }
    }
    this.setData();
  }

  /**
   * Set Form
   * @memberof DetailStaffComponent
   */
  public setForm(): void {
    this.flagUpdate = false;
    let expiredDate = new Date();
    expiredDate.setMonth(new Date().getMonth() + 6);
    this.form = this.formBuilder.group({
      status: [true],
      country: [SPACE],
      group: [SPACE],
      userName: [SPACE, Validators.required],
      fullName: [SPACE, Validators.required],
      address: [SPACE, Validators.required],
      phoneNo: [SPACE, Validators.required],
      email: [SPACE, [Validators.required, customEmailValidator]],
      users: [SPACE],
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
    if (e != null && !(e instanceof Event)) {
      var isOld = e.id === this.country;
      this.userArr = isOld ? this.formatDropdownForUsers(this.user.users) : [];
      this.form.controls.users.setValue(SPACE);
    }
    this.changeDetector.detectChanges();
  }
  
  public setData(): void {
    if (this.paramsInput.idUser) {
      this.flagUpdate = true;
      var controls = this.form.controls;
      this.startBlockUI();
      this.userService.viewUserByID(this.paramsInput.idUser).subscribe(res => {
        this.stopBlockUI();
        if (res.data) {
          this.stopBlockUI();
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

          let valueArr: any[] = [];
          controls.country.setValue(country);
          if (res.data.users) {
            let userlist: any[] = res.data.users.split(",");
            userlist.forEach(item => {
              valueArr.push(this.user.users.filter(x => x.code === item)[0].fullName);
            });
          }

          controls.status.setValue(res.data.statusStr === "Active");
          controls.country.setValue(country);
          controls.group.setValue(group);
          controls.userName.setValue(res.data.username);
          controls.fullName.setValue(res.data.fullName);
          controls.address.setValue(res.data.address);
          controls.phoneNo.setValue(res.data.phoneNo);
          controls.email.setValue(res.data.email);
          controls.startDate.setValue(res.data.startDate);
          controls.expiredDate.setValue(res.data.expiredDate);
          controls.users.setValue(valueArr.join(","));
        }
        this.formInit = this.form.value;
      });
    }
  }

  public statusActiveChange(): void {
    if (this.form.controls.status.value) {
      this.form.controls.availability.setValue(false);
    }
  }

  public statusAvailabilityChange(): void {
    if (!this.form.controls.status.value) {
      this.form.controls.availability.setValue(false);
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
    var users = this.form.controls.users.value;
    if (users) {
      var valueArr: any[] = [];
      let userlist: string[] = users.split(",");
      userlist.forEach(item => {
        valueArr.push(this.user.users.filter(x => x.fullName === item.trim())[0].code);
      });
      users = valueArr.join(",");
    }
    const param: any = {
      id: this.paramsInput.idUser,
      status: this.form.controls.status.value,
      countryId: this.form.controls.country.value.id,
      fullName: this.form.controls.fullName.value,
      group: this.form.controls.group.value.id,
      users: users,
      addressInfo: {
        address: this.form.controls.address.value,
        phoneNo: this.form.controls.phoneNo.value,
        email: this.form.controls.email.value,
      },
      expiredDate: this.form.controls.expiredDate.value
    };
    this.startBlockUI();
    this.userService.updateStaff(param).subscribe(() => {
      var msg = this.translate.get("dialog.changeSuccess")["value"];
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
      password: SPACE
    };
    this.startBlockUI();
    this.userService.createNewStaff(param).subscribe(() => {
      var msg = this.translate.get("dialog.createSuccess")["value"];
      this.afterSave(msg);
      this.stopBlockUI();
    });
  }

  public afterSave(msg: any): void {
    this.hide();
    this.common.getListAssignByType().subscribe(
      (data) => {
        if (data) {
          this.arrData.users[0].users = data.data[0].users;
          this.arrData.users[0].totalUser = data.data[0].totalUser;
          this.arrData.userByType = data.data;
          this.submittedEvent.emit({ success: true, msg: msg, listAssignByType: data });
        } else {
          this.submittedEvent.emit({ success: false, msg: this.translate.get("dialog.somethingWrong")["value"] });
        }
      }
    );
  }

  public ngDoCheck(): void {
    this.username = this.form.controls.userName.value;
    this.fullname = this.form.controls.fullName.value;
    this.address = this.form.controls.address.value;
    this.contactNo = this.form.controls.phoneNo.value;
    this.email = this.form.controls.email.value;
  }
}
