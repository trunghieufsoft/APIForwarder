import {
  AfterViewInit,
  ChangeDetectorRef,
  Component,
  ElementRef,
  EventEmitter,
  forwardRef,
  HostListener,
  Input,
  OnChanges,
  OnInit,
  Output,
  ViewChild
} from "@angular/core";
import {
  AbstractControl,
  ControlValueAccessor,
  NG_VALIDATORS,
  NG_VALUE_ACCESSOR,
  Validator,
  ValidatorFn,
  Validators
} from "@angular/forms";
import { ApiHttpClient } from "../../common/api-http-client";
import { LoaderService } from "../../services/loader.service";
import { ALL } from 'src/app/app.constant';

export const CUSTOM_VALUE_ACCESSOR: any = {
  provide: NG_VALUE_ACCESSOR,
  useExisting: forwardRef(() => SingleSelectComponent),
  multi: true
};
export const CUSTOM_VALIDATORS: any = {
  provide: NG_VALIDATORS,
  useExisting: forwardRef(() => SingleSelectComponent),
  multi: true
};
@Component({
  selector: "app-single-select",
  templateUrl: "./single-select.component.html",
  // changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    ApiHttpClient,
    CUSTOM_VALUE_ACCESSOR,
    CUSTOM_VALIDATORS,
    LoaderService
  ]
})
export class SingleSelectComponent
  implements OnInit, ControlValueAccessor, AfterViewInit, OnChanges, Validator {
  @Input() public isDisabled: boolean = false;
  @Input() public hasAll: boolean = false;
  @Input() public viewProp: string = "name";
  @Input() public valueProp: string = "id";
  @Input() public suggest: boolean = true;
  @Input() public selectedIndex: number;
  @Input() public notAvailable: string;
  @ViewChild("searchInput") public searchInput: ElementRef;
  @Input("array") set arrayValue(value: any) {
    this.array = value;
    this.setArray();
  }
  @Input("selectedIndex") set selectedIndexValue(value: any) {
    if (this.array && this.array.length >= value) {
      this.item = this.array[value];
    }
  }
  @Input() public size: number = 8;
  @Input() public isBottom: boolean = false;
  @Output() public change: any = new EventEmitter();
  public array: any;
  public item: any = null;
  public open: boolean = false;
  public listView: any;
  private inValidFn: any = Validators.nullValidator;
  constructor(
    private _elementRef: ElementRef,
    private changeDetector: ChangeDetectorRef
  ) {}

  public clearSearchInput(): void {
    if (this.searchInput && this.searchInput.nativeElement) {
      this.searchInput.nativeElement.value = "";
    }
  }
  public ngAfterViewInit(): void {}
  public ngOnChanges(changes: any): void {
    this.inValidFn = this.validControl();
    if (
      changes.arrayValue &&
      changes.arrayValue.currentValue !== changes.arrayValue.previousValue
    ) {
      this.getValue();
      this.writeValue(this.item);
    }
  }
  public registerOnChange(fn: any): void {
    this.onChange = fn;
  }
  public registerOnTouched(fn: any): void {}
  public setDisabledState?(isDisabled: boolean): void {}
  public validate(control: AbstractControl): { [key: string]: any } {
    return this.inValidFn(control);
  }
  public ngOnInit(): void {}

  public setArray(): void {
    if (
      this.array &&
      this.array.length > 0 &&
      typeof this.array[0] === "string"
    ) {
      var newArr = [];
      for (let i = 0; i < this.array.length; i++) {
        let obj: any = {};
        obj[this.viewProp] = this.array[i];
        obj[this.valueProp] = this.array[i];
        newArr.push(obj);
      }
      this.array = newArr;
    }
    this.getValue();
    this.changeDetector.detectChanges();
  }
  public writeValue(obj: any): void {
    this.item = obj;
    this.onChange(this.item);
  }

  public openOptions(): void {
    if (!this.open) {
      this.listView = this.array;
      this.open = true;
    } else {
      this.clearSearchInput();
      this.open = false;
    }
  }

  public filterChange(e: any): void {
    const value = (e.target.value || "").toLowerCase();
    this.listView = this.array.filter(
      x => x[this.viewProp].toLowerCase().indexOf(value) !== -1
    );
  }

  public height(): any {
    if (!this.listView || this.size > this.listView.length) {
      return "auto";
    } else {
      return this.size * 30 + "px";
    }
  }

  public onCheck(item: any): void {
    this.writeValue(item);
    this.open = false;
    this.change.emit(this.item);
  }

  public arrowDown(): void {
    this.open = true;
    this._elementRef.nativeElement.querySelector(".optionItem").focus();
  }

  public arrowDownOption(e: any): void {
    let next = new ElementRef(e.target.nextSibling);
    if (next && next.nativeElement) {
      next.nativeElement.focus();
    }
  }

  @HostListener("document:click", ["$event.target"])
  @HostListener("touch", ["$event.target"])
  public onClick(targetElement: any): void {
    const clickedInside = this._elementRef.nativeElement.contains(
      targetElement
    );
    if (!clickedInside) {
      this.open = false;
      this.clearSearchInput();
    }
  }
  public showValue(): string {
    var hasArray = this.array && this.array.length > 0;
    if (!this.item || !this.array) {
      return this.notAvailable || "";
    }
    if (hasArray && this.item === ALL) {
      return ALL;
    }
    if (hasArray) {
      return !!this.item[this.viewProp]
        ? this.item[this.viewProp]
        : this.item + "";
    } else {
      return this.notAvailable || "";
    }
  }
  private getValue(): void {
    var hasArray = this.array && this.array.length > 0;
    if (!this.item) {
      if (hasArray) {
        this.item = this.hasAll ? ALL : this.array[0];
      }

      return;
    }
    if (this.item !== ALL && hasArray) {
      var key = !!this.item[this.valueProp]
        ? this.item[this.valueProp]
        : this.item;
      var nItem = this.array.filter(
        x => x[this.valueProp] + "" === key + ""
      )[0];
      this.item = !nItem ? this.item : nItem;
    }
  }
  private onChange = (m: any) => {};
  private validControl(): ValidatorFn {
    return (control: AbstractControl): { [key: string]: any } | null => {
      const controlValue = control.value;
      const required =
        control.errors &&
        (control.errors.required || control.errors.requiredSelect);
      if (required && (controlValue == null || controlValue === "")) {
        return { requiredSelect: { value: controlValue } };
      }

      return null;
    };
  }
}
