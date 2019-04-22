import { Directive, ElementRef, HostListener, Input } from "@angular/core";

@Directive({
  selector: "[appDate]"
})
export class DateDirective {
  @Input("appDate") public dateUnit: string;
  private monthName: any = [
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
  constructor(private el: ElementRef) {}

  @HostListener("keypress", ["$event"])
  public onKeyPress(e: KeyboardEvent): any {
    let current: string = this.el.nativeElement.value;
    let index = this.el.nativeElement.selectionStart;
    var x = e.charCode || e.keyCode;
    let next: string =
      current.slice(0, index) + e.key + current.slice(index, current.length);
    var length: number = this.el.nativeElement.getAttribute("maxlength") || 4;
    if (this.dateUnit === "date") {
      if (x === 47 || (x >= 48 && x <= 57) || (x >= 96 && x <= 105)) {
        if (!this.checkFormat(next)) {
          e.preventDefault();
        }
      } else {
        e.preventDefault();
      }
    }
    if (current.length < length) {
      if (
        this.dateUnit === "month" &&
        this.monthName.filter(x => x.indexOf(next) >= 0).length <= 0
      ) {
        e.preventDefault();
      }

      const value = parseInt(next);
      if (this.dateUnit === "hour" && value > 23) {
        e.preventDefault();
      }
      if (this.dateUnit === "minute" && value > 59) {
        e.preventDefault();
      }
    }
  }

  private checkFormat(date: string): boolean {
    var temp = date;
    var arr = temp.split("/");
    if (arr[0].length > 2) {
      arr[0] = arr[0].replace(/\D+/g, "");
    }
    if (
      (arr[0].length < 2 || parseInt(arr[0]) <= 31) &&
      (!arr[1] || (arr[1].length < 2 || parseInt(arr[1]) <= 12)) &&
      (!arr[2] || (arr[2].length < 4 || parseInt(arr[2]) <= 9999))
    ) {
      if (
        arr[0] &&
        arr[0].length === 2 &&
        arr[1] &&
        arr[1].length === 2 &&
        arr[2] &&
        arr[2].length === 4
      ) {
        var strDate = arr[2] + "-" + arr[1] + "-" + arr[0];

        var strDate2 = new Date(strDate).toISOString();

        return strDate2.slice(0, strDate.length) === strDate;
      } else {
        return true;
      }
    }

    return false;
  }
}
