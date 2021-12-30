import {
  Component,
  OnInit,
  OnDestroy,
  ChangeDetectorRef,
  Inject,
  ViewChild,
} from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import {Subscription, Observable, BehaviorSubject} from 'rxjs';
import {first} from 'rxjs/operators';
import {UserModel} from '../_models/user.model';
import {AuthService} from '../_services/auth.service';
import {ActivatedRoute, Router} from '@angular/router';
import {environment} from 'src/environments/environment';
import {DOCUMENT} from '@angular/common';
import {HttpHeaders} from '@angular/common/http';
import {RecaptchaComponent, RECAPTCHA_LANGUAGE,} from 'ng-recaptcha';
import {TopNavService} from 'src/app/shared/services/top-nav.service';


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
  providers: [
    {
      provide: RECAPTCHA_LANGUAGE,
      useValue: 'ar', // use French language
    },
  ]
})
export class LoginComponent implements OnInit, OnDestroy {
  // ______properties_______
  public toggleInputType: boolean = false;
  // public type: FormControl;
  defaultAuth: any = {
    email: 'admin@demo.com',
    password: 'demo',
  };
  lang: string = 'ar';
  loginForm: FormGroup;
  hasError: boolean;
  returnUrl: string;
  siteKey: string;
  showLoading: BehaviorSubject<any> = new BehaviorSubject(false);
  showFacebookLoading: BehaviorSubject<any> = new BehaviorSubject(false);
  showGoogleLoading: BehaviorSubject<any> = new BehaviorSubject(false);
  // private fields
  private unsubscribe: Subscription[] = []; // Read more: => https://brianflove.com/2016/12/11/anguar-2-unsubscribe-observables/
  @ViewChild('captchaRef') captchaElem;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private route: ActivatedRoute,
    private router: Router,
    @Inject(DOCUMENT) private document: Document,
    private _topNavService: TopNavService,
    // private recaptch: RecaptchaComponent,
  ) {
    // redirect to home if already logged in
    if (this.authService.currentUserValue) {
      this.router.navigate(['/']);
    }
  }

  ngOnInit(): void {
    // this.type = new FormControl("user", Validators.required);
    this.document.body.classList.add('recaptcha');
    this.siteKey = environment.site_key;
    this.initForm();
    // get return url from route parameters or default to '/'
    this.returnUrl =
      this.route.snapshot.queryParams['returnUrl'.toString()] || '/';

  }

  // convenience getter for easy access to form fields

  get f() {
    return this.loginForm.controls;
  }

  // Initiate form
  initForm() {
    this.loginForm = this.fb.group({
      type: ['user', Validators.required],
      system_login_code: [environment.system_login_code, Validators.required],
      'g-recaptcha-response': [''],
      username: [
        '',
        Validators.compose([
          Validators.required,
          Validators.minLength(3),
          Validators.maxLength(255),
        ]),
      ],
      password: [
        '',
        Validators.compose([
          Validators.required,
          Validators.minLength(6),
          Validators.maxLength(255),
        ]),
      ],
      rememberMe: [],
    });
  }

  /**
   * Get user form control values
   */
  public get formType() {
    return this.loginForm.get('type').value;
  }

  /**
   * When user click login
   * @param formValue
   * @param event (Recapsh response)
   */
  submit(event?) {
    this.showLoading.next(true);
    if (event) {
      this.loginForm.get('g-recaptcha-response').setValue(event);
    }

    const loginSubscr = this.authService
      .login(this.loginForm.value)
      .pipe(first())
      .subscribe(
        (res: any) => {
          if (res?.code === 200) {
            this.callDashboard(res);
            // this.router.navigate(['/TWA-scan'])
          }
        },
        (err) => {
          this.captchaElem.reset();
          this.showLoading.next(false);
        }
      );
    this.unsubscribe.push(loginSubscr);
  }

  // Call dashbord end point to check to steps auth
  callDashboard(loginData: any) {
    let header = {
      headers: new HttpHeaders().set(
        'Authorization',
        `Bearer  ${loginData.access_token}`
      ),
    };
    localStorage.removeItem('checkToken');
    localStorage.setItem('checkToken', loginData.access_token);
    localStorage.setItem('token', loginData.access_token);
    localStorage.setItem('user', JSON.stringify({...loginData.item, type: loginData.type}));
    localStorage.setItem('expires_in', loginData.expires_in);
    this.authService.accessToken = loginData.access_token;

    console.log(loginData, 'login');
    if (loginData.type === 'super') {
      this.showLoading.next(false);
      localStorage.setItem('role', 'super');
      this.authService.isSuper = true;
      this.router.navigate(['/admin/home']);
      return;
    }

    this.authService.dashbord(header).subscribe((res) => {
      if (res.code === 200) {
        this.showLoading.next(false);
        this._topNavService.getTopNavData();
        this.authService.isSuper = false;
        this.router.navigate(['/main-page']);
        // window.location.reload();
      }
    });
  }

  loginWithSocial(name: string) {
    if (name == 'facebook') {
      this.showFacebookLoading.next(true);
    } else {
      this.showGoogleLoading.next(true);
    }
    this.authService.getSocialUrl(this.loginForm.value.type, name).subscribe(
      (res) => {
        if (res['code'] === 200) {
          this.showFacebookLoading.next(false);
          this.showGoogleLoading.next(false);
          window.location.replace(res['url']);
        }
      },
      (err) => {
        this.showFacebookLoading.next(false);
        this.showGoogleLoading.next(false);
      }
    );
  }

  ngOnDestroy() {
    this.unsubscribe.forEach((sb) => sb.unsubscribe());
    this.document.body.classList.remove('recaptcha');
  }
}
