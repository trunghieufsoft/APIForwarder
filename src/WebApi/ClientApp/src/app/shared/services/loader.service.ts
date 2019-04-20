import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
/**
 * Manage loading bar process
 *
 * @export
 * @class LoaderService
 */
@Injectable({
  providedIn: 'root'
})
export class LoaderService {
  public isLoading: boolean;
  public isForceBlockUI: any;
  private _subject: Subject<boolean>;
  private _blockUISubject: Subject<boolean>;
  private _modalBlockUISubject: Subject<boolean>;
  private _isUIBlocked: boolean;

  constructor() {
    this._subject = new Subject<boolean>();
    this._blockUISubject = new Subject<boolean>();
    this._modalBlockUISubject = new Subject<boolean>();
    this._isUIBlocked = false;
  }
  /**
   * Emit loading bar status to start/stop loading bar
   *
   * @param {boolean} isShowLoadingBar
   * @memberof LoaderService
   */
  public emit(isShowLoadingBar: boolean): void {
    this._subject.next(isShowLoadingBar);
  }
  /**
   * Loading bar status change listener
   *
   * @returns
   * @memberof LoaderService
   */
  public loader(): any {
    return this._subject.asObservable();
  }
  /**
   * Start/stop block UI
   *
   * @param {boolean} value
   * @memberof LoaderService
   */
  public toggleBlockUI(value: boolean): any {
    if (this._isUIBlocked !== value) {
      this._isUIBlocked = value;
      this._blockUISubject.next(value);
    }
  }
  public toggleModalBlockUI(value: boolean): any {
    this._modalBlockUISubject.next(value);
  }
  /**
   * Block UI status change listener
   *
   * @returns
   * @memberof LoaderService
   */
  public blockUI(): Observable<boolean> {
    return this._blockUISubject.asObservable();
  }
  public modalBlockUI(): Observable<boolean> {
    return this._modalBlockUISubject.asObservable();
  }
  public removeAll(): void {
    this.emit(false);
    this.toggleBlockUI(false);
    this.toggleModalBlockUI(false);
  }
}
