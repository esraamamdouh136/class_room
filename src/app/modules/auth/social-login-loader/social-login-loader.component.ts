import { HttpHeaders } from "@angular/common/http";
import { Component, OnInit } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { ToastrService } from "ngx-toastr";
import { BehaviorSubject } from "rxjs";
import { environment } from "src/environments/environment";
import { AuthService } from "../_services/auth.service";

@Component({
  selector: "app-social-login-loader",
  templateUrl: "./social-login-loader.component.html",
  styleUrls: ["./social-login-loader.component.scss"],
})
export class SocialLoginLoaderComponent implements OnInit {
  name: string;
  type: string;
  code: string;
  showLoading: BehaviorSubject<any> = new BehaviorSubject(true);
  errorMsg: string;
  isLoadingSubject: BehaviorSubject<boolean>;

  constructor(
    private route: ActivatedRoute,
    private authService: AuthService,
    private router: Router,
    private toastr: ToastrService
  ) { }

  ngOnInit() {
    this.route.queryParams.subscribe((res) => {
      this.code = res.code;
      this.name = res.name;
      this.type = res.type;
      this.loginWithSocialMedia(this.name, this.type, this.code);
    });
  }

  // Call dashbord end point to check to steps auth
  callDashboard(loginData: any) {
    let header = {
      headers: new HttpHeaders().set(
        "Authorization",
        `Bearer  ${loginData.access_token}`
      ),
    };
    localStorage.removeItem("checkToken");
    localStorage.setItem("checkToken", loginData.access_token);
    localStorage.setItem("token", loginData.access_token);

    this.authService.dashbord(header).subscribe((res) => {
      if (res.code === 200) {
        this.showLoading.next(false);
        localStorage.setItem("user", JSON.stringify(loginData.item));
        localStorage.setItem("token", loginData.access_token);
        localStorage.setItem("expires_in", loginData.expires_in);
        const date = new Date().getTime() + 3600 * 1000;
        this.authService.saveDateToLocalStorage(date);
        this.authService.accessToken = loginData.access_token;
        this.router.navigate(["/main-page"]);
      }
    });
  }

  loginWithSocialMedia(name: string, type: string, code: string) {
    this.authService.loginWithSocial(name, type, code).subscribe(
      (res: any) => {
        if (res.code === 200) {
          this.callDashboard(res);
        }
      },
      (error) => {
        if (error.status === 400 || error.status === 500) {
          localStorage.clear();
          localStorage.setItem('language', 'ar')
          this.router.navigate(["/auth/login"]);
        }

        if (error.status === 422) {
          this.router.navigate(["/auth/login"]);
        }
      }
    );
  }

  backToLogin() {
    this.router.navigate(["/auth/login"]);
  }
}
