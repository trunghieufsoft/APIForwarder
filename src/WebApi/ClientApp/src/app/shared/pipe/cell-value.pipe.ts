import { Pipe, PipeTransform } from "@angular/core";
import { Column } from "../components/table/table.component";
import { DomSanitizer } from "@angular/platform-browser";

@Pipe({
  name: "apiCellValue"
})
export class CellValuePipe implements PipeTransform {
  constructor(private sanitizer: DomSanitizer) {}

  public transform(row: any, col: Column): any {
    if (row[col.prop] === 0) {
      return "0";
    }
    if (!!row[col.prop]) {
      if (col.html) {
        return this.sanitizer.bypassSecurityTrustHtml(row[col.prop]) || "";
      }

      return row[col.prop];
    } else {
      return "";
    }
  }
}
