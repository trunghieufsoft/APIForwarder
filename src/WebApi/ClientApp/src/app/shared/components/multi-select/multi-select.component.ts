import {
  AfterViewInit,
  Component,
  ElementRef,
  EventEmitter,
  forwardRef,
  HostListener,
  Input,
  OnChanges,
  OnInit,
  Output,
  ViewChild,
  ChangeDetectionStrategy,
  ChangeDetectorRef
} from "@angular/core";
import {
  AbstractControl,
  ControlValueAccessor,
  NG_VALIDATORS,
  NG_VALUE_ACCESSOR,
  ValidatorFn,
  Validators
} from "@angular/forms";
import { ApiHttpClient } from "../../common/api-http-client";
import { LoaderService } from "../../services/loader.service";
import { ALL } from "src/app/app.constant";

export const CUSTOM_VALUE_ACCESSOR: any = {
  provide: NG_VALUE_ACCESSOR,
  useExisting: forwardRef(() => MultiSelectComponent),
  multi: true
};
export const CUSTOM_VALIDATORS: any = {
  provide: NG_VALIDATORS,
  useExisting: forwardRef(() => MultiSelectComponent),
  multi: true
};
@Component({
  selector: "app-multi-select",
  templateUrl: "./multi-select.component.html",
  // changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    ApiHttpClient,
    CUSTOM_VALUE_ACCESSOR,
    CUSTOM_VALIDATORS,
    LoaderService
  ]
})
export class MultiSelectComponent
  implements
    OnInit,
    ControlValueAccessor,
    AfterViewInit,
    OnChanges,
    Validators {
  @Input() public isDisabled: boolean = false;
  @Input() public notAvailable: string;
  @Input() public hasAll: boolean = false;
  @Input() public viewProp: string = "id";
  @Input("array") set arrayValue(value: any) {
    this.array = value;
    this.setArray();
  }

  @Input() public size: number = 8;
  @Input() public isBottom: boolean = false;
  @Output() public change: any = new EventEmitter();
  @ViewChild("searchInput") public searchInput: ElementRef;
  public array: any;
  public value: string;
  public open: boolean = false;
  public isAll: boolean;
  public listView: any;
  private inValidFn: any = Validators.nullValidator;
  constructor(
    private _elementRef: ElementRef,
    private changeDetector: ChangeDetectorRef
  ) {}

  public ngAfterViewInit(): void {}
  public ngOnChanges(changes: any): void {
    this.inValidFn = this.validControl();
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
        newArr.push({ id: this.array[i] });
      }
      this.array = newArr;
    }
    this.getValue();
  }

  public clearSearchInput(): void {
    if (this.searchInput && this.searchInput.nativeElement) {
      this.searchInput.nativeElement.value = "";
    }
  }

  public writeValue(obj: any): void {
    this.value = obj;
    this.getValue();
    this.onChange(this.value);
    // this.changeDetector.detectChanges();
  }

  public openOptions(): void {
    if (!this.open) {
      this.listView = this.array;
      this.open = true;
    } else {
      this.open = false;
      this.clearSearchInput();
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
  public checkAll(): void {
    this.isAll = !this.isAll;
    this.listView = this.array;
    for (let i = 0; i < this.array.length; i++) {
      this.array[i].selected = this.isAll;
    }
    if (!this.isAll) {
      this.value = "";
    } else {
      this.value = "All";
      this.getValue();
    }
    this.writeValue(this.value);
    this.change.emit(this.value);
  }

  public onCheck(item: any): void {
    item.selected = !item.selected;
    if (!item.selected) {
      this.isAll = false;
    }
    var value = "";
    var temp = this.array.filter(x => x.selected);
    temp.forEach(item => {
      value += value === "" ? item[this.viewProp] : "," + item[this.viewProp];
    })
    this.value = value;
    this.writeValue(this.value);
    this.change.emit(this.value);
  }

  public showValue(): string {
    if (this.isDisabled) {
      return this.value;
    }
    var hasArray = this.array && this.array.length > 0;
    if (hasArray) {
      var temp = this.array.filter(x => x.selected);
      if (temp.length === this.array.length && this.hasAll && temp.length > 1) {
        this.isAll = true;

        return "All";
      }
      let valueArr: string[] = this.value.split(", ");
      if (this.value.length > 0 && valueArr.length > 0) {
        if (this.array.length === valueArr.length) {
          this.isAll = true;
          this.value = "All";
        }
      }
    } else {
      this.value = "";

      return this.notAvailable || "";
    }
      
    return this.value;
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

  private getValue(): void {
    if (this.isDisabled) {
      return;
    }
    if (this.array) {
      if (this.array.length === 1) {
        this.array[0].selected = true;
      }
      if (this.value === ALL || !this.value) {
        this.array.forEach(item => {
          item.selected = this.value === ALL;
        })
      } else if (this.value) {
        var pieces = this.value.toString().split(",");
        pieces.forEach(item => {
          if (item !== "") {
            var index = this.array.findIndex(x => x[this.viewProp] === item.trim());
            if (this.array[index]) {
              this.array[index].selected = true;
            }
          }
        });
      }

      var value: string = "";
      var temp = this.array.filter(x => x.selected);
      temp.forEach(item => {
        value += value === "" ? item[this.viewProp] : ", " + item[this.viewProp];
      });
      this.value = value;
    }
  }
}
