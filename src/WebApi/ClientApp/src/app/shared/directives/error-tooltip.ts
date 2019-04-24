import { CommonModule } from "@angular/common";
import {
  AfterViewInit,
  Directive,
  ElementRef,
  Input,
  NgModule,
  NgZone,
  OnDestroy,
  Optional,
  Self
} from "@angular/core";
import { FormControlName } from "@angular/forms";
import { Subscription, of } from "rxjs";
import { ErrorMessageService } from "../services/error-message.service";
import { DomHandler } from "../components/dom/domhandler";

@Directive({
  // tslint:disable-next-line:directive-selector
  selector: "[errorTooltip]",
  providers: [DomHandler]
})
export class ErrorTooltipDirective implements AfterViewInit, OnDestroy {
  @Input()
  public tooltipPosition: string = "right";

  @Input()
  public tooltipEvent: string = "hover";

  @Input()
  public appendTo: any = "body";

  @Input()
  public itemName: string;

  @Input()
  public positionStyle: string;

  @Input()
  public tooltipStyleClass: string;

  @Input()
  public escape: boolean = true;

  @Input()
  set resetTooltip(reset: Boolean) {
    if (reset) {
      this.resetValidation();
    }
  }

  public container: any;

  public styleClass: string;

  public tooltipText: any;

  public active: boolean;

  public mouseEnterListener: Function;

  public mouseLeaveListener: Function;

  public clickListener: Function;

  public focusListener: Function;

  public blurListener: Function;

  public resizeListener: any;

  private _text: string;

  private _errorMessageSubscription: Subscription;

  constructor(
    private el: ElementRef,
    private domHandler: DomHandler,
    private zone: NgZone,
    private errorMessageService: ErrorMessageService,
    @Self()
    @Optional()
    private formControlName: FormControlName
  ) {}

  public ngAfterViewInit(): void {
    this.zone.runOutsideAngular(() => {
      if (this.tooltipEvent === "hover") {
        this.mouseEnterListener = this.onMouseEnter.bind(this);
        this.mouseLeaveListener = this.onMouseLeave.bind(this);
        this.clickListener = this.onClick.bind(this);
        this.el.nativeElement.addEventListener(
          "mouseenter",
          this.mouseEnterListener
        );
        this.el.nativeElement.addEventListener(
          "mouseleave",
          this.mouseLeaveListener
        );
        this.el.nativeElement.addEventListener("click", this.clickListener);
      } else if (this.tooltipEvent === "focus") {
        this.focusListener = this.onFocus.bind(this);
        this.blurListener = this.onBlur.bind(this);
        this.el.nativeElement.addEventListener("focus", this.focusListener);
        this.el.nativeElement.addEventListener("blur", this.blurListener);
      }

      if (this.formControlName && this.formControlName.control) {
        this.formControlName.control.statusChanges.subscribe(status => {
          if (this.formControlName.control.invalid) {
            var errors = this.formControlName.control.errors;
            this._errorMessageSubscription = this.errorMessageService
              .getErrorMessage(errors)
              .subscribe(msg => {
                if (
                  Object.keys(errors)[0] === "required" || Object.keys(errors)[0] === "requiredSelect"
                ) {
                  var label = this.getFormLabel();
                  msg = msg + " " + label;
                  this._text = msg;
                } else {
                  this._text = msg;
                }
                this.active = true;
                this.toggleTooltip();
              });
          } else {
            this._text = "";
            this.active = true;
            this.toggleTooltip();
          }
        });
      }
    });
  }

  public getFormLabel(): string {
    var label = "this filed";
    let element = this.el.nativeElement;
    if (!!this.itemName) {
      return this.itemName;
    }
    if (!!element.previousElementSibling) {
      label = element.previousElementSibling.innerHTML;
    } else if (element.parentElement.previousElementSibling) {
      label = element.parentElement.previousElementSibling.innerHTML;
    }

    return label;
  }

  public resetValidation(): void {
    this._text = "";
    this.active = true;
    this.toggleTooltip();
  }

  public onMouseEnter(e: Event): void {
    if (!this.container) {
      this.activate();
    }
  }

