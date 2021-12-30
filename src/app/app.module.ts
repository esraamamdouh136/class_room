import {NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {HttpClientModule} from '@angular/common/http';

import {AppRoutingModule} from './app-routing.module';
import {AppComponent} from './app.component';
import {DatePipe} from '@angular/common';

import {CoreModule} from './modules/core/core.module';

import 'ag-grid-enterprise';
import {LicenseManager} from 'ag-grid-enterprise';

LicenseManager.setLicenseKey('CompanyName=viewclass.com,LicensedApplication=viewclass.com,LicenseType=SingleApplication,LicensedConcurrentDeveloperCount=1,LicensedProductionInstancesCount=0,AssetReference=AG-018150,ExpiryDate=19_August_2022_[v2]_MTY2MDg2MzYwMDAwMA==7c207f1bd25c85068cc50703ee09b870');

@NgModule({
  declarations: [AppComponent],
  providers: [
    DatePipe,
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    CoreModule,
    HttpClientModule,
    AppRoutingModule
  ],
  bootstrap: [AppComponent],
})
export class AppModule {
}
