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
  AbstractControl,
  ControlValueAccessor,
  NG_VALIDATORS,
  NG_VALUE_ACCESSOR,
  ValidatorFn,
  Validators
} from "@angular/forms";
import { DatePipe } from "@angular/common";
import { WeekPipe } from "../../pipe/week.pipe";

export const CUSTOM_VALUE_ACCESSOR: any = {
  provide: NG_VALUE_ACCESSOR,
  useExisting: forwardRef(() => WeekPickerComponent),
  multi: true
};
export const CUSTOM_VALIDATORS: any = {
  provide: NG_VALIDATORS,
  useExisting: forwardRef(() => WeekPickerComponent),
  multi: true
};
@Component({
  selector: "app-week",
  templateUrl: "./week-picker.component.html",
  styleUrls: ["./week-picker.component.css"],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [CUSTOM_VALUE_ACCESSOR, CUSTOM_VALIDATORS, DatePipe, WeekPipe]
})
export class WeekPickerComponent
  implements
    OnInit,
    ControlValueAccessor,
    AfterViewInit,
    OnChanges,
    Validators {
  @Input() public isDisabled: boolean = false;
  @Input() public week: string = null;
  @Output() public change: any = new EventEmitter();
  public current: string =
    this.getWeeksOfDate(new Date()) + ", " + new Date().getFullYear();
  public openDate: boolean = false;
  public openMonth: boolean = false;
  public openYear: boolean = false;
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
  public yearName: any = this.getArrayNumber(2000, 2100, 4);
  public month: number = new Date().getMonth();
  public year: number = new Date().getFullYear();
  private _weeks: any = [];
  private inValidFn: any = Validators.nullValidator;
  constructor(
    private _elementRef: ElementRef,
    private changeDetect: ChangeDetectorRef
  ) {}

  get weeks(): any {
    return this._weeks;
  }
  public ngOnInit(): void {
    this.setWeeks();
  }

  public writeValue(obj: any): void {
    this.week = obj;
    this.changeDetect.detectChanges();
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
      this.openDate = false;
    }
  }

  public inputWeek(e: any): void {
    if (e.target.value.length === 7) {
      this.selectWeek(e.target.value);
    } else {
      this.change.emit(null);
    }
  }

  public inputYear(e: any): void {
    if (e.target.value.length === 4) {
      this.setYear(e.target.value);
    }
  }

  public inputMonth(e: any): void {
    if (e.target.value.length === 3) {
      var index = this.monthName.indexOf(e.target.value);
      this.setMonth(index);
    }
  }

  public setMonth(month: number): void {
    this.month = month;
    this.setWeeks();
    this.openMonth = false;
  }

  public openDatePicker(): void {
    this.openDate = !this.openDate;
    if (this.openDate) {
      this.openMonth = false;
      this.openYear = false;
      var obj = this.weekDate(this.week);
      this.month = obj.start.getMonth();
      this.year = obj.start.getFullYear();
      this.setWeeks();
    }
    this.changeDetect.detectChanges();
  }

  public setYear(year: number): void {
    this.year = year;
    this.setWeeks();
    this.openYear = false;
  }

  public selectWeek(week: string): void {
    this.openDate = false;
    this.change.emit(week);
    this.writeValue(week);
    this.onChange(week);
  }

  private getArrayNumber(from: number, to: number, length: number): any {
    var array = [];
    var appendZero = "0000000";
    for (let i = from; i <= to; i++) {
      array.push((appendZero + i).slice(-length));
    }

    return array;
  }
  private setWeeks(): void {
    const firstDay = new Date(this.year, this.month, 1).getDay();
    let start = new Date(this.year, this.month, 1);
    const end = new Date(this.year, this.month + 1, 0);
    const weeks = [];
    while (start <= end) {
      const week = Math.ceil((start.getDate() + firstDay) / 7) - 1;
      weeks[week] = this.getWeeksOfDate(start) + ", " + start.getFullYear();
      start = new Date(
        start.getFullYear(),
        start.getMonth(),
        start.getDate() + 7
      );
    }
    if (start.getMonth() > end.getMonth()) {
      const week = Math.ceil((end.getDate() + firstDay) / 7) - 1;
      var data = this.getWeeksOfDate(end) + ", " + end.getFullYear();
      if (weeks[week - 1] !== data) {
        weeks[week] = data;
      }
    }
    this._weeks = weeks;
  }
  private onChange = (m: any) => {};

  private getWeeksOfDate(d: Date): number {
    var firstJan: Date = new Date(d.getFullYear(), 0, 1);

    return Math.ceil(
      ((d.getTime() - firstJan.getTime()) / 86400000 + firstJan.getDay()) / 7
    );
  }

  private weekDate(week: string): any {
    if (week) {
      var weekSplit = week.split(",");
      var w = parseInt(weekSplit[0]);
      var y = parseInt(weekSplit[1]);
      var d = (w - 1) * 7 - 1;
      var start = new Date(y, 0, d);
      var end = new Date(y, 0, d);
      end.setDate(end.getDate() + 6);

      return { week: w, start: start, end: end };
    }

    return { week: null, start: null, end: null };
  }

  private validControl(): ValidatorFn {
    return (control: AbstractControl): { [key: string]: any } | null => {
      const controlValue = control.value;
      const validWeekDuration =
        control.errors && control.errors.validWeekDuration;
      if (validWeekDuration) {
        return { validWeekDuration: { value: controlValue } };
      }
      const required = control.errors && control.errors.required;
      if (required && (controlValue == null || controlValue === "")) {
        return { required: { value: controlValue } };
      }

      return null;
    };
  }
}
