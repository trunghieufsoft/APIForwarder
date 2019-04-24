import { Directive, HostListener, ElementRef } from "@angular/core";

@Directive({
  selector: "[appNoSpace]"
})
export class NoSpaceDirective {
  constructor(private el: ElementRef) {}

  @HostListener("keypress", ["$event"])
  public onKeyPress(e: KeyboardEvent): any {
    if (e.keyCode !== 32) {
      return;
    }

    e.preventDefault();
  }
}
