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
// import { DetailManagerComponent } from "../detail-ups-admin/detail-manager.component";
import { MessageService } from "primeng/api";
import { ALL, SPACE } from "src/app/app.constant";
@Component({
  selector: "app-manager",
  templateUrl: "./manager.component.html",
  providers: [UserService]
})
export class ManagerComponent extends ListBaseComponent {
  @Output() public setStatus: EventEmitter<boolean> = new EventEmitter();
  public form: FormGroup;
  public formReset: any;
  public mainStatus: number;
  public pageIndex: number;
  public url: string = API.user.listManager;
  public countryArr: any;
  public groupsArr: any;
  public usersArr: any;
  public action: string = "action";
  public arrData: any = CONSTANT.arrData;
  public columnsManager: any = [
    { name: "ADID", prop: "username", sort: true },
    { name: "table.name", prop: "fullName", sort: true },
    { name: "table.country", prop: "countryId", sort: true },
    { name: "table.groups", prop: "groups", sort: true },
    { name: "table.email", prop: "email", sort: true },
    { name: "table.action", prop: this.action, sort: false, html: true }
  ];
  @Input("varManager")
  set varManager(value: boolean) {
    if (value) {
      setTimeout(() => {
        this.onSearch(true);
        this.pageIndex = 1;
      }, 20);
    }
  }

  @Input("arrData")
  set arrDataValue(value: boolean) {
    if (value) {
      this.arrData = value;
      this.countryArr = this.arrData.countries;
      this.groupsArr = this.arrData.groups;
      this.usersArr = this.arrData.users;
    }
  }

  constructor(
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
    this.startBlockUI();
    this.setForm();
  }

  public onReset(): void {
    this.form.reset();
    this.form.setValue(this.formReset);
  }

  /**
   * Search table
   */
  public onSearch(isInit: boolean = false): void {
    var country = this.form.controls.country.value;
    country = typeof country === "object" ? country.id : country;
    var groups = this.form.controls.groups.value;
    const param = {
      keySearch: {
        username: this.form.controls.adid.value,
        email: this.form.controls.email.value,
        fullName: this.form.controls.name.value,
        countryId: country === ALL ? SPACE : country,
        groups: !groups || groups === ALL || groups.name === ALL ? SPACE : groups.id || groups
      }
    };
    this.startBlockUI();
    this.retrieveData(param, isInit ? 1 : this.pageIndex).subscribe(() => {
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
        // this.dialogService.open(
        //   DetailManagerComponent,
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
        //     idUser: val.row.id,
        //     arrData: this.arrData
        //   }
        // );
      }
      if (val.target.id === "delete") {
        var msg = this.translate.get("dialog.confirmDelete")["value"];
        this.alertService
          .confirm("Do you want to delete Manager Admin?")
          .subscribe(result => {
            if (result.value) {
              var id = val.row.id;
              // this.delete(id);
            }
          });
      }
    }
  }

  public convertData(data: any): void {
    this.rows = data.dataResult;
    for (let i = 0; i < this.rows.length; i++) {
      this.rows[i][this.action] = `<div class="d-flex justify-content-center">${
        CONSTANT.target.edit
      } ${CONSTANT.target.delete} `;
    }
  }

  /**
   * Event Change Country Value
   *
   * @param {*} e
   * @memberof UpsAdminComponent
   */

  public countryChange(e: any): void {
    // if (e != null && !(e instanceof Event)) {
    //   var isAll = e === ALL || e.id === ALL;
    //   this.groupsArr = isAll ? this.arrData.groups : e.groups;
    //   this.form.controls.groups.setValue(ALL);
    // }
    this.changeDetector.detectChanges();
  }

  public groupsChange(e: any): void {
    this.changeDetector.detectChanges();
  }

  /**
   * Set Form
   *
   * @memberof ManagerComponent
   */

  private setForm(): void {
    this.form = this.formBuilder.group({
      adid: [""],
      name: [""],
      email: [""],
      country: ["All"],
      groups: ["All"]
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
