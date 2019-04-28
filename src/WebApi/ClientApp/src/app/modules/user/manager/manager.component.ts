import {
  Component,
  Input,
  EventEmitter,
  Output,
  ChangeDetectorRef
} from "@angular/core";
import { ListBaseComponent, SortEvent } from "src/app/base/list-base.component";
import { API } from "src/app/api-service/api";
import { FormGroup } from "@angular/forms";
import { CONSTANT } from "src/app/shared/common/constant";
import { CommonService } from "src/app/api-service/service/common.service";
import { UserService } from "src/app/api-service/service/user-management.service";
import { DetailManagerAdminComponent } from "../detail-user/detail-manager-admin/detail-manager-admin.component";
import { MessageService } from "primeng/api";
import { ALL, SPACE, USERS_CONF_MANAGER } from "src/app/app.constant";
@Component({
  selector: "app-manager",
  templateUrl: "./manager.component.html",
  providers: [UserService, CommonService]
})
export class ManagerComponent extends ListBaseComponent {
  @Output() public setStatus: EventEmitter<boolean> = new EventEmitter();
  @Output() public setGroup: EventEmitter<boolean> = new EventEmitter();
  public form: FormGroup;
  public formReset: any;
  public mainStatus: number;
  public pageIndex: number;
  public url: string = API.user.listManager;
  public countryArr: any[];
  public groupsArr: any[];
  public usersArr: any[];
  public groupsStr: string;
  public action: string = "action";
  public arrData: any = CONSTANT.arrData;
  public columnsManager: any = [
    { name: "ADID", prop: "username", sort: true },
    { name: "table.name", prop: "fullName", sort: true },
    { name: "table.code", prop: "code", sort: true },
    { name: "table.country", prop: "countryId", sort: true },
    { name: "table.groups", prop: "groups", sort: true },
    { name: "table.email", prop: "email", sort: true },
    { name: "table.action", prop: this.action, sort: false, html: true }
  ]; 
 
  @Input("arrData")
  set arrDataValue(value: boolean) {
    if (value) {
      this.arrData = value;
      this.countryArr = this.arrData.countries;
      this.groupsArr = this.arrData.groups;
      this.usersArr = this.arrData.users;
    }
  }

  @Input("setGroups")
  set setGroupsValue(value: boolean) {
    if (value) {
      this.form.controls.groups.setValue(this.groupsStr);
      this.setGroup.emit();
    }
  }

  @Input("varManager")
  set varManager(value: boolean) {
    if (value) {
      setTimeout(() => {
        this.pageIndex = 1;
        this.onSearch();
      }, 100);
    }
  }

  constructor(
    private userService: UserService,
    private messageService: MessageService,
    private common: CommonService,
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
   * Event Change Country Value
   *
   * @param {*} e
   * @memberof EmployeeComponent
   */
  public countryChange(e: any): void {
    if (e != null && !(e instanceof Event)) {
      this.groupsArr = this.arrData.groups;
      let groupStr: string = this.form.controls.groups.value;
      let isChange: boolean = groupStr === null || groupStr === undefined || groupStr === SPACE;
      this.form.controls.groups.setValue(isChange ? ALL : groupStr);
    }
    this.changeDetector.detectChanges();
  }

  /**
   * Event Change Groups Value
   *
   * @param {*} e
   * @memberof ManagerComponent
   */
  public groupsChange(e: any): void {
    this.changeDetector.detectChanges();
  }

  /**
   * Search table
   */
  public onSearch(): void {
    let groupStr: string = this.form.controls.groups.value;
    if (groupStr === null || groupStr === undefined || groupStr === SPACE) {
      this.form.controls.groups.setValue(ALL);
    }
    const param = {
      keySearch: {
        username: this.checkDataSearch(this.form.controls.adid.value),
        fullName: this.checkDataSearch(this.form.controls.name.value),
        code: this.checkDataSearch(this.form.controls.code.value),
        countryId: this.checkDataSearch(this.form.controls.country.value),
        groups: this.checkDataSearch(this.form.controls.groups.value),
        email: this.checkDataSearch(this.form.controls.email.value)
      }
    };
    this.groupsStr = this.form.controls.groups.value === "" ? ALL : this.form.controls.groups.value;
    this.startBlockUI();
    this.retrieveData(param, this.pageIndex).subscribe(() => {

      this.stopBlockUI();
    });
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
    this.pageIndex = event ? event : 0;
    this.pageChange(event).subscribe(res => {
      if (!res.success) {
        this.alertService.error(res.errorMessage);
      }
    });
  }

  public onLimitChange(event: any): void {
    this.limitChange(event).subscribe();
  }

  /**
   * Column @action
   * Edit and delete Vendor
   */
  public onCellClick(val: any): void {
    if (val.col.prop === this.action) {
      if (val.target.id === "edit") {
        this.dialogService.open(
          DetailManagerAdminComponent,
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
        var userAssign = this.translate.get("label.managerAdmin")["value"];
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
        var userDelete = this.translate.get("label.managerAdmin")["value"];
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

  public convertData(data: any): void {
    this.form.controls.groups.setValue(this.form.controls.groups.value);
    this.rows = data.dataResult;
    if (this.rows) {
      for (let i = 0; i < this.rows.length; i++) {
        if (this.arrData.userByType) {
          this.rows[i][this.action] = this.arrData.userByType[0].users[i].totalUser >= USERS_CONF_MANAGER
            ? `<div class="d-flex justify-content-center">${"&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;"} ${CONSTANT.target.edit} ${CONSTANT.target.delete} `
            : `<div class="d-flex justify-content-center">${CONSTANT.target.assign} ${CONSTANT.target.edit} ${CONSTANT.target.delete} `;
        } else {
          this.rows[i][this.action] = `<div class="d-flex justify-content-center">${CONSTANT.target.edit} ${CONSTANT.target.delete} `;
        }
      }
    }
  }

  /**
   * Set Form
   *
   * @memberof ManagerComponent
   */

  private setForm(): void {
    this.form = this.formBuilder.group({
      adid: [SPACE],
      name: [SPACE],
      code: [SPACE],
      country: [ALL],
      groups: [ALL],
      email: [SPACE]
    });
    this.formReset = this.form.value;
  }

  private delete(id: number): void {
    var msg = this.translate.get("dialog.success")["value"];
    this.userService.deleteUser({ id: id }).subscribe(() => {
      this.stopBlockUI();
      this.messageService.add({ severity: "success", detail: msg });
      this.setStatus.emit(true);
      this.onSearch();
    });
  }

  private assign(user: string): void {
    var msg = this.translate.get("dialog.success")["value"];
    this.userService.assignUser(user).subscribe(() => {
      this.startBlockUI();
      this.messageService.add({ severity: "success", detail: msg });
      this.setStatus.emit(true);
      this.onSearch();
    });
  }
}
