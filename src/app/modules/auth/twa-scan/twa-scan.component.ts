import {HttpErrorResponse} from '@angular/common/http';
import {Component, OnInit} from '@angular/core';
import {DomSanitizer} from '@angular/platform-browser';
import {AuthService} from '..';
import {ActivatedRoute} from '@angular/router';

@Component({
  selector: 'app-twa-scan',
  templateUrl: './twa-scan.component.html',
  styleUrls: ['./twa-scan.component.scss'],
})
export class TWAScanComponent implements OnInit {
  // begin properties ___________________
  videoSource: any;
  code: string;
  barCodeImg: string;
  loading = false;
  redirectUrl = null;

  // end properties ___________________

  constructor(
    private _sanitizer: DomSanitizer,
    private _authService: AuthService,
    private activatedRoute: ActivatedRoute
  ) {
    this.activatedRoute.queryParams.subscribe(res => {
      if (res.redirectUrl) {
        this.redirectUrl = res.redirectUrl;
      }
    });
  }

  ngOnInit(): void {
    this.videoSource = this._sanitizer.bypassSecurityTrustResourceUrl(
      'https://www.youtube.com/embed/B-Iu1QGkP-o'
    );
    // get twY auth data
    this.getData();
  }

  /**
   * This fuction get TWA scan data
   * QRCODE image to scan
   * code to use when verify
   */
  getData() {
    this._authService.twaData().subscribe(
      (res) => {
        if (res?.code === 200) {
          this.code = res.sec_code;
          this.barCodeImg = res.link;
          this.loading = false;
          // this.showLoading.next(false);
          // this.errorMsg.next("");
        }
      },
      (error: HttpErrorResponse) => {
      }
    );
  }
}
