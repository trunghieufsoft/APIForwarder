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
  public form: FormGroup;
  public formReset: any;
  public mainStatus: number;
  public pageIndex: number;
  public url: string = API.user.listManager;
  public countryArr: any[];
  public groupsArr: any[];
  public usersArr: any[];
  public userByType: any[];
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
  @Input("varManager")
  set varManager(value: boolean) {
    if (value) {
      setTimeout(() => {
        this.pageIndex = 1;
        this.onSearch();
      }, 200);
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
    this.getAllArray();
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
      this.form.controls.groups.setValue(ALL);
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
    var country = this.form.controls.country.value;
    country = typeof country === "object" && country != null ? country.id : country;
    var groups = this.form.controls.groups.value;
    groups = groups !== null && groups !== undefined ? typeof country === "object" ? groups.id : groups : ALL;
    const param = {
      keySearch: {
        username: this.form.controls.adid.value,
        fullName: this.form.controls.name.value,
        code: this.form.controls.code.value,
        countryId: country === ALL ? SPACE : country,
        groups: groups === ALL ? SPACE : groups,
        email: this.form.controls.email.value
      }
    };
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
        this.getAllArray();
        setTimeout(() => {
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
        }, 100);
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
    this.rows = data.dataResult;
    if (this.rows) {
      for (let i = 0; i < this.rows.length; i++) {
        if (this.userByType) {
          this.rows[i][this.action] = this.userByType[0].users[i].totalUser >= USERS_CONF_MANAGER
            ? `<div class="d-flex justify-content-center">${"&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;"} ${CONSTANT.target.edit} ${CONSTANT.target.delete} `
            : `<div class="d-flex justify-content-center">${CONSTANT.target.assign} ${CONSTANT.target.edit} ${CONSTANT.target.delete} `;
        } else {
          this.rows[i][this.action] = `<div class="d-flex justify-content-center">${CONSTANT.target.edit} ${CONSTANT.target.delete} `;
        }
      }
    }
  }

  private getAllArray(): void {
    this.common.getDetailCountry().subscribe(res => {
      this.stopBlockUI();
      if (res.success && res.data) {
        this.arrData = res.data;
        this.countryArr = res.data.countries;
        this.groupsArr = res.data.groups;
        this.usersArr = res.data.users;
        this.userByType = res.data.userByType;
        this.changeDetector.detectChanges();
      }
    });
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
