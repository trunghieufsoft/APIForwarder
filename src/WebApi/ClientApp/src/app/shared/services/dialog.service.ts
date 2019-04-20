import { Injectable, Type } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { DialogBaseComponent } from 'src/app/base/dialog.component';

@Injectable()
export class DialogService {
  public dialogObserver: Observable<DialogObject>;

  private dialogSource: Subject<DialogObject> = new Subject<DialogObject>();

  constructor() {
    this.dialogObserver = this.dialogSource.asObservable();
  }

  /**
   * Open dialog screen
   * @param {Type<EupDialogBaseComponent>} dialogComponent The Dialog Component Type
   * @param {Function} [submittedEventCallback] The callback when dialog raises submitted event
   * @param {object} [params={}] The parameter object
   */
  public open(
    dialogComponent: Type<DialogBaseComponent>,
    submittedEventCallback?: Function,
    canceledEventCallback?: Function,
    params: object = {}
  ): void {
    if (dialogComponent) {
      this.dialogSource.next({
        dialogComponent,
        params,
        submittedEventCallback,
        canceledEventCallback
      } as DialogObject);
    }
  }
}

export interface DialogObject {
  dialogComponent: Type<DialogBaseComponent>;
  params?: object;
  submittedEventCallback?: Function;
  canceledEventCallback?: Function;
}
