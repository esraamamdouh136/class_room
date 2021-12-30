import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";
import { AuthComponent } from "./auth.component";
import { LoginComponent } from "./login/login.component";
import { RegistrationComponent } from "./registration/registration.component";
import { ForgotPasswordComponent } from "./forgot-password/forgot-password.component";
import { LogoutComponent } from "./logout/logout.component";
import { TWAScanComponent } from "./twa-scan/twa-scan.component";
import { VerifyCodeComponent } from "./verify-code/verify-code.component";
import { SocialLoginLoaderComponent } from "./social-login-loader/social-login-loader.component";

const routes: Routes = [
  {
    path: "",
    component: AuthComponent,
    children: [
      {
        path: "",
        redirectTo: "login",
        pathMatch: "full",
      },
      {
        path: "login",
        component: LoginComponent,
        data: { returnUrl: window.location.pathname },
      },
      {
        path: "registration",
        component: RegistrationComponent,
      },
      {
        path: "forgot-password",
        component: ForgotPasswordComponent,
      },
      {
        path: "logout",
        component: LogoutComponent,
      },
    ],
  },
  {
    path: "twa-scan",
    component: TWAScanComponent,
  },
  {
    path: "verify-code",
    component: VerifyCodeComponent,
  },
  {
    path: "social-login",
    component: SocialLoginLoaderComponent,
  },

  { path: "", redirectTo: "login", pathMatch: "full" },
  { path: "**", redirectTo: "login", pathMatch: "full" },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AuthRoutingModule {}
