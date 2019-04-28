import { Component, DoCheck, ChangeDetectorRef } from "@angular/core";
import { FormGroup, Validators } from "@angular/forms";
import { DialogBaseComponent } from "src/app/base/dialog.component";
import { UserService } from "src/app/api-service/service/user-management.service";
import { customEmailValidator } from "src/app/shared/directives/custom-email-validator";
import { dateValidator, dateRangeValidator } from "src/app/shared/directives/date-range-validator";
import { ALL } from "src/app/app.constant";
import { CONSTANT } from "src/app/shared/common/constant";
import { ManagerDto } from 'src/app/api-service/model/user-management-dto';
import { CommonService } from 'src/app/api-service/service/common.service';
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
  public flagUpdate: boolean;
  public detailManager: any;
  public arrData: any = CONSTANT.arrData;
  public dataManager: any;
  public countryArr: any;
  public groupsArr: any;
  public userArr: any;
  public adid: string;
  public name: string;
  public email: string;
  public groups: string;
  private user: any;
  private country: string;
  private countryStr: any = ALL;
  private groupStr: any = ALL;
  private userStr: any = ALL;
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
    this.idUser = params.idUser;
    this.detailManager = params;
    if (params.arrData) {
      this.arrData = params.arrData;
      this.countryArr = this.arrData.countries;
      this.countryStr = this.getDefaultCountry(this.countryArr);
      this.groupsArr = this.arrData.groups;
      this.groupStr = this.formatArrToSmallArr(this.groupsArr, null);
      this.user = params.idUser ? this.arrData.users[0].users.filter(x => x.username === params.username)[0] : [];
      this.userArr = this.formatDropdownForUsers(params.idUser ? this.user.users : []);
      this.userStr = this.formatArrToSmallArr(this.userArr, null);
      if (this.countryStr && this.groupStr && this.userStr) {
        this.form.controls.country.setValue(this.countryStr);
        this.form.controls.groups.setValue(this.groupStr);
        this.form.controls.users.setValue(this.userStr);
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
    this.flagUpdate = false;
    let expiredDate = new Date();
    expiredDate.setMonth(new Date().getMonth() + 6);
    this.form = this.formBuilder.group({
      status: [true, Validators.required],
      adid: ["", Validators.required],
      name: ["", Validators.required],
      email: ["", [customEmailValidator, Validators.required]],
      country: ["", Validators.required],
      groups: ["", Validators.required],
      users: [""],
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
      this.form.controls.users.setValue("");
    }
    this.changeDetector.detectChanges();
  }

  public setData(): void {
    if (this.detailManager.idUser) {
      this.flagUpdate = true;
      this.startBlockUI();
      this.userService.viewUserByID(this.detailManager.idUser).subscribe(res => {
        if (res.data) {
          var controls = this.form.controls;
          controls.status.setValue(
            res.data.statusStr === "Active" ? true : false
          );
          var country = this.getObjectArrayFromString(
            this.countryArr,
            res.data.countryId
          );
          this.country = res.data.countryId;
          if (!country) {
            country = res.data.countryId;
          }
          let valueArr: any[] = [];
          controls.country.setValue(country);
          if (res.data.users) {
            let userlist: any[] = res.data.users.split(",");
            userlist.forEach(item => {
              valueArr.push(this.user.users.filter(x => x.code === item)[0].fullName);
            });
          }
          controls.adid.setValue(res.data.username.toLowerCase());
          controls.name.setValue(res.data.fullName);
          controls.users.setValue(valueArr.join(","));
          controls.startDate.setValue(res.data.startDate);
          controls.expiredDate.setValue(res.data.expiredDate);
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
      id: this.detailManager.idUser,
      status: this.form.controls.status.value,
      countryId: this.form.controls.country.value.id,
      fullName: this.form.controls.name.value,
      groups: this.form.controls.groups.value,
      users: users,
      addressInfo: {
        address: "No-Address",
        phoneNo: "No-Phone",
        email: this.form.controls.email.value
      },
      expiredDate: this.form.controls.expiredDate.value
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
    this.common.getListAssignByType().subscribe(
      (data) => {
        if (data) {
          this.submittedEvent.emit({ success: true, msg: msg, listAssignByType: data });
        } else {
          this.submittedEvent.emit({ success: false, msg: this.translate.get("dialog.somethingWrong")["value"] });
        }
      }
    );
  }

  public ngDoCheck(): void {
    this.adid = this.form.controls.adid.value;
    this.name = this.form.controls.name.value;
    this.email = this.form.controls.email.value;
    this.groups = this.form.controls.groups.value;
  }
}
