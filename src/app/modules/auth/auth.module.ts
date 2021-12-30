import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { ReactiveFormsModule, FormsModule } from "@angular/forms";
import { HttpClientModule } from "@angular/common/http";
import { AuthRoutingModule } from "./auth-routing.module";
import { LoginComponent } from "./login/login.component";
import { RegistrationComponent } from "./registration/registration.component";
import { ForgotPasswordComponent } from "./forgot-password/forgot-password.component";
import { LogoutComponent } from "./logout/logout.component";
import { AuthComponent } from "./auth.component";
import { TranslationModule } from "../i18n/translation.module";
import { AuthScanComponent } from "./auth-scan/auth-scan.component";
import { RecaptchaModule } from "ng-recaptcha";
import { environment } from "src/environments/environment";
import { AuthHeaderComponent } from './auth-header/auth-header.component';
import { TWAScanComponent } from './twa-scan/twa-scan.component';
import { OtpModule } from "../otp/otp.module";
import { VerifyCodeComponent } from './verify-code/verify-code.component';
import { SocialLoginLoaderComponent } from './social-login-loader/social-login-loader.component';
import { SharedModule } from "src/app/shared/shared.module";

@NgModule({
  declarations: [
    LoginComponent,
    RegistrationComponent,
    ForgotPasswordComponent,
    LogoutComponent,
    AuthComponent,
    AuthScanComponent,
    AuthHeaderComponent,
    TWAScanComponent,
    VerifyCodeComponent,
    SocialLoginLoaderComponent,
  ],
  imports: [
    CommonModule,
    TranslationModule,
    AuthRoutingModule,
    HttpClientModule,
    RecaptchaModule,
    OtpModule,
    SharedModule
  ],
  providers: [
    // { provide: RECAPTCHA_V3_SITE_KEY, useValue: environment.site_key },
  ],
})
export class AuthModule { }
