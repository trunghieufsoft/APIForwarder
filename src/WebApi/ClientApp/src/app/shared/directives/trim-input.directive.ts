import { Directive, ElementRef, HostListener } from "@angular/core";

@Directive({
  selector: "[appTrim]"
})
export class TrimInputDirective {
  private specialKeys: Array<string> = ["Backspace", "Tab", "End", "Home"];
  constructor(private el: ElementRef) {}

  @HostListener("blur", ["$event"])
  public onBlur(event: KeyboardEvent): void {
    let current: string = this.el.nativeElement.value;
    this.el.nativeElement.value = current.trim();
  }

  @HostListener("keypress", ["$event"])
  public onKeyPress(event: KeyboardEvent): void {
    if (this.specialKeys.indexOf(event.key) !== -1) {
      return;
    }
    let current: string = this.el.nativeElement.value;
    if (!current) {
      return;
    }

    var value = current.replace(/^\s+/g, "");
    value = value.replace("  ", " ");
    this.el.nativeElement.value = value;
  }

  @HostListener("paste", ["$event"])
  public onPaste(e: any): void {
    let current: string = e.clipboardData.getData("Text");
    if (current.match(/^\s+/g)) {
      e.preventDefault();
    }
  }
}
