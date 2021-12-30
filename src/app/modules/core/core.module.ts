import { APP_INITIALIZER, LOCALE_ID, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { TranslateModule } from "@ngx-translate/core"; 
import { InlineSVGModule } from "ng-inline-svg"; 
import { NgbModule } from "@ng-bootstrap/ng-bootstrap"; 
import { ToastrModule } from "ngx-toastr"; 
import {RECAPTCHA_LANGUAGE} from 'ng-recaptcha'; 
import { AuthService } from "src/app/modules/auth/_services/auth.service"; 
import {AuthInterceptor} from 'src/app/modules/auth/http/auth.interceptor'; 
import {ErrorHandlerInterceptor} from 'src/app/modules/auth/http/errors.interceptor'; 
import { HTTP_INTERCEPTORS } from '@angular/common/http';

import { NgxSpinnerModule } from 'ngx-spinner';
import { LoaderInterceptor } from 'src/app/_metronic/core/interceptors/loader.interceptor';

//export Current lang
export const RecaptchaLoader = localStorage.getItem("language"); 

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    TranslateModule.forRoot(),
    InlineSVGModule.forRoot(),
    ToastrModule.forRoot(),
    NgxSpinnerModule,
    NgbModule,
  ],
  exports: [
    TranslateModule,
    InlineSVGModule,
    ToastrModule,
    NgxSpinnerModule,
    NgbModule,
  ],
  providers: [
    {
      provide: APP_INITIALIZER,
      useFactory: appInitializer,
      multi: true,
      deps: [AuthService],
    },
    {
      provide: RECAPTCHA_LANGUAGE,
      useValue: RecaptchaLoader,
    },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptor,
      multi: true,
    },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: ErrorHandlerInterceptor,
      multi: true,
    },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: LoaderInterceptor,
      multi: true,
    },
    { provide: LOCALE_ID, useValue: "en-GB" },
  ]
})
export class CoreModule { }



function appInitializer(authService: AuthService) {
  return () => {
    return new Promise((resolve) => {
      authService.getUserByToken().subscribe().add(resolve);
    });
  };
}
