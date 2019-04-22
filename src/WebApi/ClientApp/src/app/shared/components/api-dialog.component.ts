import { CommonModule } from "@angular/common";
import {
  Component,
  ComponentFactoryResolver,
  ComponentRef,
  Input,
  NgModule,
  OnChanges,
  OnDestroy,
  ViewChild,
  ViewContainerRef
} from "@angular/core";
import { Subscription } from "rxjs";

import { DialogService, DialogObject } from "../services/dialog.service";
import { DialogBaseComponent } from "src/app/base/dialog.component";

declare var $: any;

@Component({
  selector: "api-comp-dialog",
  template: `
    <ng-container #container></ng-container>
  `
})
export class ApiDialogComponent implements OnDestroy, OnChanges {
  @ViewChild("container", { read: ViewContainerRef })
  public container: ViewContainerRef;

  @Input()
  public inputData: any;

  public componentRef: ComponentRef<DialogBaseComponent>;

  public subscription: Subscription;

  constructor(
    private dialogService: DialogService,
    private componentFactoryResolver: ComponentFactoryResolver
  ) {
    if (dialogService) {
      this.subscription = dialogService.dialogObserver.subscribe(
        (dialogObj: DialogObject) => {
          this.destroyComponentRef();

          const componentFactory = this.componentFactoryResolver.resolveComponentFactory(
            dialogObj.dialogComponent
          );
          this.componentRef = this.container.createComponent(componentFactory);
          this.componentRef.instance.init(dialogObj.params);
          this.componentRef.instance.submittedEvent.subscribe(data => {
            if (dialogObj.submittedEventCallback) {
              dialogObj.submittedEventCallback(data);
            }
          });
          this.componentRef.instance.canceledEvent.subscribe(data => {
            if (dialogObj.canceledEventCallback) {
              dialogObj.canceledEventCallback(data);
            }
          });

          this.componentRef.instance.closedEvent.subscribe(data =>
            this.destroyComponentRef(data)
          );
        }
      );
    }
  }

  public ngOnChanges(): void {
    this.componentRef.instance.inputData = this.inputData;
  }

  public ngOnDestroy(): void {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }

    this.destroyComponentRef();
  }

  public destroyComponentRef(elementName?: string): void {
    if (this.componentRef) {
      this.componentRef.destroy();
      this.componentRef = undefined;
    }
  }
}

export class UpsDialogModule {}
