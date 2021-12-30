import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';

import {ContractManagementComponent} from './contract-management.component';
import {AcceptSignupComponent} from './taps/accept-signup/accept-signup.component';
import {BillsComponent} from './taps/bills/bills.component';
import {ContractsComponent} from './taps/contracts/contracts.component';
import {NewcontractComponent} from './taps/viewcontract/newcontract/newcontract.component';
import {ViewcontractComponent} from './taps/viewcontract/viewcontract.component';
import {ViewBillComponent} from './taps/bills/view-bill/view-bill.component';
import { AddEditBillComponent } from './taps/bills/add-edit-bill/add-edit-bill.component';

const routes: Routes = [
  { path: '', component: ContractManagementComponent, children : [
    { path: '', component: ViewcontractComponent},
    { path: 'view_contract', component: ViewcontractComponent},
    { path: 'contracts', component: ContractsComponent},
    { path: 'accept_signup', component: AcceptSignupComponent},
    { path: 'bills', component: BillsComponent},
    {path: 'view_bill', component: ViewBillComponent}

  ]},
  { path: 'new_contract', component: NewcontractComponent},

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ContractManagementRoutingModule { }
