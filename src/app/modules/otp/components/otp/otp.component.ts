import {Component, Input, OnInit, ViewChild} from '@angular/core';
import {Router} from '@angular/router';
import {ToastrService} from 'ngx-toastr';
import {switchMap} from 'rxjs/operators';
import {AuthService} from 'src/app/modules/auth';
import {SecurityTypesStatus} from '../../../../shared/model/global';

@Component({
  selector: 'app-otp',
  templateUrl: './otp.component.html',
  styleUrls: ['./otp.component.scss'],
})
export class OtpComponent implements OnInit {
  @ViewChild('ngOtpInput', {static: false}) ngOtpInput: any;
  //begin propeties ____________
  otp: string;
  config = {
    allowNumbersOnly: false,
    length: 6,
    isPasswordInput: false,
    disableAutoFocus: false,
    placeholder: '',
  };
  @Input('code') code;
  @Input() showSkip;
  @Input() first;
  //end propeties ____________

  // begin booleans _______________
  isLoading$: boolean = false;

  // end booleans _______________

  constructor(
    private _authService: AuthService,
    private router: Router,
    private toastr: ToastrService
  ) {
  }

  ngOnInit(): void {
  }

  /**
   * Function that will receive the otp
   * @param otp
   */
  onOtpChange(otp) {
    this.otp = otp;
  }

  verifyCode() {
    if (this.otp?.length == 6) {
      this.isLoading$ = true;
      if (this.first) {
        let code = this.otp;
        let setCode = {sec_code: this.code};
        this._authService
          .setCodeBeforeVerify(setCode)
          .pipe(
            switchMap((res) => {
              return this._authService.verifyCode({code});
            })
          )
          .subscribe((res) => {
            if (res.code === 200) {
              this._authService.changeStatus(1, SecurityTypesStatus.twoStep).subscribe(result => {
                localStorage.setItem('user', JSON.stringify(result.item));
                this._authService = result.item.two_step_status;
                console.log(result, 'result');
                this.setUserDataInStorage({...res, item: result.item});
                this.router.navigate(['/main-page']);
              });
              // window.location.reload();
            }
          }, error => {
            this.isLoading$ = false;
          });
      } else {
        this._authService.verifyCode({code: this.otp}).subscribe((res) => {
          if (res.code === 200) {
            this.setUserDataInStorage(res);
            this.router.navigate(['/main-page']);
            // window.location.reload();
          }
        }, error => {
          this.isLoading$ = false;
        });
      }
    } else {
      this.toastr.error('Enter valid code must be 6 numbers');
    }
    localStorage.removeItem('isFirstTime');
  }

  /**
   * When user click skip
   */
  skip() {
    this.isLoading$ = true;
    this._authService.skipSettingQRCode().subscribe((res) => {
      if (res.code === 200) {
        localStorage.setItem('user', JSON.stringify(res.item));
        localStorage.setItem('token', res.access_token);
        localStorage.setItem('expires_in', res.expires_in);
        localStorage.setItem('item', res.item);
        this._authService.accessToken = res.access_token;
        localStorage.removeItem('checkToken');
        this.router.navigate(['/main-page']);
      }
    }, error => {
      this.isLoading$ = false;
    });
    localStorage.removeItem('isFirstTime');
  }

  /**
   * Set user data to local storage
   * @param data (Data from response)
   */
  setUserDataInStorage(data) {
    console.log(data);
    localStorage.setItem('user', JSON.stringify(data.item));
    localStorage.setItem('token', data.access_token);
    localStorage.setItem('expires_in', data.expires_in);
    // this._authService.accessToken = data.access_token;
    localStorage.removeItem('checkToken');
  }
}