  public onMouseLeave(e: Event): void {
    this.deactivate();
  }

  public onFocus(e: Event): void {
    this.activate();
  }

  public onBlur(e: Event): void {
    this.deactivate();
  }

  public onClick(e: Event): void {
    this.deactivate();
  }

  public activate(): void {
    this.active = true;
    this.show();
  }

  public deactivate(): void {
    this.active = false;
    this.hide();
  }

  public toggleTooltip(): void {
    if (this.active) {
      if (this._text) {
        if (this.container && this.container.offsetParent) {
          this.updateText();
        }
      } else {
        this.hide();
      }
    }
  }

  public create(): void {
    this.container = document.createElement("div");

    const tooltipArrow = document.createElement("div");
    tooltipArrow.className = "ui-tooltip-arrow";
    this.container.appendChild(tooltipArrow);

    this.tooltipText = document.createElement("div");
    this.tooltipText.className = "ui-tooltip-text ui-shadow ui-corner-all";

    this.updateText();

    if (this.positionStyle) {
      this.container.style.position = this.positionStyle;
    }

    this.container.appendChild(this.tooltipText);

    if (this.appendTo === "body") {
      document.body.appendChild(this.container);
    } else if (this.appendTo === "target") {
      this.domHandler.appendChild(this.container, this.el.nativeElement);
    } else {
      this.domHandler.appendChild(this.container, this.appendTo);
    }
    this.container.style.display = "inline-block";
  }

  public show(): void {
    if (!this._text) {
      return;
    }

    this.create();
    this.align();
    this.domHandler.fadeIn(this.container, 250);

    this.container.style.zIndex = 9999;

    this.bindDocumentResizeListener();
  }

  public hide(): void {
    this.remove();
  }

  public updateText(): void {
    if (this.escape) {
      this.tooltipText.innerHTML =
        '<i class="glyphicon glyphicon-exclamation-sign"></i> ';
      this.tooltipText.appendChild(document.createTextNode(this._text));
    } else {
      this.tooltipText.innerHTML = this._text;
    }
  }

  public align(): void {
    const position = this.tooltipPosition;

    switch (position) {
      case "top":
        this.alignTop();
        if (this.isOutOfBounds()) {
          this.alignBottom();
        }
        break;

      case "bottom":
        this.alignBottom();
        if (this.isOutOfBounds()) {
          this.alignTop();
        }
        break;

      case "left":
        this.alignLeft();
        if (this.isOutOfBounds()) {
          this.alignRight();

          if (this.isOutOfBounds()) {
            this.alignTop();

            if (this.isOutOfBounds()) {
              this.alignBottom();
            }
          }
        }
        break;

      case "right":
        this.alignRight();
        if (this.isOutOfBounds()) {
          this.alignLeft();

          if (this.isOutOfBounds()) {
            this.alignTop();

            if (this.isOutOfBounds()) {
              this.alignBottom();
            }
          }
        }
        break;

      default:
        break;
    }
  }

  public getHostOffset(): any {
    const offset = this.el.nativeElement.getBoundingClientRect();
    const targetLeft = offset.left + this.domHandler.getWindowScrollLeft();
    const targetTop = offset.top + this.domHandler.getWindowScrollTop();

    return { left: targetLeft, top: targetTop };
  }

  public alignRight(): void {
    this.preAlign("right");
    const hostOffset = this.getHostOffset();
    const left =
      hostOffset.left + this.domHandler.getOuterWidth(this.getNativeElement());
    const top =
      hostOffset.top +
      (this.domHandler.getOuterHeight(this.getNativeElement()) -
        this.domHandler.getOuterHeight(this.container)) /
        2;
    this.container.style.left = left + "px";
    this.container.style.top = top - 60 + "px";
  }

  public alignLeft(): void {
    this.preAlign("left");
    const hostOffset = this.getHostOffset();
    const left =
      hostOffset.left - this.domHandler.getOuterWidth(this.container);
    const top =
      hostOffset.top +
      (this.domHandler.getOuterHeight(this.getNativeElement()) -
        this.domHandler.getOuterHeight(this.container)) /
        2;
    this.container.style.left = left + "px";
    this.container.style.top = top + "px";
  }

