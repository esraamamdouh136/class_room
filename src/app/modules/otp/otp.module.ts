import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { OtpComponent } from './components/otp/otp.component';
// ng-otp-input
import { NgOtpInputModule } from  'ng-otp-input';
import { TranslationModule } from '../i18n/translation.module';


@NgModule({
  declarations: [OtpComponent],
  imports: [
    CommonModule,
    NgOtpInputModule,
    TranslationModule,
  ],
  exports: [
    OtpComponent
  ]
})
export class OtpModule { }
