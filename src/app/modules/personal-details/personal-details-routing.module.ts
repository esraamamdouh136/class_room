import {NgModule} from '@angular/core';
import {Routes, RouterModule} from '@angular/router';

import {PersonalDetailsComponent} from './pages/personal-details/personal-details.component';
import {BasicInformationComponent} from './components/basic-information/basic-information.component';
import {AlertsComponent} from './components/alerts/alerts.component';
import {SecurityComponent} from './components/security/security.component';

const routes: Routes = [
  {
    path: '',
    component: PersonalDetailsComponent,
    children: [
      {
        path: '',
        redirectTo: 'basic-information',
      },
      {
        path: 'basic-information',
        component: BasicInformationComponent
      },
      {
        path: 'alerts',
        component: AlertsComponent
      },
      {
        path: 'security',
        component: SecurityComponent
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PersonalDetailsRoutingModule {
}
