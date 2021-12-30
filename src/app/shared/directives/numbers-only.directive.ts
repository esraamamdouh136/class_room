import { Directive, HostListener } from "@angular/core";

@Directive({
  selector: "[appNumbersOnly]",
})
export class NumbersOnlyDirective {
  constructor() {}
  @HostListener("keypress", ["$event"])
  onKeyPress(event: any) {
    return event.charCode == 8 || event.charCode == 0 || event.charCode == 13
      ? false
      : event.charCode >= 48 && event.charCode <= 57;
  }
}
