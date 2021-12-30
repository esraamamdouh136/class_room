import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { ToastrService } from 'ngx-toastr';
import { Subscription } from 'rxjs';
import { AttachmentsDialogComponent } from 'src/app/modules/financial-operations/components/jornal-entry/attachments-dialog/attachments-dialog.component';
import { Invoice, Ledger, LedgerDetails, Student } from 'src/app/modules/financial-operations/models/collection-from-parents/collection-from-parents';
import { PaymentVoucherDetails, PaymentVouchers } from 'src/app/modules/financial-operations/models/payment-vouchers';
import { CollectionFromParentsService } from 'src/app/modules/financial-operations/services/collection-from-parents/collection-from-parents.service';
import { FiscalYear } from 'src/app/modules/financial-setting/models/fiscalYears/fiscalYear';
import { AgGridComponent } from 'src/app/shared/components/ag-grid/ag-grid.component';
import { AgActionBtnComponent } from 'src/app/shared/components/ag-grid/cell-renderers/ag-action-btn/ag-action-btn.component';
import { AgAutocompleteComponent } from 'src/app/shared/components/ag-grid/cell-renderers/ag-autocomplete/ag-autocomplete';
import { convertArabicDigitsToEnglish } from 'src/app/shared/components/ag-grid/only-english-numbers/only-english-numbers';
import { Currencies, GuideTree } from 'src/app/shared/model/global';
import { CheckBeginningBalanceService } from 'src/app/shared/services/check-beginning-balance.service';
import { ListsService } from 'src/app/shared/services/list_Service/lists.service';
import { SharedService } from 'src/app/shared/services/shared.service';

@Component({
  selector: 'app-add-edit-bill',
  templateUrl: './add-edit-bill.component.html',
  styleUrls: ['./add-edit-bill.component.scss']
})
export class AddEditBillComponent implements OnInit {
  constructor() {}

  ngOnInit(): void {
    }
}
