import { BaseComponent } from "src/app/base/base.component";
import { Component, ViewChild, ElementRef } from "@angular/core";
import { Validators, FormGroup } from "@angular/forms";
import { UserService } from "src/app/api-service/service/user.service";
import { MessageService } from "primeng/api";
import { formatPasswordValidator } from "src/app/shared/directives/format-password-validator";
import { customConfirmValidator } from "src/app/shared/directives/custom-confirm-validator";
import { customEqualsValidator } from "src/app/shared/directives/custom-equals-validator";


@Component({
  selector: 'app-changepassword',
  templateUrl: './change-password.component.html',
})
export class ChangePasswordComponent extends BaseComponent {
  public formClear: FormGroup;
  public isDisable: boolean = false;

  private currentPassword: string = "";
  private newPassword: string = "";
  private confirmPassword: string = "";
  private urlBack: string;

  constructor(
    private userService: UserService,
    private messageService: MessageService
  ) {
    super();
    if (!this.authService.isAuthenticated()) {
      this.navigator.navigateLoginPage();
    }
    this.urlBack = this.navigator.getParameter("urlBack");
  }

  public isDisableBack(): boolean {
    return !!(this.authService.getCurrentUser().ExpiredPassword <= 0);
  }

  /**
   * Get form controls
   */
  get f(): any {
    return this.form.controls;
  }

  public ngOnInit(): void {
    this.onInit();
  }

  /**
   * Create formbuilder of control
   */
  public initForm(): void {
    this.form = this.formBuilder.group(
      {
        formCurrentPassword: [this.currentPassword, [Validators.required]],
        formNewPassword: [
          this.newPassword,
          [Validators.required, formatPasswordValidator]
        ],
        formConfirmPassword: [
          this.confirmPassword,
          [Validators.required]
        ]
      },
      {
        validator: [
          customEqualsValidator("formCurrentPassword", "formNewPassword"),
          customConfirmValidator("formNewPassword", "formConfirmPassword")
        ]
      }
    );
    this.formClear = this.form.value;
  }

  /**
   * Handle when user click button back
   */
  public onClickBack(): void {
    if (this.urlBack) {
      this.navigator.navigate(this.urlBack);
    }
  }

  /**
   * Handle update password
   */
  public onChangePassword(): void {
    const isValid = this.isValidForm(this.form);
    this.markFormDirty();

    if (!isValid) {
      return;
    } else {
      this.changePassword();
    }
  }

  /**
   * Excute call api change password
   */
  private changePassword(): void {
    const username: string = this.authService.getCurrentUser().Username;
    const inputPassword = {
      currentPassword: this.f.formCurrentPassword.value,
      newPassword: this.f.formNewPassword.value,
      currentUser: username
    };
    this.startBlockUI();
    this.userService.changePassword(inputPassword).subscribe(res => {
      this.stopBlockUI();
      if (res.success && res.data) {
        let message = this.translate.get(
          "common.messages.changePassword_success"
        )["value"];
        this.alertService.success(message).subscribe(action => {
          if (action) {
            localStorage.clear();
            this.navigator.navigateLoginPage();
          }
        });
      } else {
        return;
      }
    });
  }
}
