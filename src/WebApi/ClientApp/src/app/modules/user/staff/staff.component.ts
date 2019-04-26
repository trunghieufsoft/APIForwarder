import {
  Component,
  Input,
  EventEmitter,
  Output,
  ChangeDetectorRef
} from "@angular/core";
import { ListBaseComponent, SortEvent } from "src/app/base/list-base.component";
import { API } from "src/app/api-service/api";
import { FormGroup, Validators } from "@angular/forms";
import { CONSTANT } from "src/app/shared/common/constant";
import { UserService } from "src/app/api-service/service/user-management.service";
// import { DetailStaffComponent } from "../detail-staff/detail-staff.component";
import { MessageService } from "primeng/api";
import { ALL, SPACE } from "src/app/app.constant";
import { CommonService } from "src/app/api-service/service/common.service";
import { group } from '@angular/animations';
@Component({
  selector: "app-staff",
  templateUrl: "./staff.component.html",
  providers: [UserService]
})
export class StaffComponent extends ListBaseComponent {
  @Output() public setStatus: EventEmitter<boolean> = new EventEmitter();
  public mainStatus: number;
  public url: string = API.user.listStaff;
  public countryArr: any;
  public groupArr: any;
  public userArr: any;
  public form: FormGroup;
  public formReset: any;
  public pageIndex: number;
  public status: string = "status";
  public action: string = "action";
  public arrData: any = CONSTANT.arrData;
  public columnsStaff: any = [
    { name: "table.country", prop: "countryId", sort: true },
    { name: "table.code", prop: "code", sort: true },
    { name: "table.name", prop: "fullName", sort: true },
    { name: "table.username", prop: "username", sort: true },
    { name: "table.group", prop: "groups", sort: true },
    { name: "table.phoneNo.", prop: "phoneNo", sort: true },
    { name: "table.email", prop: "email", sort: true },
    {
      name: "table.status",
      prop: "statusStr",
      sort: true,
      html: true,
      titleProp: "noteText"
    },
    { name: "table.action", prop: this.action, sort: false, html: true }
  ];
  @Input("varStaff")
  set varStaff(value: boolean) {
    if (value) {
      setTimeout(() => {
        this.onSearch(true);
        this.pageIndex = 1;
      }, 100);
    }
  }

  @Input("arrData")
  set arrDataValue(value: boolean) {
    if (value) {
      this.arrData = value;
      this.countryArr = this.arrData.countries;
      this.groupArr = this.arrData.groups;
      this.userArr = this.arrData.users;
    }
  }

  constructor(
    private common: CommonService,
    private userService: UserService,
    private messageService: MessageService,
    private changeDetector: ChangeDetectorRef
  ) {
    super();
    this.currentUser = this.userService.getCurrentUser();
  }

  /**
   * onInit func
   */
  public ngOnInit(): void {
    this.onInit();
    this.setForm();
    this.getAllArray();
  }

  public onReset(): void {
    this.formReset.country = this.isSuper ? ALL : this.arrData.countries[0];
    this.form.reset();
    this.form.setValue(this.formReset);
  }

  /**
   * get All user
   */
  public onSearch(isInit: boolean = false): void {
    var country = this.form.controls.country.value;
    country = country !== null && country !== undefined ? country.id || country : ALL;
    var group = this.form.controls.group.value;
    group = group !== null && group !== undefined ? group.id || group : ALL;
    const param = {
      keySearch: {
        phoneNo: this.form.controls.phoneNo.value,
        username: this.form.controls.userName.value,
        email: this.form.controls.email.value,
        fullName: this.form.controls.name.value,
        countryId: country === ALL ? SPACE : country,
        code: this.form.controls.code.value,
        groups: group === ALL ? SPACE : group
      }
    };
    this.startBlockUI();
    this.retrieveData(param, isInit ? 1 : this.pageIndex).subscribe(() => {
      this.stopBlockUI();
    });
  }

