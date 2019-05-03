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
import { DetailStaffComponent } from "../detail-user/detail-staff/detail-staff.component";
import { MessageService } from "primeng/api";
import { ALL, SPACE, USERS_CONF_STAFF } from "src/app/app.constant";
import { CommonService } from "src/app/api-service/service/common.service";
@Component({
  selector: "app-staff",
  templateUrl: "./staff.component.html",
  providers: [UserService]
})
export class StaffComponent extends ListBaseComponent {
  @Output() public setStatus: EventEmitter<boolean> = new EventEmitter();
  public mainStatus: number;
  public url: string = API.user.listStaff;
  public countryArr: any[];
  public groupArr: any[];
  public userArr: any[];
  public userByType: any[];
  public statusArr: any[] = [
    { id: "0", name: "Active" },
    { id: "1", name: "Inactive" },
  ];
  public form: FormGroup;
  public formReset: any;
  public pageIndex: number;
  public status: string = "status";
  public action: string = "action";
  public arrData: any = CONSTANT.arrData;
  public columnsStaff: any = [
    { name: "table.country", prop: "countryId", sort: true },
    { name: "table.group", prop: "groups", sort: true },
    { name: "table.code", prop: "code", sort: true },
    { name: "table.name", prop: "fullName", sort: true },
    { name: "table.phoneNo", prop: "phoneNo", sort: true },
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
 
  @Input("arrData")
  set arrDataValue(value: boolean) {
    if (value) {
      this.arrData = value;
      this.countryArr = this.arrData.countries;
      this.groupArr = this.arrData.groups;
      this.userArr = this.arrData.users;
    }
  }

  @Input("varStaff")
  set varStaff(value: boolean) {
    if (value) {
      setTimeout(() => {
        this.pageIndex = 1;
        this.onSearch();
      }, 100);
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
  }

  public onReset(): void {
    this.form.reset();
    this.form.setValue(this.formReset);
  }

  /**
   * get All user
   */
  public onSearch(isInit: boolean = false): void {
    let groupStr: string = this.form.controls.group.value;
    if (groupStr === null || groupStr === undefined || groupStr === SPACE) {
      this.form.controls.group.setValue(ALL);
    }
    const param = {
      keySearch: {
        phoneNo: this.checkDataSearch(this.form.controls.phoneNo.value),
        username: this.checkDataSearch(this.form.controls.userName.value),
        email: this.checkDataSearch(this.form.controls.email.value),
        fullName: this.checkDataSearch(this.form.controls.name.value),
        countryId: this.checkDataSearch(this.form.controls.country.value),
        code: this.checkDataSearch(this.form.controls.code.value),
        groups: this.checkDataSearch(this.form.controls.group.value),
        status: this.checkDataSearch(this.form.controls.status.value)
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
      let groupStr: string = this.form.controls.group.value;
      let isChange: boolean = groupStr === null || groupStr === undefined || groupStr === SPACE;
      this.form.controls.group.setValue(isChange ? ALL : groupStr);
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
        this.dialogService.open(
          DetailStaffComponent,
          data => {
            this.onSearch();
            if (data) {
              this.messageService.add({
                severity: "success",
                detail: data.msg
              });
            }
          },
          undefined,
          {
            idUser: val.row.id,
            username: val.row.username,
            arrData: this.arrData
          }
        );
      }
      if (val.target.id === "assign") {
        var msg = this.translate.get("dialog.confirmAssign")["value"];
        var userAssign = this.translate.get("label.employee")["value"];
        var title = this.translate.get("label.confirm")["value"];
        var confirmText = this.translate.get("button.yes")["value"];
        var cancelText = this.translate.get("button.no")["value"];
        this.alertService
          .confirm(msg.replace("{value}", userAssign.replace("{value}", val.row.fullName)), title,  confirmText, cancelText)
          .subscribe(result => {
            if (result.value) {
              var user = val.row.username;
              this.assign(user);
            }
          });
      }
      if (val.target.id === "delete") {
        var msg = this.translate.get("dialog.confirmDelete")["value"];
        var userDelete = this.translate.get("label.staff")["value"];
        var title = this.translate.get("label.confirm")["value"];
        var confirmText = this.translate.get("button.yes")["value"];
        var cancelText = this.translate.get("button.no")["value"];
        this.alertService
          .confirm(msg.replace("{value}", userDelete.replace("{value}", val.row.fullName)), title,  confirmText, cancelText)
          .subscribe(result => {
            if (result.value) {
              var id = val.row.id;
              this.delete(id);
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
      if (this.arrData.userByType) {
        this.rows[i][this.action] = this.arrData.userByType[1].users[i].totalUser >= USERS_CONF_STAFF
          ? `<div class="d-flex justify-content-center">${"&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;"} ${CONSTANT.target.edit} ${CONSTANT.target.delete} `
          : `<div class="d-flex justify-content-center">${CONSTANT.target.assign} ${CONSTANT.target.edit} ${CONSTANT.target.delete} `;
      } else {
        this.rows[i][this.action] = `<div class="d-flex justify-content-center">${CONSTANT.target.edit} ${CONSTANT.target.delete} `;
      }
      
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
    var countryStr = this.isSuper ? ALL : this.arrData.countries[0];
    var groupStr = !this.isStaff ? ALL : this.arrData.groups[0];
    this.form = this.formBuilder.group({
      userName: [SPACE],
      phoneNo: [SPACE],
      name: [SPACE],
      email: [SPACE],
      code: [SPACE],
      country: [countryStr],
      group: [groupStr],
      status: [ALL]
    });
    this.formReset = this.form.value;
  }

  private delete(id: number): void {
    this.startBlockUI();
    var msg = this.translate.get("dialog.deleteSuccess")["value"];
    this.userService.deleteUser(id).subscribe(() => {
      this.getListAssignByType(msg);
    });
  }

  private assign(user: string): void {
    this.startBlockUI();
    var msg = this.translate.get("dialog.changeSuccess")["value"];
    this.userService.assignUser(user).subscribe(() => {
      this.getListAssignByType(msg);
    });
  }

  private getListAssignByType(msg: string): void {
    this.common.getListAssignByType().subscribe(
      (data) => {
        this.stopBlockUI();
        if (data) {
          this.arrData.users[0].users = data.data[0].users;
          this.arrData.users[0].totalUser = data.data[0].totalUser;
          this.arrData.userByType = data.data;
          this.messageService.add({ severity: "success", detail: msg });
          this.setStatus.emit(true);
        }
        else {
          this.messageService.add({ severity: "error", detail: this.translate.get("dialog.somethingWrong")["value"] });
          this.setStatus.emit(false);
        }
        this.onSearch();
      }
    );
  }
}
