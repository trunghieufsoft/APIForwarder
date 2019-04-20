import { Location } from '@angular/common';
import { Injectable } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class NavigatorService {
  private _transitionParams: any;

  constructor(
    private location: Location,
    public router: Router,
    private activatedRoute: ActivatedRoute
  ) {
    this._transitionParams = new Map<string, any>();
  }

  /**
   * Request open a page in a new tab.
   * @param urlLink The page request
   * @param options is an optional string containing a comma-separated list of requested features of the new window
   *
   * Example:
   * var strWindowFeatures = "menubar=no,location=no,resizable=no,scrollbars=no,status=yes,height=700,width=700";
   * this.IfsNavigatorService.openInNewTab('samples/navigator', strWindowFeatures);
   *
   */
  public openInNewTab(urlLink: string, options?: string): any {
    return window.open(this.location.prepareExternalUrl(urlLink), '', options);
  }

  /**
   * Open external url
   * Do not use this for internal url
   * @param url
   */
  public openExternalUrl(url: string): any {
    return (window.location.href = url);
  }

  /**
   * Open route in new window
   *
   * @param {string} path
   * @param {number} width
   * @param {number} height
   * @param {string} features
   * @memberof IfsNavigatorService
   */
  public openNewWindow(
    path: string,
    width: number,
    height: number,
    features: string
  ): any {
    let win = null;
    let winl = (screen.width - width) / 2;
    let wint = (screen.height - height) / 2;
    if (winl < 0) {
      winl = 0;
    }
    if (wint < 0) {
      wint = 0;
    }
    let settings = 'height=' + height + ',';
    settings += 'width=' + width + ',';
    settings += 'top=' + wint + ',';
    settings += 'left=' + winl + ',';
    settings += features;
    win = window.open(path, '', settings);
    win.moveTo(winl, wint);
    win.window.focus();
  }

  /**
   * Close current tab.
   */
  public closeTab(): any {
    return window.close();
  }

  /**
   * Return to home screen.
   */
  public navigateHomePage(): any {
    return this.router.navigate(['dashboard']);
  }

  /**
   * Return to login screen.
   */
  public navigateLoginPage(): any {
    return this.router.navigate(['login']);
  }

  /**
   * Return to error screen.
   */
  public navigateErrorPage(): any {
    return this.router.navigate(['error']);
  }

  /**
   * Return to blank screen.
   */
  public navigateBlankPage(): any {
    return this.router.navigate(['blank']);
  }

  /**
   * Clear window history
   */
  public clearHistory(): void {
    if (window && window.history && window.history !== undefined) {
      window.history.pushState(null, document.title, window.location.href);
    }
  }

  /**
   * Navigate with option parameters.
   * @param url Navigate based on the provided url
   * @param objectParams The parameters transfer to another page.
   */
  // tslint:disable-next-line:ban-types
  public navigate(url?: string, objectParams?: Object): Promise<boolean> {
    if (!url) {
      url = this.getCurrentUrl();
    }
    if (objectParams && Object.keys(objectParams).length > 0) {
      this._transitionParams.clear();

      Object.keys(objectParams).forEach(key => {
        this._transitionParams.set(key, objectParams[key]);
      });
    }

    return this.router.navigate([url]);
  }

  /**
   * Get value from key.
   * @param key
   */
  public getParameter(transitionParams: string): any {
    return this._transitionParams.get(transitionParams);
  }

  /**
   * Get value from key when using routerLink.
   * @param key
   */
  public getParameterRouterLink(key: string): any {
    return this.activatedRoute.snapshot.queryParamMap.get(key);
  }

  public getCurrentUrl(): string {
    return this.router.url;
  }
}
