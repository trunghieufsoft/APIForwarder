import { BaseComponent } from "src/app/base/base.component";
import { Component } from "@angular/core";
import { UserService } from "src/app/api-service/service/user.service";
import { first } from "rxjs/operators";
import { User } from "src/app/api-service/model/user";
import { ALL } from "src/app/app.constant";
import { CommonService } from 'src/app/api-service/service/common.service';

@Component({
  selector: "app-view-profile",
  templateUrl: "./view-profile.component.html"
})
export class ViewProfileComponent extends BaseComponent {
  public fullName: string;
  public userName: string;
  public adid: string;
  public country: string;
  public groups: string;
  public users: string;
  public array: string[] = [];
  private urlBack: string;

  constructor(private userService: UserService, private commonService: CommonService) {
    super();
    this.currentUser = this.userService.getCurrentUser();
    this.urlBack = this.navigator.getParameter("urlBack");
  }

  /**
   * Get form controls
   */
  public get f(): any {
    return this.form.controls;
  }

  public ngOnInit(): void {
    this.onInit();
  }

  public initForm(): void {
    this.createFormBuilder();
  }

  public initMaster(): void {
    this.getProfile();
  }

  public getProfile(): any {
    this.startBlockUI();
    this.userService
      .getProfile()
      .pipe(first())
      .subscribe(result => {
        this.stopBlockUI();
        this.mapDataUser(result);
      });
  }

  public onClickBack(): any {
    if (this.urlBack) {
      this.navigator.navigate(this.urlBack);
    }
  }

  public onEnter(event: any): void {
    if (event.keyCode === 13) {
      this.onClickBack();
    }
  }

  private createFormBuilder(): any {
    this.form = this.formBuilder.group({});
  }

  private mapDataUser(input: User): void {
    this.fullName = input.data.fullName;
    this.userName = input.data.username;
    this.adid = input.data.username;
    if (!!this.isSuper) {
      this.country = ALL;
      this.groups = ALL;
      this.users = ALL;
    } else {
      this.formatUsers(input.data.users);
      setTimeout(() => {
        this.country = input.data.countryId;
        this.groups = input.data.groups || ALL;
        this.users = this.array.join(", ") || ALL;
      }, 100);
    }
  }

  private formatUsers(users: string = null): void {
    let userArr: string[] = users ? users.split(",") : [];
    var userType: string = this.isSuper ? "manager" : this.isManager ? "staff" : this.isStaff ? "employee" : "";
    var country: string = this.isSuper ? "" : this.currentUser.countryId;
    this.getUsersAllTypeAssignByCountry(userArr, this.array, userType, country);
  }

  private getUsersAllTypeAssignByCountry(userArr: string[], array: string[], userType: string, country: string): void {
    this.commonService.getUsersAllTypeAssignByCountry({ userType: userType , country: country })
    .subscribe(data => {
      userArr.forEach(elm => {
        var obj = data.data.filter(item => item.code === elm);
        if (obj && obj[0]) {
          array.push(obj[0].fullName);
        }
      });
    })
  }
}