  /**
   * Event Change Country Value
   *
   * @param {*} e
   * @memberof StaffComponent
   */
  public countryChange(e: any): void {
    if (e != null && !(e instanceof Event)) {
      this.groupArr = this.arrData.groups;
      this.form.controls.group.setValue(ALL);
    }
    this.changeDetector.detectChanges();
  }

  /**
   * Event Change Group Value
   *
   * @param {*} e
   * @memberof StaffComponent
   */
  public groupChange(e: any): void {
    this.changeDetector.detectChanges();
  }

  /**
   * Column @action
   * Edit and delete Staff
   */
  public onCellClick(val: any): void {
    if (val.col.prop === this.action) {
      if (val.target.id === "edit") {
        // this.dialogService.open(
        //   DetailStaffComponent,
        //   data => {
        //     this.onSearch();
        //     if (data) {
        //       this.messageService.add({
        //         severity: "success",
        //         detail: data.msg
        //       });
        //     }
        //   },
        //   undefined,
        //   {
        //     idStaff: val.row.id,
        //     arrData: this.arrData
        //   }
        // );
      }
      if (val.target.id === "delete") {
        var msg = this.translate.get("dialog.confirmDelete")["value"];
        this.alertService
          .confirm("Do you want to delete Staff?")
          .subscribe(result => {
            if (result.value) {
              var id = val.row.id;
              // this.delete(id);
            }
          });
      }
    }
  }

  public onSortChange(event: SortEvent): void {
    const sort = {
      prop: event.prop,
      asc: event.asc
    };
    this.sortChange(sort).subscribe(res => {
      if (!res.success) {
        this.alertService.error(res.errorMessage);
      }
    });
  }
  public onPageChange(event: any): void {
    this.pageChange(event).subscribe(res => {
      if (!res.success) {
        this.alertService.error(res.errorMessage);
      }
    });
  }

  public onLimitChange(event: any): void {
    this.limitChange(event).subscribe(res => {});
  }

  public convertData(data: any): void {
    this.rows = data.dataResult;
    for (let i = 0; i < this.rows.length; i++) {
      this.rows[i][this.action] = `<div class="d-flex justify-content-center">${
        CONSTANT.target.edit
      } ${CONSTANT.target.delete} `;
      switch (this.rows[i]['statusStr']) {
        case "Active": {
          this.rows[i]['statusStr'] = `<span class="badge badge-pill badge-success">Active</span>`;
          break;
        }
        case "Inactive": {
          this.rows[i]['statusStr'] = `<span class="badge badge-pill badge-secondary">Inactive</span>`;
          break;
        }
      }
    }
  }
  /**
   * Set Form
   *
   * @memberof VendorComponent
   */

  private setForm(): void {
    var countryStr =
      this.currentUser.UserType === CONSTANT.userType.super
        ? ALL
        : this.currentUser.Country;
    var groupStr =
      this.currentUser.UserType !== CONSTANT.userType.staff
        ? ALL
        : this.currentUser.Group;
    this.form = this.formBuilder.group({
      userName: [SPACE],
      phoneNo: [SPACE],
      name: [SPACE],
      email: [SPACE],
      code: [SPACE],
      country: [countryStr],
      group: [groupStr]
    });
    this.formReset = this.form.value;
  }

  private getAllArray(): void {
    this.startBlockUI();
    this.common.getDetailCountry().subscribe(res => {
      this.stopBlockUI();
      if (res.success && res.data) {
        this.arrData = res.data;
        this.countryArr = this.arrData.countries;
        this.groupArr = this.arrData.groups;
        this.userArr = this.arrData.users;
        this.changeDetector.detectChanges();
      }
    });
  }

  private delete(id: number): void {
    this.startBlockUI();
    var msg = this.translate.get("dialog.success")["value"];
    this.userService.deleteUser(id).subscribe(() => {
      this.stopBlockUI();
      this.messageService.add({ severity: "success", detail: msg });
      this.setStatus.emit(true);
      this.onSearch();
    });
  }
}
