import { Pipe, PipeTransform } from "@angular/core";
import { Column } from "../components/table/table.component";

@Pipe({
  name: "apiCellTitle"
})
export class CellTitlePipe implements PipeTransform {
  public transform(row: any, col: Column): any {
    if (!!col.titleProp) {
      // var value = row[col.titleProp];
      // if (value.length > 20) {
        return row[col.titleProp] || "";
      // }

      // return "";
    } else if (!!row[col.prop] && col.prop !== "action") {
      // value = row[col.prop];
      // if (value.length > 20) {
        return row[col.prop];
      // }

      // return "";
    } else {
      return "";
    }
  }
}
