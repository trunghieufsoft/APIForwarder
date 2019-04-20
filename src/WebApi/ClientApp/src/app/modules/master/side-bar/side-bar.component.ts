import { Component, Input } from "@angular/core";
import { Subscription } from "rxjs";
import { AuthenticationService } from "src/app/api-service/service/authentication.service";
import { BaseComponent } from "src/app/base/base.component";
import { NavigatorService } from "../../../shared/services/navigator.service";
import { Router, NavigationEnd } from "@angular/router";

@Component({
  selector: "app-side-bar",
  templateUrl: "./side-bar.component.html",
  providers: [AuthenticationService]
})
export class SideBarComponent extends BaseComponent {
  @Input() set input(isCollapse: boolean) {
    this.isCollapse = isCollapse;
  }
  public isCollapse: boolean;
  public currentLink: string;
  public subscription: Subscription;
  public navigator: NavigatorService;

  constructor(private router: Router, private service: AuthenticationService) {
    super();
    this.currentUser = this.service.getCurrentUser();
    this.router.events.pipe().subscribe(e => {
      if (e instanceof NavigationEnd) {
        this.currentLink = e.url.split("/")[1];
        if (this.currentLink === "log") {
          this.currentLink = e.url.substr(1);
        }
      }
    });
  }


  public onInit(): void {
    this.getCurrent();
  }

  public ngAfterViewInit(): void {
    this.getCurrent();
  }

  public navigatorLink(link: string): void {
    this.startBlockUI();
    this.service.keepAlive().subscribe(res => {
      if (!res.success) {
        return;
      } else {
        this.currentLink = link;
        this.navigator.navigate(link);
      }
    });
  }

  public getCurrent(): void {
    this.currentUser = this.service.getCurrentUser();
    var url = window.location.href;
    url = url.split("#")[1];
    if (url) {
      this.currentLink = url.replace(/^\/+/g, "");
    }
  }
}
