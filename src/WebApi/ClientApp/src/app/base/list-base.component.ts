import { Observable, Subject } from 'rxjs';
import { BaseComponent } from './base.component';
import { DataTableService } from '../shared/services/datatable.service';
import { ServiceManager } from '../shared/services/service-manager.service';
import { AppConfig } from '../shared/services/app.config.service';

export class Page {
  // The entries from
  public entriesFrom = 0;
  // The entries to
  public entriesTo = 0;
  // The total entries of pages
  public totalEntries = 0;
  // The number of entries in the page
  public limitEntries: number = AppConfig.settings.pageItems;
  // The total pages
  public totalPages = 0;
  // The current page
  public currentPage = 1;
  // The array page show
  public pages: number[];
  // The Limit page show
  public limitPageShow = 3;
  // Page Information
  public pageInformation = '';
}

export interface PagedData {
  page: Page;
  success: boolean;
  errorMessage: string;
  errorCode: number;
  data: any;
  originalData: any;
}

export interface GridSort {
  pageIndex: number;
  limit: number;
  orderBy: string;
  isSortDescending: boolean;
}

export interface SortEvent {
  name: string;
  asc: boolean;
  prop: string;
  sort: boolean;
}

export interface PageEvent {
  first: number;
  page: number;
  pageCount: number;
  rows: number;
}

export abstract class ListBaseComponent extends BaseComponent {
  // The parameters of GridSortable
  public paramsSort: any = {
    pageIndex: 0,
    limit: AppConfig.settings.pageItems,
    orderBy: '',
    isSortDescending: true
  };
  // An object used to get page information from the server
  public page: Page = new Page();
  // The url to get data from server
  public url: string;
  // Condition parameters to get data
  public paramsInput: any;
  // Data of column
  public rows: any;

  private _dataTableService: DataTableService;

  public get dataTableService(): DataTableService {
    if (!this._dataTableService) {
      this._dataTableService = ServiceManager.get(DataTableService);
    }

    return this._dataTableService;
  }

  /**
   * Get data from server.
   *
   * @param {} paramsInput
   * @memberof ListBaseComponent
   */
  public retrieveData(paramsInput: any): Observable<PagedData> {
    this.page.currentPage = 1;
    this.paramsSort.pageIndex = 0;
    this.paramsInput = paramsInput;

    return this.getDataServer();
  }

  /**
   * Get Data Server
   *
   * @returns {Observable<PagedData>}
   * @memberof ListBaseComponent
   */
  public getDataServer(): Observable<PagedData> {
    this.startBlockUI();
    const resultSubject = new Subject<any>();
    this.dataTableService
      .getDataFromApi(this.url, this.paramsInput, this.paramsSort, this.page)
      .subscribe(result => {
        this.stopBlockUI();
        if (result.success) {
          this.page = Object.assign({}, result.page);
          this.convertData(result.data);
        }

        resultSubject.next({
          data: result.data,
          success: result.success,
          errorMessage: result.errorMessage,
          errorCode: result.errorCode,
          originalData: result.originalData
        } as PagedData);
      });

    return resultSubject;
  }

  /**
   * Handle onLimitChange event
   *
   * @param {number} limit
   * @returns {Observable<PagedData>}
   * @memberof ListBaseComponent
   */
  public limitChange(limit: number): Observable<PagedData> {
    this.page.currentPage = 1;
    this.paramsSort.pageIndex = 0;
    this.page.limitEntries = limit;
    this.paramsSort.limit = limit;

    return this.getDataServer();
  }

  /**
   * Handle onPageChange event
   *
   * @returns {Observable<PagedData>}
   * @memberof ListBaseComponent
   */
  public pageChange(page: number): Observable<PagedData> {
    this.page.currentPage = page;
    this.paramsSort.pageIndex = page > 0 ? page - 1 : 0;

    return this.getDataServer();
  }

  /**
   * Handle onSortChange event
   *
   * @param {SortEvent} sort
   * @returns {Observable<PagedData>}
   * @memberof ListBaseComponent
   */
  public sortChange(sort: any): Observable<PagedData> {
    this.paramsSort.isSortDescending = !sort.asc;
    this.paramsSort.orderBy = sort.prop;

    return this.getDataServer();
  }

  /**
   * Convert, modify, format data before binding to table
   *
   * @param {Array<any>} data
   * @returns
   * @memberof ListBaseComponent
   */
  public convertData(data: Array<any>): void {}

  /**
   * Set data on grid.
   *
   * @param {} data
   * @memberof ListBaseComponent
   */
  public setDataOnGrid(data: any): void {
    this.rows = data;
  }

  /**
   * Handle sortClient event
   *
   * @param {} event
   * @returns {}
   * @memberof ListBaseComponent
   */
  public sortClient(event: any, data: any = null): any {
    const list = this.getListSorted(event, data);
    if (data) {
      return list;
    } else {
      this.setDataOnGrid(Array.from(list));
    }
  }

  /**
   * Get list after sorted.
   *
   * @param {*} event
   * @param {*} [data]
   * @returns {*}
   * @memberof ListBaseComponent
   */
  public getListSorted(event: any, data?: any): any {
    if (!event.sort) {
      return data ? data : this.rows;
    }
    let list = null;
    if (this.rows) {
      const prop = event.prop;
      const asc = event.asc;
      let dataSort = data;
      if (!data) {
        dataSort = this.rows;
      }
      list = dataSort.sort(function(a: any, b: any): any {
        let propA;
        let propB;

        if (!!event.number && event.number) {
          propA =
            !a[prop] || a[prop] == null || a[prop] === '' ? 0 : Number(a[prop]);
          propB =
            !b[prop] || b[prop] == null || b[prop] === '' ? 0 : Number(b[prop]);
        } else {
          propA = String(a[prop]).toLowerCase();
          propB = String(b[prop]).toLowerCase();
        }

        if (!asc) {
          if (propA > propB) {
            // sort string descending
            return -1;
          }
          if (propA < propB) {
            return 1;
          }
        } else {
          if (propA < propB) {
            // sort string ascending
            return -1;
          }
          if (propA > propB) {
            return 1;
          }
        }

        return 0; // default return value (no sorting)
      });
    }

    return list;
  }

  /**
   * Handle refresh event
   *
   * @returns {Observable<PagedData>}
   * @memberof ListBaseComponent
   */
  public refresh(): Observable<PagedData> {
    return this.getDataServer();
  }
}
