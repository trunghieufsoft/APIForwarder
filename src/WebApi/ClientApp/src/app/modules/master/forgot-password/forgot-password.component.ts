import {
  Component,
  ViewChild,
  ElementRef,
  ChangeDetectionStrategy
} from "@angular/core";
import { BaseComponent } from "src/app/base/base.component";
import { Validators, FormGroup } from "@angular/forms";
import { customEmailValidator } from "src/app/shared/directives/custom-email-validator";
import { IForgotPassword } from "src/app/api-service/model/login";
import { ALL, SPACE } from "src/app/app.constant";

@Component({
  selector: "app-forgot-password",
  templateUrl: "./forgot-password.component.html",
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ForgotPassWordComponent extends BaseComponent {
  public form: FormGroup;
  public counter: number = 0;
  protected formClear: FormGroup;

  constructor() {
    super();
    if (this.authService.isAuthenticated()) {
      this.navigator.navigate("/");
    }
  }

  public ngOnInit(): void {
    localStorage.clear();
    this.onInit();
  }

  public ngOnDestroy(): void {
    this.counter = 0;
  }

  /**
   * Create formbuilder of control
   */
  public initForm(): any {
    this.form = this.formBuilder.group({
      username: ["", [Validators.required]],
      email: ["", [Validators.required, customEmailValidator]]
    });
    this.formClear = this.form.value;
  }

  get f(): any {
    return this.form.controls;
  }

  /**
   * Handle when click button back
   */
  public onClickBack(): void {
    this.navigator.navigateLoginPage();
  }

  /**
   * Handle when click button reset
   */
  public onClickReset(): any {
    const isValid = this.isValidForm(this.form);
    this.markFormDirty();
    if (!isValid) {
      return;
    }
    this.clickReset();
  }

  /**
   * Excute call api reset password
   */
  private clickReset(): void {
    const params: IForgotPassword = {
      username: SPACE,
      email: SPACE
    };
    for (var property in this.form.controls) {
      if (this.form.controls.hasOwnProperty(property)) {
        var value = this.form.get(property).value;
        if (typeof value === "string") {
          params[property] = value === ALL ? SPACE : value;
        }
      }
    }

    this.startBlockUI();
    this.authService.forgotPassword(params).subscribe(res => {
      this.stopBlockUI();
      if (res.success && res.data) {
        // Show alert info success
        var msg = this.translate.get("common.messages.forgotPassword_success")[
          "value"
        ];
        this.alertService.info(msg).subscribe(() => {
          // navigator to page login
          this.navigator.navigateLoginPage();
        });
      } else {
        this.counter = parseInt(res.error.data);
        var msgWaiting = this.translate.get("common.messages.waitingTime")["value"];
        this.alertService.errorTime(msgWaiting, this.counter);
      }
    });
  }
}
