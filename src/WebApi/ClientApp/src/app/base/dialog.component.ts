import { ElementRef, EventEmitter, Output, ViewChild } from '@angular/core';
import { ListBaseComponent } from './list-base.component';

declare var $: any;

export abstract class DialogBaseComponent extends ListBaseComponent {
  @ViewChild('modalRef') public modalRef: ElementRef;
  @Output() public submittedEvent: EventEmitter<any> = new EventEmitter<any>();
  @Output() public canceledEvent: EventEmitter<any> = new EventEmitter<any>();
  @Output() public closedEvent: EventEmitter<any> = new EventEmitter<any>();

  public inputData: any;

  constructor() {
    super();
  }

  public onInit(): void {
    this.ngBeforeOnInit();
    $(this.modalRef.nativeElement).on('hidden.bs.modal', () =>
      this.closedEvent.emit()
    );
  }

  public onDestroy(): void {
    this.ngBeforeOnDestroy();

    $(this.modalRef.nativeElement).off('hidden.bs.modal', () =>
      this.closedEvent.emit()
    );
  }

  public show(): void {
    $(this.modalRef.nativeElement).modal({backdrop: 'static', keyboard: false });
    $(this.modalRef.nativeElement).modal('show');
  }

  public hide(): void {
    $(this.modalRef.nativeElement).modal('hide');
  }

  public abstract ngBeforeOnInit(): void;
  public abstract ngBeforeOnDestroy(): void;

  public abstract init(params: any): void;
}
