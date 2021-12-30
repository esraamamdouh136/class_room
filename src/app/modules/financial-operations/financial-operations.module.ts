import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {ContractsManagementComponent} from './components/contracts-management/contracts-management.component';
import {PaymentVouchersComponent} from './components/payment-vouchers/payment-vouchers.component';
import {ReceiptVouchersComponent} from './components/receipt-vouchers/receipt-vouchers.component';
import {CollectionFromParentsComponent} from './components/collection-from-parents/collection-from-parents.component';
import {CustodiesComponent} from './components/custodies/custodies.component';
import {BankReconcilationsComponent} from './components/bank-reconcilations/bank-reconcilations.component';
import {JornalEntryComponent} from './components/jornal-entry/jornal-entry.component';
import {FinancialOperationsRoutingModule} from './financial-operations-routing.module';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatDatepickerModule} from '@angular/material/datepicker';
import {MatInputModule} from '@angular/material/input';
import {MatNativeDateModule} from '@angular/material/core';
import {SharedModule} from '../../shared/shared.module';
import {MatTableModule} from '@angular/material/table';
import {MatIconModule} from '@angular/material/icon';
import {MatButtonModule} from '@angular/material/button';
import {MatSortModule} from '@angular/material/sort';
import {AttachmentsDialogComponent} from './components/jornal-entry/attachments-dialog/attachments-dialog.component';
import {ParentsListAgGridComponent} from './components/parents-list-ag-grid/parents-list-ag-grid.component';

@NgModule({
  declarations: [
    ContractsManagementComponent,
    PaymentVouchersComponent,
    ReceiptVouchersComponent,
    CollectionFromParentsComponent,
    CustodiesComponent,
    BankReconcilationsComponent,
    AttachmentsDialogComponent,
    JornalEntryComponent,
    ParentsListAgGridComponent
  ],

  imports: [
    CommonModule,
    FinancialOperationsRoutingModule,
    SharedModule,
    MatFormFieldModule,
    MatDatepickerModule,
    MatInputModule,
    MatNativeDateModule,
    MatTableModule,
    MatIconModule,
    MatButtonModule,
    MatSortModule,
  ]
})
export class FinancialOperationsModule {
}
