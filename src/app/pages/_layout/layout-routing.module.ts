import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LayoutComponent } from './layout.component';

const routes: Routes = [
  {
    path: '',
    component: LayoutComponent,
    children: [
      {
        path: 'main-page',
        loadChildren: () =>
          import('../dashboard/dashboard.module').then((m) => m.DashboardModule),
      },
      // {
      //   path: "builder",
      //   loadChildren: () =>
      //     import("./builder/builder.module").then((m) => m.BuilderModule),
      // },
      {
        path: 'financial-operations',
        loadChildren: () =>
          import('../../modules/financial-operations/financial-operations.module').then((m) => m.FinancialOperationsModule),
      },
      {
        path: 'settings/general-ledger',
        loadChildren: () =>
          import('../../modules/financial-setting/financial-setting.module').then((m) => m.FinancialSettingModule),
      },
      {
        path: 'settings/human-resources',
        loadChildren: () =>
          import('../../modules/human-resource/human-resource.module').then((m) => m.HumanResourceModule),
      },
      {
        path: 'processing',
        loadChildren: () =>
          import('../../modules/processing/processing.module').then((m) => m.ProcessingModule),
      },
      {
        path: '',
        redirectTo: '/main-page',
        pathMatch: 'full',
      },
      {
        path: 'personal-details',
        loadChildren: () => import('../../modules/personal-details/personal-details.module').then(m => m.PersonalDetailsModule)
      },
      // {
      //   path: "**",
      //   redirectTo: "error/404",
      // },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class LayoutRoutingModule {
}
