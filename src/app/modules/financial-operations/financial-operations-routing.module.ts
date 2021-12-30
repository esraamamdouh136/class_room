import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {ParentsComponent} from './modules/parents/parents.component';
import {PaymentVouchersComponent} from './components/payment-vouchers/payment-vouchers.component';
import {CollectionFromParentsComponent} from './components/collection-from-parents/collection-from-parents.component';
import {CustodiesComponent} from './components/custodies/custodies.component';
import {BankReconcilationsComponent} from './components/bank-reconcilations/bank-reconcilations.component';
import {JornalEntryComponent} from './components/jornal-entry/jornal-entry.component';
import {ParentsListAgGridComponent} from './components/parents-list-ag-grid/parents-list-ag-grid.component';

const routes: Routes = [
  {
    path: '',
    component: ParentsComponent,
  },
  {
    path: 'parents-list',
    loadChildren: () =>
      import('./modules/parents/parents.module').then((m) => m.ParentsModule),
  },
  {
    path: 'parents',
    component: ParentsListAgGridComponent,
  },
  {
    path: 'contracts-management',
    loadChildren: () =>
      import('./modules/contract-management/contract-management.module').then((m) => m.ContractManagementModule),
  },
  {
    path: 'payment-vouchers',
    component: PaymentVouchersComponent,
    data: {component: 'payment'}
  },
  {
    path: 'receipt-vouchers',
    component: PaymentVouchersComponent,
    data: {component: 'receipt'}
  },
  {
    path: 'collection-from-parents',
    component: CollectionFromParentsComponent,
    data: {component: 'collections'}
  },
  {
    path: 'custodies',
    component: CustodiesComponent,
  },
  {
    path: 'bank-reconcilations',
    component: BankReconcilationsComponent,
  },
  {
    path: 'jornal-entry',
    component: JornalEntryComponent,
    data: {component: 'journal'}
  },
  { path: 'students', loadChildren: () => 
  import('./modules/students/students.module').then(m => m.StudentsModule) },

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class FinancialOperationsRoutingModule {
}
