import {Component, OnDestroy, OnInit} from '@angular/core';
import {MatDialog} from '@angular/material/dialog';


import {PaymentService} from '../../services/paymentServices/payment.service';
import {SharedService} from 'src/app/shared/services/shared.service';
import {TranslateService} from '@ngx-translate/core';
import {ToastrService} from 'ngx-toastr';


import {ConfirmDialogComponent} from 'src/app/shared/components/confirm-dialog/confirm-dialog.component';
import {JournalEntriesComponent} from 'src/app/shared/components/journal-entries/journal-entries.component';
import {environment} from 'src/environments/environment';
import {paymentMethods} from '../../models/payment-methods/payment-methods';
import {PaymentFormComponent} from './add-edit-payment-methods/payment-form.component';
import {Subscription} from 'rxjs';
import {cellActionStyle, DeleteActionStyle} from 'src/app/shared/model/global';
import {AgActionBtnComponent} from 'src/app/shared/components/ag-grid/cell-renderers/ag-action-btn/ag-action-btn.component';
import {AgStatusBtnComponent} from 'src/app/shared/components/ag-grid/cell-renderers/ag-status-btn/ag-status-btn.component';
import {TranslationService} from 'src/app/modules/i18n/translation.service';

@Component({
  selector: 'app-payment-methods',
  templateUrl: './payment-methods.component.html',
  styleUrls: ['./payment-methods.component.scss']
})
export class PaymentMethodsComponent implements OnInit, OnDestroy {
  message: string;
  querySearch: string = '';

  existData: boolean = true;
  update: boolean = false;
  errorMassage: boolean = true;
  columnDefs = [];
  defaultColDef = {
    filter: false,
    editable: false,
    resizable: true,
  };
  frameworkComponents: any;

  currentPage: number = 1;
  messageBoxError = {};
  tableData: paymentMethods[];
  subscription: Subscription = new Subscription();

  tableColumns = [
    {
      name: 'general.name',
      dataKey: 'nick_name',
      isSortable: false
    },
    {
      name: 'general.bank',
      dataKey: 'bank_name_pre',
      isSortable: false
    },
    {
      name: 'general.status',
      dataKey: 'statusView',
      isSortable: false
    },
  ];

  // pagination Object
  pageOptions = {
    paginationSizes: [],
    defaultPageSize: 15,
    length: 10
  };

  constructor(
    private paymentService: PaymentService,
    private matDialog: MatDialog,
    private toaster: ToastrService,
    private sharedService: SharedService,
    private translate: TranslateService,
    public translation: TranslationService,
  ) {
    this.frameworkComponents = {
      agActionBtn: AgActionBtnComponent,
      agStatusBtn: AgStatusBtnComponent,
    };
  }

  ngOnInit(): void {
    this.subscription.add(
      this.sharedService.navChanged$.subscribe(data => {
        if (data) {
          this.getDataPaymentMethod();
        }
      })
    );
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

          minWidth: 150,
        },
        {
          headerName: this.translate.instant('general.bank'),
          field: 'bank_name_pre',
          minWidth: 150,
        },
        {
          headerName: this.translate.instant('general.status'),
          cellRenderer: 'agStatusBtn',
          cellRendererParams: {
            getAction: this.rowActions.bind(this),
          },
          minWidth: 150
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
          minWidth: 200
        }
      ];
    }
  }

  getDataPaymentMethod() {
    this.subscription.add(
      this.paymentService.getDataPaymentMethod(this.querySearch, this.currentPage)
        .subscribe(
          (res: any) => {
            this.tableData = res?.data;
            this.initializeAgGrid();
            this.pageOptions.length = res?.total;
            this.existData = true;
            this.errorMassage = true;
          },
          error => {
            this.messageBoxError = error.error;
            this.tableData = [];
            this.initializeAgGrid();
            if (error.error.code === 4000) {
              this.errorMassage = false;
            } else {
              this.errorMassage = true;
              this.existData = false;
            }
          })
    );
  }

  onSearchChange(e) {
    this.currentPage = 1;
    this.getDataPaymentMethod();
  }

  openJournalEntriesDialog(): void {
    const dialogRef = this.matDialog
      .open(JournalEntriesComponent, {
        width: '1200px',
        panelClass: 'custom-dialog-container',
        data: {type: 'paymentMethod'}
      });
  }


  // Dialog For Add And Edit Row
  openAddEditForm(row?): void {
    const dialogRef = this.matDialog.open(PaymentFormComponent, {
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
          this.getDataPaymentMethod();
        }
      }));
  }

  changeStatus(data): void {
    const dialog = this.matDialog
      .open(ConfirmDialogComponent, {
        minWidth: '350px',
        data: {
          message: 'common.changeStatusMessage',
          updateStatus: true
        }
      });
    this.subscription.add(
      dialog.afterClosed().subscribe(
        (result: any) => {
          if ((result)) {
            this.paymentService.changeStatus(data.id, {status: data.status === 1 ? 2 : 1})
              .subscribe((res: any) => {
                this.toaster.success(res.message);
                this.getDataPaymentMethod();
              });
          }
        }));
  }

  delete(data) {
    const dialog = this.matDialog.open(ConfirmDialogComponent, {
      minWidth: '350px',
      data: {
        message: 'common.deleteMessage',
        updateStatus: false,
        url: `users/payment_methods/${data.id}/delete`,
        domainUrl: `${environment.accountant_apiUrl}`
      }
    });
    this.subscription.add(
      dialog.afterClosed().subscribe(res => {
        if (res) {
          this.getDataPaymentMethod();
        }
      }));
  }


  rowActions(data): void {
    if (data.action === 'delete') {
      this.delete(data.data);
    } else if (data.action === 'CHANGE_STATUS') {
      this.changeStatus(data.data);
    } else {
      this.update = true;
      const FormData = {
        ...data.data,
        status: data.data.status === 1,
      };
      this.openAddEditForm(FormData);
    }
  }


  // pagination function
  pageEvent(event) {
    this.currentPage = event;
    this.getDataPaymentMethod();
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

}
