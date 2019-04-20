import { Injectable } from '@angular/core';
import { Observable, Subject, of } from 'rxjs';
import { ApiHttpClient } from '../common/api-http-client';
import { GridSort, Page, PagedData } from 'src/app/base/list-base.component';
import { TranslateService } from '@ngx-translate/core';

@Injectable({
  providedIn: 'root'
})
export class DataTableService {
  constructor(private httpClient: ApiHttpClient, private translate: TranslateService) {}

  /**
   * Get data from api
   *
   * @param {string} url
   * @param {*} params
   * @param {GridSort} property
   * @param {Page} page
   * @returns {Observable<PagedData>}
   * @memberof DataTableService
   */
  public getDataFromApi(
    url: string,
    params: any,
    property: GridSort,
    page: Page
  ): Observable<PagedData> {
    const result = new Subject<PagedData>();
    let finalParams = null;
    if (!!params.search) {
      params.search = Object.assign(params.search, property);
      finalParams = params;
    } else {
      finalParams = Object.assign(params, property);
    }
    this.httpClient.post(url, finalParams).subscribe(response => {
      result.next(this.getPagedDataList(response, page));
    });

    return result;
  }

  /**
   * getPager
   *
   * @param {number} totalItems
   * @param {number} [currentPage=1]
   * @param {number} [pageSize=10]
   * @returns
   * @memberof DataTableService
   */
  public getPager(page: Page): Page {
    let currentPage = page.currentPage;
    let startIndex = 0;
    let endIndex = 0;

    // ensure current page isn't out of range
    if (page.totalEntries >= 1) {
      if (currentPage < 1) {
        currentPage = 1;
      } else if (currentPage > page.totalPages) {
        currentPage = page.totalPages;
      }

      // calculate start and end item indexes
      startIndex = 1;
      endIndex = page.currentPage * page.limitEntries;
      if (page.currentPage > 1) {
        startIndex = (page.currentPage - 1) * page.limitEntries;
      }
      endIndex = Math.min(endIndex, page.totalEntries);
    } else {
      currentPage = 0;
      startIndex = 0;
      endIndex = 0;
    }

    // tslint:disable-next-line:one-variable-per-declaration
    let startPage: number, endPage: number;
    if (page.totalPages <= page.limitPageShow) {
      // less than 10 total pages so show all
      startPage = 1;
      endPage = page.totalPages;
    } else {
      // total pages more than max so calculate start and end pages
      const maxPagesBeforeCurrentPage = Math.floor(page.limitPageShow / 2);
      const maxPagesAfterCurrentPage = Math.ceil(page.limitPageShow / 2) - 1;
      if (currentPage <= maxPagesBeforeCurrentPage) {
        // current page near the start
        startPage = 1;
        endPage = page.limitPageShow;
      } else if (currentPage + maxPagesAfterCurrentPage >= page.totalPages) {
        // current page near the end
        startPage = page.totalPages - page.limitPageShow + 1;
        endPage = page.totalPages;
      } else {
        // current page somewhere in the middle
        startPage = currentPage - maxPagesBeforeCurrentPage;
        endPage = currentPage + maxPagesAfterCurrentPage;
      }
    }

    // create an array of pages to ng-repeat in the pager control
    const pages = Array.from(Array(endPage + 1 - startPage).keys()).map(
      i => startPage + i
    );

    // return object with all pager properties required by the view
    return {
      entriesFrom: startIndex,
      entriesTo: endIndex,
      totalEntries: page.totalEntries,
      limitEntries: page.limitEntries,
      totalPages: page.totalPages,
      currentPage,
      pages,
      pageInformation: ''
    } as Page;
  }

  /**
   * Get paged data
   *
   * @private
   * @param {*} result
   * @param {Page} page
   * @returns {PagedData}
   * @memberof DataTableService
   */
  private getPagedDataList(result: any, page: Page): PagedData {
    if (result && result.data) {
      page.totalEntries = result.data.totalData;
      page.totalPages = Math.ceil(result.data.totalData / page.limitEntries);

      return {
        data: result.data,
        page,
        success: true,
        errorMessage: null,
        errorCode: null,
        originalData: result
      } as PagedData;
    }

    return {
      data: null,
      page: null,
      success: false,
      errorMessage: Object.keys(result).length === 1 ? null : result.message,
      errorCode: Object.keys(result).length === 1 ? null : result.errorCode,
      originalData: result
    } as PagedData;
  }
}
