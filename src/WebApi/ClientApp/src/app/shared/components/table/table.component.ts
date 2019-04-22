import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnInit,
  Output,
  ChangeDetectionStrategy,
  ViewChild,
  ElementRef,
  ChangeDetectorRef,
  HostListener
} from "@angular/core";
import { CellValuePipe } from "../../pipe/cell-value.pipe";
import { CellTitlePipe } from "../../pipe/cell-title.pipe";
import { AuthenticationService } from "src/app/api-service/service/authentication.service";
import { LoaderService } from "src/app/shared/services/loader.service";
import { ServiceManager } from "src/app/shared/services/service-manager.service";

export interface Column {
  name: string;
  prop: string;
  sort: boolean;
  css: string;
  width: string;
  asc: any;
  type: string;
  titleProp: string;
  group: string;
  isChild: boolean;
  html: boolean;
}

@Component({
  selector: "app-table",
  templateUrl: "./table.component.html",
  styleUrls: ["./table.component.css"],
  providers: [CellValuePipe, CellTitlePipe],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TableComponent implements OnInit, OnChanges {
  @ViewChild("table") public table: ElementRef;
  @ViewChild("wrapper1") public wrapper1: ElementRef;
  @ViewChild("wrapper2") public wrapper2: ElementRef;
  @Input() public columns: Column[];
  @Input() public multiSelect: boolean = false;
  @Input("changeData")
  set changeDataValue(value: boolean) {
    if (value) {
      this.change.detectChanges();
    }
  }
  @Input() public hasCheckbox: boolean = false;
  @Input() public hasChild: boolean = false;
  @Input() public hasExpand: boolean = false;
  @Output() public sort: any = new EventEmitter();
  @Output() public selectRows: any = new EventEmitter();
  @Output() public cellClick: any = new EventEmitter();
  @Output() public callback: EventEmitter<any> = new EventEmitter();
  @Input() set rows(row: any) {
    this.rowsDisplay = row;
    this.inItCol();
  }
  public isIE: boolean = /msie\s|trident\/|edge\//i.test(
    window.navigator.userAgent
  );
  public hasGroup: boolean = false;
  public group: any;
  public cols: any;
  public rowsDisplay: any;
  public numCols: any;
  public width: number = 0;
  public maxWidth: number = 2000;
  public checkedAll: boolean = false;
  public readonlyAll: boolean = false;
  private selectItems: any = [];

  constructor(
    private change: ChangeDetectorRef,
    private serviceKeepAlive: AuthenticationService,
    private _loaderService: LoaderService
  ) {}

  public ngOnInit(): void {
    this.loadCols();
    this.bindScroll();
  }
  public ngOnChanges(changes: any): void {
    this.loadCols();
    this.change.detectChanges();
    //this.width = (this.table.nativeElement as HTMLElement).offsetWidth;
  }

  public ngAfterViewInit(): void {
    this.width = (this.table.nativeElement as HTMLElement).offsetWidth;
    // this.change.detectChanges();
  }

  @HostListener("window:resize", ["$event"])
  public onResize(e: any): void {
    //this.width = (this.table.nativeElement as HTMLElement).offsetWidth;
  }
  public onSort(col: Column): void {
    if (col && col.sort && this.rowsDisplay.length > 0) {
      const asc = col.asc == null || col.asc === false ? true : false;
      for (let i = 0; i < this.columns.length; i++) {
        this.columns[i].asc = null;
      }
      col.asc = asc;
      this.sort.emit(col);
    }
  }

  public onChecked(row: any): void {
    if (row.readonly) {
      return;
    }
    if (row.selected) {
      row.selected = false;
      this.checkedAll = false;
    } else {
      if (!this.multiSelect) {
        for (let i = 0; i < this.rowsDisplay.length; i++) {
          this.rowsDisplay[i].selected = false;
        }
      }
      row.selected = true;
    }
    this.selectItems = this.rowsDisplay.filter(
      x => x.selected === true && x.readonly !== true
    );
    this.checkedAll =
      this.selectItems.length > 0 &&
      this.selectItems.length === this.rowsDisplay.length;
    this.selectRows.emit(this.selectItems);
    this.change.detectChanges();
  }

  public checkAll(): void {
    this.checkedAll = !this.checkedAll;
    for (let i = 0; i < this.rowsDisplay.length; i++) {
      if (this.rowsDisplay[i].readonly !== true) {
        this.rowsDisplay[i].selected = this.checkedAll;
      }
    }
    this.selectItems = this.rowsDisplay.filter(
      x => x.selected === true && x.readonly !== true
    );
    this.selectRows.emit(this.selectItems);
  }

  public onCellClick(ev: any, row: any, col: any): void {
    if (col.prop === "action") {
      this.startBlockUI();
      this.serviceKeepAlive.keepAlive().subscribe(res => {
        if (!res.success) {
          return;
        } else {
          this.cellClick.emit({ col: col, row: row, target: ev.target });
          this.change.detectChanges();
        }
      });
    }
  }

  public getCols(row: any): any {
    if (row.isChild) {
      return this.columns.filter(x => x.isChild);
    } else {
      return this.columns.filter(x => !x.isChild);
    }
  }

  public loadCols(): void {
    this.checkedAll = false;
    this.hasGroup = this.columns.filter(x => !!x.group).length > 0;
    if (this.hasGroup) {
      this.group = [];
      this.cols = [];
      for (let i = 0; i < this.columns.length; i++) {
        var col = this.columns[i];
        if (col.group) {
          if (this.group.filter(x => x.name === col.group).length === 0) {
            var colSpan = this.columns.filter(x => x.group === col.group)
              .length;
            colSpan = colSpan === 0 ? 1 : colSpan;
            this.group.push({ name: col.group, rowSpan: 1, colSpan: colSpan });
          }
          this.cols.push(col);
        } else {
          this.group.push({ name: col.name, rowSpan: 2, colSpan: 1 });
        }
      }
    } else {
      this.cols = this.columns.filter(x => !x.isChild);
    }
    var maxWidth = 0;
    for (let i = 0; i < this.cols.length; i++) {
      var width = this.cols[i].width;
      maxWidth += !width ? 50 : parseInt(width);
    }
    this.maxWidth = maxWidth;
    this.numCols = this.cols.filter(x => !x.isChild).length;
    if (this.rowsDisplay) {
      var readonlyRow = this.rowsDisplay.filter(x => x.readonly === true);
      this.readonlyAll =
        readonlyRow && readonlyRow.length === this.rowsDisplay.length;
    } else {
      this.readonlyAll = true;
    }
  }

  public bindScroll(): void {
    var wrap1 = this.wrapper1.nativeElement;
    var wrap2 = this.wrapper2.nativeElement;
    this.wrapper2.nativeElement.addEventListener("scroll", function(): void {
      wrap1.scrollLeft = this.scrollLeft;
    });
    this.wrapper1.nativeElement.addEventListener("scroll", function(): void {
      wrap2.scrollLeft = this.scrollLeft;
    });
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

  /**
   * InIt Column
   *
   * @memberof TableComponent
   */
  public inItCol(): void {
    if (this.rowsDisplay) {
      for (let i = 0; i < this.rowsDisplay.length; i++) {
        this.rowsDisplay[i].column = this.getCols(this.rowsDisplay[i]);
      }
    }
  }
}
