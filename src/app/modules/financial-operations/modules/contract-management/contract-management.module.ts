import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ContractManagementRoutingModule } from './contract-management-routing.module';
import { ContractManagementComponent } from './contract-management.component';
import { NewcontractComponent } from './taps/viewcontract/newcontract/newcontract.component';
import { ViewcontractComponent } from './taps/viewcontract/viewcontract.component';
import { ContractsComponent } from './taps/contracts/contracts.component';
import { AcceptSignupComponent } from './taps/accept-signup/accept-signup.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { AngularEditorModule } from '@kolkov/angular-editor';
import { EditorModule } from '@tinymce/tinymce-angular';
import { BillsComponent } from './taps/bills/bills.component';
import { ContractDownloadDialogComponent } from './taps/viewcontract/contract-download-dialog/contract-download-dialog.component';
import { QRCodeModule } from 'angular2-qrcode';
import { CKEditorModule } from 'ckeditor4-angular';
import { ViewBillComponent } from './taps/bills/view-bill/view-bill.component';
import { AddEditBillComponent } from './taps/bills/add-edit-bill/add-edit-bill.component';
import { AddEditContractComponent } from './taps/contracts/add-edit-contract/add-edit-contract/add-edit-contract.component';
import { ContractBillsComponent } from './taps/contracts/contract-bills/contract-bills.component';
import { DownloadContractComponent } from './taps/contracts/download-contract/download-contract.component';
import {MatExpansionModule} from '@angular/material/expansion';

@NgModule({
  declarations: [
    ContractManagementComponent, 
    NewcontractComponent, 
    ViewcontractComponent, 
    ContractsComponent, 
    AcceptSignupComponent, BillsComponent, ContractDownloadDialogComponent, ViewBillComponent, AddEditBillComponent, AddEditContractComponent, ContractBillsComponent, DownloadContractComponent],
  imports: [
    CommonModule,
    ContractManagementRoutingModule,
    SharedModule,
    AngularEditorModule ,
    EditorModule,
    QRCodeModule,
    CKEditorModule,
    MatExpansionModule

  ]
})
export class ContractManagementModule { }