  public alignTop(): void {
    this.preAlign("top");
    const hostOffset = this.getHostOffset();
    const left =
      hostOffset.left +
      (this.domHandler.getOuterWidth(this.getNativeElement()) -
        this.domHandler.getOuterWidth(this.container)) /
        2;
    const top = hostOffset.top - this.domHandler.getOuterHeight(this.container);
    this.container.style.left = left + "px";
    this.container.style.top = top + "px";
  }

  public alignBottom(): void {
    this.preAlign("bottom");
    const hostOffset = this.getHostOffset();
    const left =
      hostOffset.left +
      (this.domHandler.getOuterWidth(this.getNativeElement()) -
        this.domHandler.getOuterWidth(this.container)) /
        2;
    const top =
      hostOffset.top + this.domHandler.getOuterHeight(this.getNativeElement());
    this.container.style.left = left + "px";
    this.container.style.top = top + "px";
  }

  public preAlign(position: string): void {
    this.container.style.left = -999 + "px";
    this.container.style.top = -999 + "px";

    const defaultClassName = "ui-tooltip ui-widget ui-tooltip-" + position;
    this.container.className = this.tooltipStyleClass
      ? defaultClassName + " " + this.tooltipStyleClass
      : defaultClassName;
  }

  public getNativeElement(): any {
    if (this.el.nativeElement.localName === "p-calendar") {
      return this.el.nativeElement.querySelector(".ui-inputtext");
    }

    if (this.el.nativeElement.localName === "p-dropdown") {
      return this.el.nativeElement.querySelector(".ui-inputtext");
    }

    return this.el.nativeElement;
  }

  public isOutOfBounds(): boolean {
    const offset = this.container.getBoundingClientRect();
    const targetTop = offset.top;
    const targetLeft = offset.left;
    const width = this.domHandler.getOuterWidth(this.container);
    const height = this.domHandler.getOuterHeight(this.container);
    const viewport = this.domHandler.getViewport();

    return (
      targetLeft + width > viewport.width ||
      targetLeft < 0 ||
      targetTop < 0 ||
      targetTop + height > viewport.height
    );
  }

  public onWindowResize(e: Event): void {
    this.hide();
  }

  public bindDocumentResizeListener(): void {
    this.zone.runOutsideAngular(() => {
      this.resizeListener = this.onWindowResize.bind(this);
      window.addEventListener("resize", this.resizeListener);
    });
  }

  public unbindDocumentResizeListener(): void {
    if (this.resizeListener) {
      window.removeEventListener("resize", this.resizeListener);
      this.resizeListener = undefined;
    }
  }

  public unbindEvents(): void {
    if (this.tooltipEvent === "hover") {
      this.el.nativeElement.removeEventListener(
        "mouseenter",
        this.mouseEnterListener
      );
      this.el.nativeElement.removeEventListener(
        "mouseleave",
        this.mouseLeaveListener
      );
      this.el.nativeElement.removeEventListener("click", this.clickListener);
    } else if (this.tooltipEvent === "focus") {
      this.el.nativeElement.removeEventListener("focus", this.focusListener);
      this.el.nativeElement.removeEventListener("blur", this.blurListener);
    }

    this.unbindDocumentResizeListener();
  }

  public remove(): void {
    if (this.container && this.container.parentElement) {
      if (this.appendTo === "body") {
        document.body.removeChild(this.container);
      } else if (this.appendTo === "target") {
        this.el.nativeElement.removeChild(this.container);
      } else {
        this.domHandler.removeChild(this.container, this.appendTo);
      }
    }

    this.container = undefined;
  }

  public ngOnDestroy(): void {
    this.unbindEvents();
    this.remove();

    if (this._errorMessageSubscription) {
      this._errorMessageSubscription.unsubscribe();
    }
  }
}

@NgModule({
  imports: [CommonModule],
  exports: [ErrorTooltipDirective],
  declarations: [ErrorTooltipDirective]
})
export class ErrorTooltipModule {}
