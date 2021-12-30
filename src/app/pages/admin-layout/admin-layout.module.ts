import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AdminLayoutRoutingModule } from './admin-layout-routing.module';
import { AdminLayoutComponent } from './admin-layout.component';
import {SharedModule} from '../../shared/shared.module';
import {ExtrasModule} from '../../_metronic/partials/layout/extras/extras.module';
import {LayoutModule} from '../_layout/layout.module';
import { AsideAdminComponent } from './components/aside/aside-admin.component';
import {InlineSVGModule} from 'ng-inline-svg';
import { AdminHomeComponent } from './components/admin-home/admin-home.component';


@NgModule({
  declarations: [AdminLayoutComponent, AsideAdminComponent, AdminHomeComponent],
  imports: [
    CommonModule,
    AdminLayoutRoutingModule,
    SharedModule,
    ExtrasModule,
    LayoutModule,
    InlineSVGModule
  ]
})
export class AdminLayoutModule { }
