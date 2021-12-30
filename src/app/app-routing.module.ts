import {NgModule} from '@angular/core';
import {Routes, RouterModule} from '@angular/router';
import {AuthGuard} from './modules/auth/_services/auth.guard';
import {IsLoginGuard} from './modules/auth/_services/isLogin.guard';
import {SuperAdminGuard} from './modules/auth/_services/super-admin.guard';

export const routes: Routes = [
  {
    path: 'auth',
    canActivate: [IsLoginGuard],
    loadChildren: () =>
      import('./modules/auth/auth.module').then((m) => m.AuthModule),
  },
  {
    path: 'error',
    loadChildren: () =>
      import('./modules/errors/errors.module').then((m) => m.ErrorsModule),
  },
  {
    path: '',
    canActivate: [AuthGuard],
    loadChildren: () =>
      import('./pages/_layout/layout.module').then((m) => m.LayoutModule),
  },
  {
    path: 'contract-management',
    loadChildren: () => import('./modules/financial-operations/modules/contract-management/contract-management.module')
      .then(m => m.ContractManagementModule)
  },
  {
    path: 'ledger-view',
    canActivate: [AuthGuard],
    loadChildren: () => import('./modules/ledger-view/ledger-view.module')
    .then(m => m.LedgerViewModule)
  },
  {
    path: 'admin',
    loadChildren: () => import('./pages/admin-layout/admin-layout.module').then(m => m.AdminLayoutModule),
    canActivate: [SuperAdminGuard],
  },
  {path: '**', redirectTo: 'error/404'},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {
}
