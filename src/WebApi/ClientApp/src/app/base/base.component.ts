import { DatePipe } from '@angular/common';
import { AfterViewInit, OnChanges, OnDestroy, OnInit } from '@angular/core';
import { AbstractControl, FormArray, FormBuilder, FormGroup, ValidationErrors } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';
import { Subject } from 'rxjs';
import { AlertService } from 'src/app/shared/services/alert.service';
import { AuthenticationService } from '../api-service/service/authentication.service';
import { ALL } from '../app.constant';
import { CONSTANT } from '../shared/common/constant';
import { DialogService } from '../shared/services/dialog.service';
import { LoaderService } from '../shared/services/loader.service';
import { NavigatorService } from '../shared/services/navigator.service';
import { ServiceManager } from '../shared/services/service-manager.service';
export abstract class BaseComponent
  implements OnChanges, OnInit, OnDestroy, AfterViewInit {
  public currentDate: Date = new Date();
  public currentUser: any;
  public defaultCountry: string;
  protected get alertService(): AlertService {
    if (!this._alertService) {
      this._alertService = ServiceManager.get(AlertService);
    }

    return this._alertService;
  }

  get isSuper(): any {
    return (
      this.currentUser &&
      this.currentUser.UserType === CONSTANT.userType.super
    );
  }

  get isManager(): any {
    return (
      this.currentUser &&
      this.currentUser.UserType === CONSTANT.userType.manager
    );
  }

  get isStaff(): any {
    return (
      this.currentUser &&
      this.currentUser.UserType === CONSTANT.userType.staff
    );
  }

  /**
   * get FormBuilder instance
   *
   * @readonly
   * @type {FormBuilder}
   * @memberof BaseComponent
   */
  public get formBuilder(): FormBuilder {
    if (!this._formBuilder) {
      this._formBuilder = ServiceManager.get(FormBuilder);
    }

    return this._formBuilder;
  }

  /**
   * get IfsDialogService instance
   *
   * @readonly
   * @type {IfsDialogService}
   * @memberof BaseComponent
   */
  public get dialogService(): DialogService {
    if (!this._dialogService) {
      this._dialogService = ServiceManager.get(DialogService);
    }

    return this._dialogService;
  }

  /**
   * get JpNavigatorService instance
   *
   * @readonly
   * @type {JpNavigatorService}
   * @memberof BaseComponent
   */
  public get navigator(): NavigatorService {
    if (!this._navigator) {
      this._navigator = ServiceManager.get(NavigatorService);
    }

    return this._navigator;
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
   * get LoaderService instance
   *
   * @readonly
   * @type {AuthService}
   * @memberof BaseComponent
   */
  public get authService(): AuthenticationService {
    if (!this._authService) {
      this._authService = ServiceManager.get(AuthenticationService);
    }

    return this._authService;
  }

  public get translate(): TranslateService {
    if (!this._translateService) {
      this._translateService = ServiceManager.get(TranslateService);
    }

    return this._translateService;
  }

  public get datePipe(): DatePipe {
    if (!this._datePipe) {
      this._datePipe = ServiceManager.get(DatePipe);
    }

    return this._datePipe;
  }

  public get isLoading(): boolean {
    return this._loaderService.isLoading;
  }

  public set isLoading(value: boolean) {
    this._loaderService.isLoading = value;
  }

  public resetTooltip: boolean = false;
  public isDestroy: any;
  public form: FormGroup;
  private _alertService: AlertService;
  private _formBuilder: FormBuilder;
  private _dialogService: DialogService;
  private _navigator: NavigatorService;
  private _loaderService: LoaderService;
  private _authService: AuthenticationService;
  private _translateService: TranslateService;
  private _datePipe: DatePipe;

  constructor() {
    this.isDestroy = new Subject();
  }

  public ngOnChanges(): void {
    this.onChanges();
  }

  public ngOnInit(): void {
    this.onInit();
  }

  public ngOnDestroy(): void {
    this.isDestroy.next();
    this.isDestroy.complete();

    this.onDestroy();
  }

  public ngAfterViewInit(): void {
    this.afterViewInit();
  }

  /**
   * Show block ui with spinner
   *
   * @memberof BaseComponent
   */
  public startBlockUI(): void {
    this.loaderService.isForceBlockUI = true;
    setTimeout(() => {
      this.loaderService.toggleBlockUI(true);
    }, 300);
  }

  /**
   * Hide block ui and spinner
   *
   * @memberof BaseComponent
   */
  public stopBlockUI(): void {
    this.loaderService.isForceBlockUI = false;
    setTimeout(() => {
      this.loaderService.toggleBlockUI(false);
    }, 300);
  }

  protected onInit(): void {
    this.initForm();
    this.initVariables();
    this.initMaster();
  }

  protected onChanges(): void {
    // Virtual method
  }

  protected onDestroy(): void {
    // Virtual method
    this.isDestroy.next();
  }

  protected afterViewInit(): void {
    // Virtual method
  }

  protected initForm(): void {
    // Virtual method
  }

  protected initVariables(): void {
    // Virtual method
  }

  protected initMaster(): void {
    // Virtual method
  }

  protected markFormDirty(): void {
    if (this.form) {
      Object.keys(this.form.controls).forEach(key => {
        if (!this.form.controls[key].dirty) {
          this.form.controls[key].markAsDirty();
          this.form.controls[key].updateValueAndValidity();
        }
      });
    }
  }

  protected disableControl(listControl?: string[]): void {
    if (listControl) {
      listControl.forEach(control => {
        this.form.controls[control].disable();
      });

      return;
    }

    Object.keys(this.form.controls).forEach(key => {
      this.form.controls[key].disable();
    });
  }

  /**
   * Add an error manually to a specific control
   *
   * @param {AbstractControl} control
   * @param {*} error
   * @memberof BaseComponent
   */
  protected addError(control: AbstractControl, error: ValidationErrors): void {
    control.markAsDirty();
    control.markAsTouched();
    if (control.errors) {
      const currentError = control.errors;
      Object.keys(error).forEach(key => {
        currentError[key] = error[key];
      });
    } else {
      control.setErrors(error);
    }
  }

  /**
   * Remove an error manually to a specific control
   *
   * @param {AbstractControl} control
   * @param {*} error
   * @memberof BaseComponent
   */
  protected removeError(
    control: AbstractControl,
    error: ValidationErrors
  ): void {
    if (control.errors) {
      const currentError = control.errors;

      if (Object.keys(currentError).length <= 0) {
        return;
      }

      Object.keys(error).forEach(key => {
        if (currentError[key]) {
          delete currentError[key];
        }
      });

      if (Object.keys(currentError).length <= 0) {
        control.setErrors(null);
      }
    } else {
      control.setErrors(null);
    }
  }

  /**
   * Validate form data
   *
   * @param {AbstractControl} form target form to validate
   * @returns {boolean}
   * @memberof BaseComponent
   */
  protected isValidForm(form: FormGroup): boolean {
    if (form.valid) {
      return form.valid;
    }

    Object.keys(form.controls).forEach(key => {
      if (form.get(key) instanceof FormArray) {
        this.validateFormArray(form.get(key) as FormArray);
      } else {
        form.get(key).markAsDirty();
        form.get(key).markAsTouched();
        form.get(key).setValue(form.get(key).value);
      }
    });

    return form.valid;
  }

  protected formatDate(
    value: Date,
    format: string,
    offset: number = 0
  ): string {
    if (value) {
      if (offset !== 0 && value instanceof Date) {
        value.setMinutes(value.getMinutes() - offset);
      }

      return this.datePipe.transform(value, format);
    }

    return '';
  }

  protected formatTime(value: string): string {
    if (value) {
      return value.slice(0, 5);
    }

    return '';
  }

  protected getDefaultCountry(array: any, isAll: boolean = false): any {
    if (!array || array.length === 0) {
      return null;
    }
    if (this.isSuper) {
      return isAll
        ? ALL
        : this.defaultCountry
        ? this.getObjectArrayFromString(array, this.defaultCountry)
        : array[0];
    } else {
      return this.getObjectArrayFromString(array, this.currentUser.Country);
    }
  }

  protected getObjectArrayFromString(
    array: any,
    value: string,
    prop: string = 'id'
  ): any {
    if (!array || array.length === 0 || !value) {
      return null;
    }

    return array.filter(x => x[prop] + '' === value + '')[0];
  }

  protected formatArrToSmallArr(arr: any, value: string): any {
    if (value) {
      const valueArr = value.split(',');
      if (!arr) {
        return valueArr;
      } else {
        const newArray = [];
        for (let i = 0; i < valueArr.length; i++) {
          const item = arr.filter(x => x.name.trim() === valueArr[i].trim())[0];
          if (item != null) {
            newArray.push(item);
          }
        }

        return newArray;
      }
    }

    return [];
  }

  protected formatUserArrToSmallUserArr(arr: any, value: string): any {
    if (value) {
      const valueArr = value.split(',');
      if (!arr) {
        return valueArr;
      } else {
        const newArray = [];
        for (let i = 0; i < valueArr.length; i++) {
          const item = arr.filter(x => x.user.trim() === valueArr[i].trim())[0];
          if (item != null) {
            newArray.push(item);
          }
        }

        return newArray;
      }
    }

    return [];
  }

  protected formatDropdownForUsers(arr: any): any {
    if (arr) {
      const newArray = [];
      for (let i = 0; i < arr.length; i++) {
        const item = { id: arr[i].code, name: arr[i].fullName };
        newArray.push(item);
      }

      return newArray;
    }

    return [];
  }

  protected getValueDataByArray(arr: any): string {
    let value;
    if (!arr) {
     return null;
    }
    for (let i = 0; i < arr.length; i++) {
      value = !value ? arr[i].name : value + ', ' + arr[i].name;
    }

    return value;
  }

  protected dateOfTime(value: string): Date {
    const date = new Date();
    let h = 0;
    let m = 0;
    if (value) {
      const arr = value.split(':');
      h = parseInt(arr[0]) || 0;
      m = parseInt(arr[1]) || 0;
    }
    date.setHours(h);
    date.setMinutes(m);

    return date;
  }

  protected timeOfDate(value: Date): any {
    if (value && value instanceof Date) {
      return value.getHours() + ':' + value.getMinutes() + ':00';
    }

    return '';
  }

  protected toISOStrDate(date: string): string {
    const arr = date.split('/');
    if (arr.length === 3) {
      return arr[2] + '-' + arr[1] + '-' + arr[0];
    }

    return null;
  }
  protected validateFormArray(formArray: FormArray): boolean {
    for (let i = 0; i < formArray.length; i++) {
      if (!this.isValidForm(formArray.controls[i] as FormGroup)) {
        return false;
      }
    }
  }
}
