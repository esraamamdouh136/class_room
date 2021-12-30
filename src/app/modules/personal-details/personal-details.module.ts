import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PersonalDetailsRoutingModule } from './personal-details-routing.module';
import { PersonalDetailsComponent } from './pages/personal-details/personal-details.component';
import { BasicInformationComponent } from './components/basic-information/basic-information.component';
import { AlertsComponent } from './components/alerts/alerts.component';
import { SecurityComponent } from './components/security/security.component';
import {TranslateModule} from '@ngx-translate/core';
import {FormsModule} from '@angular/forms';
import {SharedModule} from '../../shared/shared.module';


@NgModule({
  declarations: [PersonalDetailsComponent, BasicInformationComponent, AlertsComponent, SecurityComponent],
  imports: [
    CommonModule,
    PersonalDetailsRoutingModule,
    TranslateModule,
    FormsModule,
    SharedModule
  ]
})
export class PersonalDetailsModule { }
