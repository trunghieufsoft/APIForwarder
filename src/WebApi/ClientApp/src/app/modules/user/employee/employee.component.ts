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
import { UserService } from "src/app/api-service/service/user-management.service";
// import { DetailEmployeeComponent } from "../detail-user/detail-employee/detail-employee.component";
import { MessageService } from "primeng/api";
import { ALL, SPACE } from "src/app/app.constant";
import { CommonService } from 'src/app/api-service/service/common.service';
@Component({
  selector: "app-employee",
  templateUrl: "./employee.component.html",
  providers: [UserService]
})
export class EmployeeComponent extends ListBaseComponent {
  @Output() public setStatus: EventEmitter<boolean> = new EventEmitter();
  public mainStatus: number;
  public url: string = API.user.listEmployee;
  public countryArr: any[];
  public groupArr: any[];
  public userArr: any[];
  public statusArr: any[] = [
    { id: "2", name: "Available" },
    { id: "3", name: "Unavailable" },
    { id: "4", name: "End of Day" },
  ];
  public form: FormGroup;
  public formReset: any;
  public pageIndex: number;
  public action: string = "action";
  public arrData: any = CONSTANT.arrData;
  public columnsEmployee: any = [
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

  @Input("varEmployee")
  set varEmployee(value: boolean) {
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
    this.startBlockUI();
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
      this.groupArr = this.arrData.groups;
      let groupStr: string = this.form.controls.group.value;
      let isChange: boolean = groupStr === null || groupStr === undefined || groupStr === SPACE;
      this.form.controls.group.setValue(isChange ? ALL : groupStr);
    }
    this.changeDetector.detectChanges();
  }

  /**
   * Event Change Groups Value
   *
   * @param {*} e
   * @memberof EmployeeComponent
   */
  public groupChange(e: any): void {
    this.changeDetector.detectChanges();
  }

  /**
   * get All user
   */
  public onSearch(isInit: boolean = false): void {
    let groupStr: string = this.form.controls.group.value;
    if (groupStr === null || groupStr === undefined || groupStr === SPACE) {
      this.form.controls.group.setValue(ALL);
    }
    const params = {
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
    this.retrieveData(params, isInit ? 1 : this.pageIndex).subscribe(res => {
      this.stopBlockUI();
      this.changeDetector.detectChanges();
    });
  }

  /**
   * Column @action
   * Edit and delete Vendor
   */
  public onCellClick(val: any): void {
    if (val.col.prop === this.action) {
      if (val.target.id === "edit") {
        // this.getAllArray();
        // setTimeout(() => {
        //   this.dialogService.open(
        //     DetailEmployeeComponent,
        //     data => {
        //       this.onSearch();
        //       if (data) {
        //         this.messageService.add({
        //           severity: "success",
        //           detail: data.msg
        //         });
        //       }
        //     },
        //     undefined,
        //     {
        //       idUser: val.row.id,
        //       username: val.row.username,
        //       arrData: this.arrData
        //     }
        //   );
        // }, 100);
      }
      if (val.target.id === "delete") {
        var msg = this.translate.get("dialog.confirmDelete")["value"];
        var userDelete = this.translate.get("dialog.employee")["value"];
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
    this.limitChange(event).subscribe();
  }

  public convertData(data: any): void {
    this.rows = data.dataResult;
    for (let i = 0; i < this.rows.length; i++) {
      this.rows[i][this.action] = `<div class="d-flex justify-content-center">${
        CONSTANT.target.edit
      } ${CONSTANT.target.delete} `;
      
      switch (this.rows[i]['statusStr']) {
        case "Available": {
          this.rows[i]['statusStr'] = `<span class="badge badge-pill badge-success">Available</span>`;
          break;
        }
        case "Unavailable": {
          this.rows[i]['statusStr'] = `<span class="badge badge-pill badge-warning">Unavailable</span>`;
          break;
        }
        case "EndOfDay": {
          this.rows[i]['statusStr'] = `<span class="badge badge-pill badge-info">End of Day</span>`;
          break;
        }
      }
    }
  }

  private setForm(): void {
    var countryStr = this.isSuper ? ALL : this.arrData.countries[0];
    var groupStr = this.isSuper || this.isManager ? ALL : this.arrData.groups[0].id;

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
    var msg = this.translate.get("dialog.success")["value"];
    this.userService.deleteUser(id).subscribe(() => {
      this.stopBlockUI();
      this.messageService.add({ severity: "success", detail: msg });
      this.setStatus.emit(true);
      this.onSearch();
    });
  }
}
