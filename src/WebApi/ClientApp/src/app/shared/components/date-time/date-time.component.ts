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
  ChangeDetectionStrategy,
  ChangeDetectorRef
} from "@angular/core";
import {
  ControlValueAccessor,
  NG_VALIDATORS,
  NG_VALUE_ACCESSOR,
  Validators,
  AbstractControl,
  ValidatorFn
} from "@angular/forms";

export const CUSTOM_VALUE_ACCESSOR: any = {
  provide: NG_VALUE_ACCESSOR,
  useExisting: forwardRef(() => DateTimeComponent),
  multi: true
};
export const CUSTOM_VALIDATORS: any = {
  provide: NG_VALIDATORS,
  useExisting: forwardRef(() => DateTimeComponent),
  multi: true
};
@Component({
  selector: "app-date-time",
  templateUrl: "./date-time.component.html",
  styleUrls: ["./date-time.component.css"],
  providers: [CUSTOM_VALUE_ACCESSOR, CUSTOM_VALIDATORS],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DateTimeComponent
  implements
    OnInit,
    ControlValueAccessor,
    AfterViewInit,
    OnChanges,
    Validators {
  @Input() public hasTime: boolean = false;
  @Input() public hasDate: boolean = true;
  @Input() public isDisabled: boolean = false;
  @Input() public date: Date = null;
  @Output() public change: any = new EventEmitter();
  public openDate: boolean = false;
  public dateName: any = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];
  public monthName: any = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec"
  ];
  public hourName: any = this.getArrayNumber(0, 23, 2);
  public minuteName: any = this.getArrayNumber(0, 59, 2);
  public yearName: any = this.getArrayNumber(2000, 2100, 4);
  public day: string;
  public month: string;
  public year: string;
  public minute: string = "00";
  public hour: string = "00";
  public monthIndex: number;
  public yearIndex: number;
  public minuteIndex: number;
  public hourIndex: number;
  private _days: any = [];
  private _initDate: Date;
  private inValidFn: any = Validators.nullValidator;
  constructor(
    private _elementRef: ElementRef,
    private changeDetector: ChangeDetectorRef
  ) {}

  get days(): any {
    return this._days;
  }
  get initDate(): any {
    return this._initDate;
  }
  public ngOnInit(): void {
    this._initDate = new Date();
    if (this.date instanceof Date) {
      this._initDate = this.date;
    }
    this.yearIndex = this.yearName.findIndex(
      x => x === this._initDate.getFullYear() + ""
    );
    this.monthIndex = this._initDate.getMonth();
    this.setDays();
  }

  public writeValue(obj: any, fromInput: boolean = false): void {
    this.date = this.getDate(obj, fromInput);
    this.setHourAndMinute(this.date);
    this.onChange(this.date);
    this.change.emit(this.date);
    if (this.date) {
      this.yearIndex = this.yearName.findIndex(
        x => x === this.date.getFullYear() + ""
      );
      this.monthIndex = this.date.getMonth();
      this.hourIndex = this.date.getHours();
      this.minuteIndex = this.date.getMinutes();
    }
    this.changeDetector.detectChanges();
  }

  public registerOnChange(fn: any): void {
    this.onChange = fn;
  }
  public registerOnTouched(fn: any): void {}
  public setDisabledState?(isDisabled: boolean): void {}
  public ngOnChanges(changes: any): void {
    this.inValidFn = this.validControl();
  }
  public ngAfterViewInit(): void {}
  public validate(control: AbstractControl): { [key: string]: any } {
    return this.inValidFn(control);
  }
  @HostListener("document:click", ["$event.target"])
  @HostListener("touch", ["$event.target"])
  public onClick(targetElement: any): void {
    const clickedInside = this._elementRef.nativeElement.contains(
      targetElement
    );
    if (!clickedInside) {
      this.openDate = false;
    }
  }

  @HostListener("window:scroll", [])
  public onWindowScroll(): void {
    const elemRect = this._elementRef.nativeElement.getBoundingClientRect();
    if (elemRect.top < 150) {
      if (
        this.hasTime &&
        this.date &&
        Object.prototype.toString.call(this.date) === "[object Date]" &&
        this.hour &&
        this.minute
      ) {
        this.date.setHours(this.hourName[this.hour]);
        this.date.setMinutes(this.minute[this.minute]);
      }
      this.openDate = false;
    }
  }

  public inputDate(e: any): void {
    this.writeValue(e.target.value, true);
  }

  public inputYear(e: any): void {
    if (e.target.value.length === 4) {
      this.setYearInit(e.target.value);
    }
  }

  public inputMonth(e: any): void {
    if (e.target.value.length === 3) {
      var index = this.monthName.indexOf(e.target.value);
      this.setMonthInit(index);
    }
  }

  public inputHour(e: any): void {
    this.hour = e.target.value;
    if ((!this.hasDate && !this.hour) || this.hour === "") {
      this.date = null;
    } else {
      if (!this.date) {
        this.date = new Date();
        this.date.setMinutes(parseInt(this.minute));
      }
      this.date.setHours(e.target.value);
    }
    this.writeValue(this.date);
  }

  public inputMinute(e: any): void {
    this.minute = e.target.value;
    if ((!this.hasDate && !this.hour) || this.hour === "") {
      this.date = null;
    } else {
      if (!this.date) {
        this.date = new Date();
        this.date.setHours(parseInt(this.hour));
      }
      this.date.setMinutes(e.target.value);
    }
    this.writeValue(this.date);
  }

  public openDatePicker(): void {
    this.openDate = !this.openDate;
    if (this.openDate) {
      if (this.date) {
        this.monthIndex = this.date.getMonth();
        this.yearIndex = this.yearName.findIndex(
          x => x === this.date.getFullYear() + ""
        );
      }
      this.setDays();
      this.changeDetector.detectChanges();
    }
  }
  public isCurrent(date: Date): boolean {
    return this.dateEqual(date, new Date());
  }

  public isSelected(date: Date): boolean {
    return this.dateEqual(date, this.date);
  }

  public setMonthInit(e: any): void {
    var month = this.monthName.indexOf(e.id);
    this._initDate.setMonth(month);
    this.setDays();
  }

  public setYearInit(e: any): void {
    var year = e.id;
    this._initDate.setFullYear(year);
    this.setDays();
  }

  public addInitMonth(x: number): void {
    this._initDate.setMonth(this._initDate.getMonth() + x);
    this.monthIndex = this._initDate.getMonth();
    this.yearIndex = this.yearName.findIndex(
      x => x === this._initDate.getFullYear() + ""
    );
    this.setDays();
  }

  public setHourInit(e: any): void {
    var hour = e.id;
    this._initDate.setHours(hour);
    this._initDate.setMinutes(this.date ? this.date.getMinutes() : 0);
    this.selectDate(this._initDate);
    this.hour = hour + "";
  }

  public setMinuteInit(e: any): void {
    var minute = e.id;
    this._initDate.setHours(this.date ? this.date.getHours() : 0);
    this._initDate.setMinutes(minute);
    this.selectDate(this._initDate);
    this.minute = minute + "";
  }

  public onDateClick(date: any): void {
    if (!date || date === "") {
      return;
    } else {
      this.selectDate(date);
    }
  }

  public selectDate(date: Date): void {
    this.date = date;
    this.openDate = false;
    this.writeValue(date);
  }

  public isValid(): boolean {
    return (
      this.date && typeof this.date !== "string" && !isNaN(this.date.getTime())
    );
  }

  private dateEqual(d1: Date, d2: Date): boolean {
    if (d1 && d2 && d1 instanceof Date && d2 instanceof Date) {
      return (
        d1.getFullYear() === d2.getFullYear() &&
        d1.getMonth() === d2.getMonth() &&
        d1.getDate() === d2.getDate()
      );
    }

    return false;
  }

  private getArrayNumber(from: number, to: number, length: number): any {
    var array = [];
    var appendZero = "0000000";
    for (let i = from; i <= to; i++) {
      array.push((appendZero + i).slice(-length));
    }

    return array;
  }
  private setDays(): void {
    if (!this._initDate) {
      this._initDate = new Date();
    }
    const month = this._initDate.getMonth();
    const year = this._initDate.getFullYear();
    const firstDay = new Date(year, month, 1).getDay();
    let start = new Date(year, month, 1);
    const end = new Date(year, month + 1, 0);
    const days = [];
    for (let i = 0; i <= 5; i++) {
      days[i] = [];
    }
    for (let i = 0; i < firstDay; i++) {
      days[0].push(null);
    }
    while (start <= end) {
      const week = Math.ceil((start.getDate() + firstDay) / 7) - 1;
      days[week].push(start);
      start = new Date(
        start.getFullYear(),
        start.getMonth(),
        start.getDate() + 1
      );
    }
    this._days = days;
  }
  private onChange = (m: any) => {};

  private toISOStrDate(date: string): string {
    var arr = date.split("/");
    if (arr.length === 3) {
      return arr[2] + "-" + arr[1] + "-" + arr[0].replace(/\D+/g, "");
    }

    return null;
  }

  private getDate(date: any, fromInput: boolean): any {
    if (!date) {
      return null;
    }
    if (fromInput) {
      var arr = date.split("/");
      if (arr.length === 3 && arr[2].length === 4) {
        var d = new Date(this.toISOStrDate(date));
        if (d.toString() === "Invalid Date") {
          return date;
        }

        return d;
      } else {
        return date;
      }
    } else {
      if (date && typeof date === "string") {
        var d2 = new Date(date);
        if (d2.toString() === "Invalid Date") {
          return date;
        }

        return d2;
      }
      if (Object.prototype.toString.call(date) === "[object Date]") {
        return date;
      }
    }
  }

  private setHourAndMinute(d: Date): void {
    if (d && d instanceof Date) {
      this.hour = this.hourName[d.getHours()];
      this.minute = this.minuteName[d.getMinutes()];
    }
  }
  private validControl(): ValidatorFn {
    return (control: AbstractControl): { [key: string]: any } | null => {
      const controlValue = control.value;
      const validDateDuration =
        control.errors && control.errors.validDateDuration;
      if (validDateDuration) {
        return { validDateDuration: { value: controlValue } };
      }
      const validDateCommitTime =
        control.errors && control.errors.validDateCommitTime;
      if (validDateCommitTime) {
        return { validDateCommitTime: { value: controlValue } };
      }
      const required = control.errors && control.errors.required;
      if (required && (controlValue == null || controlValue === "")) {
        return { required: { value: controlValue } };
      }
      const invalid = control.errors && control.errors.invalidDate;
      if (invalid) {
        return { invalidDate: { value: controlValue } };
      }

      return null;
    };
  }
}
