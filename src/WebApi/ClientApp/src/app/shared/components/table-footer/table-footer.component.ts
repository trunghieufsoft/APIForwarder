import { Component, Output, EventEmitter, Input, ChangeDetectorRef, ChangeDetectionStrategy } from "@angular/core";
import { DataTableService } from "src/app/shared/services/datatable.service";
import { Page } from "src/app/base/list-base.component";
import { TranslateService } from "@ngx-translate/core";
import { LoaderService } from "src/app/shared/services/loader.service";
import { ServiceManager } from "src/app/shared/services/service-manager.service";
import { AuthenticationService } from "src/app/api-service/service/authentication.service";

@Component({
  selector: "app-table-footer",
  templateUrl: "./table-footer.component.html",
  providers: [DataTableService],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TableFooterComponent {
  @Input() public set pageInput(data: Page) {
    if (data) {
      this.page = this.dataTableService.getPager(data);
    }
  }
  @Output() public pageChange: any = new EventEmitter<number>();
  @Output() public limitChange: any = new EventEmitter<number>();
  public page: Page;
  constructor(
    private dataTableService: DataTableService,
    private translate: TranslateService,
    private servicekeepAlive: AuthenticationService,
    private changeDetector: ChangeDetectorRef,
    private _loaderService: LoaderService
  ) {}

  /**
   * Change Page Index
   *
   * @param {number} page
   * @memberof TableFooterComponent
   */
  public changePageIndex(page: number): void {
    this.startBlockUI();
    this.servicekeepAlive.keepAlive().subscribe(res => {
      if (!res.success) {
        return;
      } else {
        this.pageChange.emit(page);
      }
    });
    this.changeDetector.detectChanges();
  }

  public onLimitChange(event: any): void {
    this.limitChange.emit(event);
    this.changeDetector.detectChanges();
  }

  /**
   * Get element information to display.
   *
   * @param {*} entriesFrom
   * @param {*} entriesTo
   * @param {*} totalEntries
   * @returns {string}
   * @memberof DataTableService
   */
  public getShowPage(): string {
    if (!this.page) { return ""; }
    var entriesFrom = this.page.entriesFrom || 0;
    var entriesTo = this.page.entriesTo || 0;
    var totalEntries = this.page.totalEntries || 0;
    var label = this.translate.get("common.footerTable")["value"];
    if (label) {
      label = label
        .replace("{1}", entriesFrom)
        .replace("{2}", entriesTo)
        .replace("{3}", totalEntries);

      return label;
    }

    return `Showing ${entriesFrom} to ${entriesTo} of ${totalEntries} items`;
  }
  public startBlockUI(): void {
    this.loaderService.isForceBlockUI = true;
    setTimeout(() => {
      this.loaderService.toggleBlockUI(true);
    }, 300);
  }
  /**
   * get LoaderService instance
   *
   * @readonly
   * @type {LoaderService}
   * @memberof BaseComponent
   */
  public get loaderService(): LoaderService {
    if (!this._loaderService) {
      this._loaderService = ServiceManager.get(LoaderService);
    }

    return this._loaderService;
  }
}
