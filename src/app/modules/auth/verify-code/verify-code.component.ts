import { Component, OnInit } from "@angular/core";
import { DomSanitizer } from "@angular/platform-browser";

@Component({
  selector: "app-verify-code",
  templateUrl: "./verify-code.component.html",
  styleUrls: ["./verify-code.component.scss"],
})
export class VerifyCodeComponent implements OnInit {
  videoSource: any;
  constructor(private _sanitizer: DomSanitizer) {}

  ngOnInit(): void {
    this.videoSource = this._sanitizer.bypassSecurityTrustResourceUrl(
      "https://www.youtube.com/embed/B-Iu1QGkP-o"
    );
  }
}
