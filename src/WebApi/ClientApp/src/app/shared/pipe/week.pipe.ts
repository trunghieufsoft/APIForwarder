import { Pipe, PipeTransform } from "@angular/core";
import { CONSTANT } from "../common/constant";
import { DatePipe } from "@angular/common";

@Pipe({
  name: "apiWeek"
})
export class WeekPipe implements PipeTransform {
  constructor(private datePipe: DatePipe) {}
  public transform(week: any): any {
    if (week) {
      var weekSplit = week.split(",");
      var w = parseInt(weekSplit[0]);
      var y = parseInt(weekSplit[1]);
      var d = (w - 1) * 7 - 1;
      var start = new Date(y, 0, d);
      var end = new Date(y, 0, d);
      end.setDate(end.getDate() + 6);

      return (
        "Week " +
        w +
        ", " +
        this.datePipe.transform(start, CONSTANT.format.date) +
        "-" +
        this.datePipe.transform(end, CONSTANT.format.date)
      );
    }

    return "";
  }
}
