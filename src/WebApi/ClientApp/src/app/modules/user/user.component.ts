import { MessageService } from "primeng/api";
import { Component, ChangeDetectorRef } from "@angular/core";
import { ListBaseComponent } from "src/app/base/list-base.component";
import { UserService } from "src/app/api-service/service/user-management.service";
import { AuthenticationService } from "src/app/api-service/service/authentication.service";
import { CommonService } from "src/app/api-service/service/common.service";
import { DetailManagerAdminComponent } from "./detail-user/detail-manager-admin/detail-manager-admin.component";
import { DetailEmployeeComponent } from "./detail-user/detail-employee/detail-employee.component";
import { DetailStaffComponent } from "./detail-user/detail-staff/detail-staff.component";
import { CONSTANT } from "src/app/shared/common/constant";

@Component({
  selector: "app-user",
  templateUrl: "./user.component.html",
  providers: [UserService, CommonService]
})
export class UserComponent extends ListBaseComponent {
  public varManager: number = 1;
  public varStaff: number = 1;
  public varEmployee: number = 1;
  public manager: number;a
  public staff: number;
  public employee: number;
  public isCreateManager: boolean;
  public isCreateStaff: boolean;
  public isCreateEmployee: boolean;
  public arrData: any = CONSTANT.arrData;

  public managerTab: boolean = false;
  public staffTab: boolean = false;
  public employeeTab: boolean = false;
  constructor(
    private userService: UserService,
    private messageService: MessageService,
    private serviceKeepAlive: AuthenticationService,
    private common: CommonService,
    private changeDetector: ChangeDetectorRef
  ) {
    super();
    this.currentUser = this.userService.getCurrentUser();
  }

  /**
   * onInit func
   */
  public onInit(): void {
    this.getAllArray();
  }

  /**
   * get All user
   */
  public getAllUser(): void {
    this.startBlockUI();
    this.userService.getAllUsers().subscribe(res => {
      this.stopBlockUI();
      if (res.data) {
        this.manager = res.data.manager;
        this.staff = res.data.staff;
        this.employee = res.data.employee;
      }
    });
  }

  public createManager(): void {
    this.startBlockUI();
    this.serviceKeepAlive.keepAlive().subscribe(res => {
      this.stopBlockUI();
      if (!res.success) {
        return;
      } else {
        this.dialogService.open(
          DetailManagerAdminComponent,
          data => {
            this.varManager++;
            this.getAllUser();
            if (data.success) {
              this.messageService.add({
                severity: "success",
                detail: data.msg
              });
              this.arrData.userByType = data.listAssignByType.data;
              this.arrData.users[0].users = data.listAssignByType.data[0].users;
              this.arrData.users[0].totalUser = data.listAssignByType.data[0].totalUser;
            } else {
              this.alertService.error(data.msg);
            }
          },
          undefined,
          { arrData: this.arrData }
        );
      }
    });
  }

  public createStaff(): void {
    this.startBlockUI();
    this.serviceKeepAlive.keepAlive().subscribe(res => {
      this.stopBlockUI();
      if (!res.success) {
        return;
      } else {
        this.dialogService.open(
          DetailStaffComponent,
          data => {
            this.varStaff++;
            this.getAllUser();
            if (data.success) {
              this.messageService.add({
                severity: "success",
                detail: data.msg
              });
              this.arrData.userByType = data.listAssignByType.data;
              this.arrData.users[0].users = data.listAssignByType.data[0].users;
              this.arrData.users[0].totalUser = data.listAssignByType.data[0].totalUser;
            } else {
              this.alertService.error(data.msg);
            }
          },
          undefined,
          { arrData: this.arrData }
        );
      }
    });
  }
  public createEmployee(): void {
    this.startBlockUI();
    this.serviceKeepAlive.keepAlive().subscribe(res => {
      this.stopBlockUI();
      if (!res.success) {
        return;
      } else {
        this.dialogService.open(
          DetailEmployeeComponent,
          data => {
            this.stopBlockUI();
            this.varEmployee++;
            this.getAllUser();
            if (data) {
              this.messageService.add({
                severity: "success",
                detail: data.msg
              });
            }
          },
          undefined,
          { arrData: this.arrData }
        );
      }
    });
  }

  public onClickManager(): void {
    this.hide();
    this.managerTab = true;
  }

  public onClickStaff(): void {
    this.hide();
    this.staffTab = true;
  }

  public onClickEmployee(): void {
    this.hide();
    this.employeeTab = true;
  }

  private setHiddenAuthen(): void {
    if (this.isStaff) {
      this.isCreateManager = false;
      this.isCreateStaff = false;
      this.isCreateEmployee = true;
      this.onClickEmployee();
    }
    if (this.isManager) {
      this.isCreateManager = false;
      this.isCreateStaff = true;
      this.isCreateEmployee = true;
      this.onClickStaff();
    }
    if (this.isSuper) {
      this.isCreateManager = true;
      this.isCreateEmployee = true;
      this.isCreateStaff = true;
      this.onClickManager();
    }
  }

  /**
   * get All Array
   */
  private getAllArray(): void {
    this.startBlockUI();
    this.common.getDetailCountry().subscribe(res => {
      this.getAllUser();
      this.stopBlockUI();
      if (res.success && res.data) {
        this.arrData = res.data;
        this.setHiddenAuthen();
        this.changeDetector.detectChanges();
      }
    });
  }

  private hide(): void {
    this.managerTab = false;
    this.staffTab = false;
    this.employeeTab = false;
  }
}