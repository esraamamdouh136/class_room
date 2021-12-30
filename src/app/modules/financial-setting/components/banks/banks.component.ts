import {Component, OnDestroy, OnInit} from '@angular/core';
import {MatDialog} from '@angular/material/dialog';


import {Subscription} from 'rxjs';
import {ToastrService} from 'ngx-toastr';

import {banks} from '../../models/banks/banks';
import {environment} from 'src/environments/environment';
import {SharedService} from 'src/app/shared/services/shared.service';
import {BankServiceService} from '../../services/bank/bank-service.service';
import {FormaddEditBankComponent} from './formadd-edit-bank/formadd-edit-bank.component';
import {ConfirmDialogComponent} from 'src/app/shared/components/confirm-dialog/confirm-dialog.component';
import {cellActionStyle, DeleteActionStyle, TableActions} from 'src/app/shared/model/global';
import {TranslateService} from '@ngx-translate/core';
import {AgActionBtnComponent} from 'src/app/shared/components/ag-grid/cell-renderers/ag-action-btn/ag-action-btn.component';
import {AgStatusBtnComponent} from 'src/app/shared/components/ag-grid/cell-renderers/ag-status-btn/ag-status-btn.component';
import {TranslationService} from 'src/app/modules/i18n/translation.service';


@Component({
  selector: 'app-banks',
  templateUrl: './banks.component.html',
  styleUrls: ['./banks.component.scss']
})
export class BanksComponent implements OnInit, OnDestroy {
  message: string;
  querySearch: string = '';


  update = false;
  existData = true;
  errorMassage = true;

  currentPage = 1;
  subscription: Subscription = new Subscription();

  messageBoxError: {};
  tableItems: banks[];
  tableColumns = TABLE_COLUMNS;
  columnDefs = [];
  defaultColDef = {
    filter: false,
    editable: false,
    resizable: true,
  };
  frameworkComponents: any;

  // pagination Object
  pageOptions = {
    length: 10,
    paginationSizes: [],
    defaultPageSize: 15,
  };

  constructor(
    private matDialog: MatDialog,
    private toaster: ToastrService,
    private _sharedService: SharedService,
    private bankServices: BankServiceService,
    private translate: TranslateService,
    public translation: TranslationService,
  ) {
    this.frameworkComponents = {
      agActionBtn: AgActionBtnComponent,
      agStatusBtn: AgStatusBtnComponent,
    };
  }

  ngOnInit(): void {
    this.getData();
  }

  initializeAgGrid(): void {
    this.drawAgGrid(); // call drawAgGrid Function
  }


  /**
   * @description A function that draws AG Grid
   */
  drawAgGrid(): void {
    if (!this.columnDefs.length) {
      this.columnDefs = [
        {
          headerName: '#',
          valueGetter: 'node.rowIndex + 1',
          filter: false,
          minWidth: 80
        },
        {
          headerName: this.translate.instant('general.name'),
          field: (this.translation.getSelectedLanguage() == 'ar') ? 'name_ar' : 'name_en',
          minWidth: 200,
        },
        {
          headerName: this.translate.instant('general.bank_fees_percentage'),
          field: 'bank_fees_per',
          minWidth: 130,
        },
        {
          headerName: this.translate.instant('general.bank_fees_tax_percentage'),
          field: 'bank_fees_tax_per',
          minWidth: 250,
        },
        {
          headerName: this.translate.instant('general.status'),
          cellRenderer: 'agStatusBtn',
          cellRendererParams: {
            getAction: this.rowActions.bind(this),
          },
          minWidth: 100
        },
        {
          headerName: 'الإجراءات',
          cellRenderer: 'agActionBtn',
          cellClass: 'action-cell',
          cellRendererParams: {
            actions: [
              {
                action: 'edit',
                style: cellActionStyle
              },
              {
                action: 'delete',
                style: DeleteActionStyle
              }
            ],
            getAction: this.rowActions.bind(this),
          },
          minWidth: 150
        }
      ];
    }
  }

  getData() {
    this.subscription.add(
      this._sharedService.navChanged$.subscribe(data => {
        if (data) {
          this.getBankData();
        }
      })
    );
  }

  getBankData() {
    this.subscription.add(
      this.bankServices.getDataBanks(this.querySearch, this.currentPage)
        .subscribe((res: any) => {
          this.tableItems = res?.data;
          this.initializeAgGrid();
          this.pageOptions.length = res?.total;
          this.existData = true;
          this.errorMassage = true;
        }, error => {
          this.messageBoxError = error?.error;
          this.tableItems = [];
          this.initializeAgGrid();
          if (error?.error?.code === 4000) {
            this.errorMassage = false;
          } else {
            this.errorMassage = true;
            this.existData = false;
          }
        }));

  }

  onSearchChange(e) {
    this.currentPage = 1;
    this.getBankData();
  }


  // Dialog For Add And Edit Row
  openAddEditCaseStudiesForm(row?): void {
    const dialogRef = this.matDialog
      .open(FormaddEditBankComponent, {
        minWidth: '600px',
        panelClass: 'custom-dialog-container',
        data: {
          update: this.update,
          data: row
        }
      });
    this.subscription.add(
      dialogRef.afterClosed().subscribe(result => {
        this.update = false;
        if (result) {
          this.getBankData();
        }
      }));
  }

  changeStatus(data) {
    const dialog = this.matDialog.open(ConfirmDialogComponent, {
      minWidth: '350px',
      data: {
        message: 'common.changeStatusMessage',
        updateStatus: true
      }
    });
    this.subscription.add(
      dialog.afterClosed().subscribe(
        (result) => {
          if ((result)) {
            this.subscription.add(
              this.bankServices
                .changeStatus(data.id, {status: data.status === 1 ? 2 : 1})
                .subscribe(
                  (res: any) => {
                    this.toaster.success(res?.message);
                    this.getBankData();
                  }
                )
            );
          }
        })
    );
  }

  delete(data) {
    const dialog = this.matDialog.open(ConfirmDialogComponent, {
      minWidth: '350px',
      data: {
        message: 'common.deleteMessage',
        updateStatus: false,
        url: `users/banks/${data.id}/delete`,
        domainUrl: `${environment.accountant_apiUrl}`
      }
    });
    this.subscription.add(
      dialog.afterClosed().subscribe(res => {
        if (res) {
          this.getBankData();
        }
      }));
  }


  rowActions(data): void {
    if (data.action === TableActions.delete) {
      this.delete(data?.data);
    } else if (data?.action === TableActions.changeStatus) {
      this.changeStatus(data?.data);
    } else {
      this.update = true;
      const FormData = {
        ...data.data,
        status: data?.data?.status === 1
      };
      this.openAddEditCaseStudiesForm(FormData);
    }
  }

  // pagination function
  pageEvent(event) {
    this.currentPage = event;
    this.getBankData();
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
}

export const TABLE_COLUMNS = [
  {
    name: 'general.name',
    dataKey: 'auto_name',
    isSortable: false
  },
  {
    name: 'general.bank_account_guide',
    dataKey: 'account_guide_title',
    isSortable: false
  },
  {
    name: 'general.bank_fees_percentage',
    dataKey: 'bank_fees_per',
    isSortable: false
  },
  {
    name: 'general.bank_fees_tax_percentage',
    dataKey: 'bank_fees_tax_per',
    isSortable: false
  },
  {
    name: 'general.status',
    dataKey: 'statusView',
    isSortable: false
  }
];
