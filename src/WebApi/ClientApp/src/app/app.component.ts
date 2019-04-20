import { HttpErrorResponse } from "@angular/common/http";
import { Component, HostListener } from "@angular/core";
import { Router } from "@angular/router";
import { Subscription } from "rxjs";
import { BaseComponent } from "./base/base.component";
import { AuthenticationService } from "./api-service/service/authentication.service";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  providers: [AuthenticationService]
})
export class AppComponent extends BaseComponent {
  public blocked: boolean;
  public subscription: Subscription;
  public isCollapse: boolean = false;
  public arrowImage: string = "assets/img/icon-arrow-left.svg";
  public currentLink: string;
  public fullName: string;
  constructor(private router: Router, private service: AuthenticationService) {
    super();
    this.currentLink = this.navigator.getCurrentUrl();
    this.currentUser = this.service.getCurrentUser();
  }

  public onInit(): void {
    this.translate.addLangs(["en", "vn"]);
    this.translate.setDefaultLang("en");

    this.blocked = false;
    this.loaderService.loader().subscribe(state => {
      this.blocked = state;
    });

    if (!this.authService.isAuthenticated()) {
      localStorage.clear();
      this.navigator.navigateLoginPage();
    }
  }

  public toggleSidebar(): void {
    if (!this.isCollapse) {
      this.arrowImage = "assets/img/icon-arrow-right.svg";
    } else if (this.isCollapse) {
      this.arrowImage = "assets/img/icon-arrow-left.svg";
    }
    this.isCollapse = !this.isCollapse;
  }

  public switchLanguage(language: string): void {
    this.translate.use(language);
  }

  @HostListener("document:keydown.backspace", ["$event"])
  public onBackspaceHandler(event: KeyboardEvent): void {
    if (
      event.target["readOnly"] === true ||
      (event.target["tagName"] !== "SPAN" &&
        event.target["tagName"] !== "INPUT" &&
        event.target["tagName"] !== "TEXTAREA")
    ) {
      event.preventDefault();
    }
  }
  @HostListener("document:keydown.enter", ["$event"])
  public onKeydownHandler(event: KeyboardEvent): void {
    if (
      event.target["readOnly"] === true ||
      (event.target["tagName"] !== "SPAN" &&
        event.target["tagName"] !== "INPUT")
    ) {
      event.preventDefault();
    }
  }
  public logOut(): void {
    this.startBlockUI();
    this.service.keepAlive().subscribe(res => {
      if (!res.success) {
        return;
      } else {
        const confirm = this.translate.get(`common.messages.logout_confirm`)[
          "value"
        ];
        this.alertService.confirm(confirm).subscribe(action => {
          if (action.value) {
            this.authService.logout().subscribe(
              data => {
                if (!!data.data) {
                  localStorage.clear();
                  this.navigator.navigateLoginPage();
                }
              },
              (err: HttpErrorResponse) => {}
            );
          }
        });
      }
    });
  }
  public navigatorLink(link: string): void {
    this.startBlockUI();
    this.service.keepAlive().subscribe(res => {
      if (!res.success) {
        return;
      } else {
        this.currentLink = link;
        const url = {
          urlBack: this.navigator.getCurrentUrl()
        };
        this.navigator.navigate(link, url);
      }
    });
  }
}
