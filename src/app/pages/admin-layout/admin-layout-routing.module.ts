import {NgModule} from '@angular/core';
import {Routes, RouterModule} from '@angular/router';

import {AdminLayoutComponent} from './admin-layout.component';
import {AdminHomeComponent} from './components/admin-home/admin-home.component';

const routes: Routes = [
  {
    path: '',
    component: AdminLayoutComponent,
    children: [
      {
        path: 'home',
        component: AdminHomeComponent
      },
      {
        path: 'personal-details',
        loadChildren: () => import('../../modules/personal-details/personal-details.module').then(m => m.PersonalDetailsModule)
      },
    ]
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdminLayoutRoutingModule {
}
