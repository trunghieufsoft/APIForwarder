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
  public form: FormGroup;
  public formReset: any;
  public status: string = "status";
  public action: string = "action";
  public arrData: any = CONSTANT.arrData;
  public columnsOgpAdmin: any = [
    { name: "table.country", prop: "countryId", sort: true },
    { name: "table.group", prop: "groupName", sort: true },
    { name: "table.userID", prop: "id", sort: true },
    { name: "table.name", prop: "fullName", sort: true },
    { name: "table.username", prop: "username", sort: true },
    { name: "table.phoneNo.", prop: "phone", sort: true },
    { name: "table.email", prop: "email", sort: true },
    {
      name: "table.status",
      prop: "status",
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
        this.onSearch();
      }, 100);
    }
  }

  @Input("arrData")
  set arrDataValue(value: boolean) {
    if (value) {
      this.arrData = value;
      this.countryArr = this.arrData.countries;
      this.groupArr = this.arrData.groups;
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
    this.setForm();
  }

  public onReset(): void {
    var country = this.arrData.countries[0];
    if (this.isSuper) {
      this.formReset.country = ALL;
    } else {
      this.formReset.country = country;
    }
    this.form.reset();
    this.form.setValue(this.formReset);
  }

  /**
   * get All user
   */
  public onSearch(): void {
    var country = this.form.controls.country.value;
    country = typeof country === "object" ? country.id : country;
    var groupName = this.form.controls.group.value;
    const param = {
      keySearch: {
        phone: this.form.controls.phoneNo.value,
        username: this.form.controls.userName.value,
        email: this.form.controls.email.value,
        fullName: this.form.controls.name.value,
        countryId: country === ALL ? SPACE : country,
        groupName:
          !groupName || groupName === ALL || groupName.name === ALL
            ? SPACE
            : groupName.name || groupName
      }
    };
    this.startBlockUI();
    this.retrieveData(param).subscribe(() => {
      this.stopBlockUI();
    });
  }

  /**
   * Event Change Country Value
   *
   * @param {*} e
   * @memberof DriverComponent
   */
  public countryChange(e: any): void {
    if (e != null && !(e instanceof Event)) {
      var isAll = e === ALL || e.id === ALL;
      this.groupArr = isAll ? this.arrData.groups : e.group;
      this.form.controls.vendor.setValue(ALL);
    }
    this.changeDetector.detectChanges();
  }

  /**
   * Event Change Vendor Value
   *
   * @param {*} e
   * @memberof OgpAdminComponent
   */
  public groupChange(e: any): void {
    if (e != null && !(e instanceof Event)) {
      // const isAll = e === ALL || e.id === ALL;
      // var country = this.form.controls.country.value;
      // var tempSlic = this.arrData.slics;
      // if (country && country !== ALL) {
      //   tempSlic = country.slic;
      // }
      // this.slicArr = isAll ? tempSlic : this.formatSLICArr(tempSlic, e.slic);
      // this.form.controls.slic.setValue(ALL);
    }
    this.changeDetector.detectChanges();
  }

  /**
   * Column @action
   * Edit and delete OGP Admin
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
        //     idOgp: val.row.id,
        //     arrData: this.arrData
        //   }
        // );
      }
      if (val.target.id === "delete") {
        var msg = this.translate.get("dialog.confirmDelete")["value"];
        this.alertService
          .confirm("Do you want to delete OGP Admin?")
          .subscribe(result => {
            if (result.value) {
              this.delete(val.row.id);
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
      switch (this.rows[i][this.status]) {
        case "Active": {
          this.rows[i][
            this.status
          ] = `<span class="badge badge-pill badge-success">Active</span>`;
          break;
        }
        case "Inactive": {
          this.rows[i][
            this.status
          ] = `<span class="badge badge-pill badge-secondary">Inactive</span>`;
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
        ? "All"
        : this.currentUser.Country;
    var groupStr =
      this.currentUser.UserType !== CONSTANT.userType.staff
        ? "All"
        : this.currentUser.group;
    this.form = this.formBuilder.group({
      userName: [""],
      phoneNo: [""],
      name: [""],
      email: [""],
      country: [countryStr],
      group: [groupStr]
    });
    this.formReset = this.form.value;
  }

  private getAllArray(): void {
    this.startBlockUI();
    // this.common.getDetailCountry().subscribe(res => {
    //   this.stopBlockUI();
    //   if (res.success && res.data) {
    //     this.arrData = res.data;
    //     this.countryArr = this.arrData.countries;
    //     this.vendorArr = this.arrData.vendors;
    //     this.slicArr = this.arrData.slics;
    //     this.changeDetector.detectChanges();
    //   }
    // });
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
