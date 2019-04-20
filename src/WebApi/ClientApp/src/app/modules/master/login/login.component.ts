import { Component, ElementRef, ViewChild } from "@angular/core";
import { Validators, FormGroup } from "@angular/forms";
import { Router } from "@angular/router";
import { first } from "rxjs/operators";
import { ILogin } from "src/app/api-service/model/login";
import { ALL, SPACE } from "src/app/app.constant";
import { BaseComponent } from "src/app/base/base.component";

@Component({
  selector: "app-login",
  templateUrl: "./login.component.html",
})
export class LoginComponent extends BaseComponent {
  public form: FormGroup;
  private defaultUserName: string = "";
  private defaultPassWord: string = "";

  constructor() {
    super();
    if (this.authService.isAuthenticated()) {
      this.navigator.navigate("/");
    }
  }

  /**
   * Get form controls
   */
  get f(): any {
    return this.form.controls;
  }

  public ngOnInit(): void {
    localStorage.clear();
    this.authService.logout();
    this.createFormBuilder();
  }

  /**
   * User Login with username and password
   */
  public onLogin(): void {
    this.markFormDirty();
    const isValid = this.isValidForm(this.form);
    if (!isValid) {
      return;
    }
    setTimeout(() => {
      this.login();
    }, 300);
  }

  /**
   * Move screen forgot password
   */
  public onForgotPassword(): Promise<boolean> {
    return this.navigator.navigate("/forgot-password");
  }

  /**
   * Create formbuilder of control
   */
  private createFormBuilder(): void {
    this.form = this.formBuilder.group({
      username: [this.defaultUserName, [Validators.required]],
      password: [this.defaultPassWord, [Validators.required]]
    });
  }

  /**
   * Excute call api login
   */
  private login(): void {
    const params: ILogin = {
      username: SPACE,
      password: SPACE
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
    this.authService
      .login(params)
      .pipe(first())
      .subscribe(res => {
        this.stopBlockUI();
        if (res && res.success) {
          let numberDay = Number(
            this.authService.decodeToken(res.data).ExpiredPassword
          );
          if (numberDay <= 0) {
            let msg = this.translate.get(`error.PasswordExpired`)["value"];

            this.alertService.error(msg).subscribe(action => {
              if (action.value) {
                this.authService.setToken(res.data);
                this.navigator.navigate("/change-password");
              } else {
                return;
              }
            });
          } else if (numberDay >= 1 && numberDay <= 5) {
            let msg = this.translate
              .get(`common.messages.passwordExpired`)
              ["value"].replace("${value}", numberDay);

            this.alertService.warning(msg).subscribe(action => {
              if (action.value) {
                this.authService.setToken(res.data);
                this.navigator.navigate("/change-password");
              } else {
                return;
              }
            });
          } else {
            this.startBlockUI();
            this.navigator.navigateHomePage();
            this.authService.setToken(res.data);
          }
        } else {
          return;
        }
      });
  }
}
