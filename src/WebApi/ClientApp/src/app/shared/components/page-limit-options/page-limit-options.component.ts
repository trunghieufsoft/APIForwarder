import { Component, EventEmitter, Output, ChangeDetectorRef, ChangeDetectionStrategy } from "@angular/core";
import { AppConfig } from '../../services/app.config.service';

@Component({
  selector: "app-page-limit-options",
  templateUrl: "./page-limit-options.component.html",
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PageLimitOptionsComponent {
  @Output() public limitChange: any = new EventEmitter<string>();
  public readonly pageLimitOptions: Object;
  public currentPageLimit: number;
  constructor(private changeDetector: ChangeDetectorRef) {
    this.pageLimitOptions = [
      { key: "20", value: 20 },
      { key: "30", value: 30 },
      { key: "50", value: 50 }
    ];

    this.currentPageLimit = AppConfig.settings.pageItems;
  }

  /**
   * Change Page Limit Option
   *
   * @param {*} value
   * @memberof PageLimitOptionsComponent
   */
  public changePageLimitOption(value: any): void {
    this.limitChange.emit(value);
    this.changeDetector.detectChanges();
  }
}
