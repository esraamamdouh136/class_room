import {Component, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {AgGridComponent} from '../../../../shared/components/ag-grid/ag-grid.component';
import {Subscription} from 'rxjs';
import {Currencies, GuideTree} from '../../../../shared/model/global';
import {PaymentVoucherDetails, PaymentVouchers} from '../../models/payment-vouchers';
import {SharedService} from '../../../../shared/services/shared.service';
import {MatDialog} from '@angular/material/dialog';
import {TranslateService} from '@ngx-translate/core';
import {ActivatedRoute} from '@angular/router';
import {ToastrService} from 'ngx-toastr';
import {AgAutocompleteComponent} from '../../../../shared/components/ag-grid/cell-renderers/ag-autocomplete/ag-autocomplete';
import {AgActionBtnComponent} from '../../../../shared/components/ag-grid/cell-renderers/ag-action-btn/ag-action-btn.component';
import {AttachmentsDialogComponent} from '../jornal-entry/attachments-dialog/attachments-dialog.component';
import {CollectionFromParentsService} from '../../services/collection-from-parents/collection-from-parents.service';
import {Invoice, Ledger, LedgerDetails, Student} from '../../models/collection-from-parents/collection-from-parents';
import {FiscalYear} from '../../../financial-setting/models/fiscalYears/fiscalYear';
import {CheckBeginningBalanceService} from '../../../../shared/services/check-beginning-balance.service';
import {convertArabicDigitsToEnglish} from '../../../../shared/components/ag-grid/only-english-numbers/only-english-numbers';
import * as moment from 'moment';
import { ListsService } from "src/app/shared/services/list_Service/lists.service";

@Component({
  selector: 'app-collection-from-parents',
  templateUrl: './collection-from-parents.component.html',
  styleUrls: ['./collection-from-parents.component.scss']
})
export class CollectionFromParentsComponent implements OnInit, OnDestroy {
  @ViewChild('agGrid') agGrid: AgGridComponent;
  @ViewChild('ledgerTable') ledgerTable: AgGridComponent;
  subscription: Subscription = new Subscription();
  currencies: Currencies[] = [];
  guideTree: GuideTree[] = [];
  taxes = [];
  page = 1;
  isEditing = false;
  lastPage = 1;
  formErrors = {};
  selectedCompany: number;
  fiscalYearId: number;
  errorMassage = true;
  arrow: 'first' | 'last' | 'next' | 'equal' | 'previous' = 'first';
  voucherId = '';
  symbol = '';
  buttons = {
    first: true,
    last: true,
    next: true,
    previous: true,
  };

  messageBoxError: {};
  costCenterId = null;
  date = null;
  currency = null;
  transferPrice: number = null;
  fiscalYearNumber = null;
  formData: FormData = new FormData();
  original: number;
  newEntry = false;
  statement = '';
  parentCollections: PaymentVouchers = {};
  paymentMethods = [];
  paymentMethodId = null;
  sandookBalance = {
    credit: null,
    debit: null
  };
  voucherType: 'collections' | '';
  // ================= Start AG GRID Variables ==================== //
  columnDefs = [];
  rowData: PaymentVoucherDetails[] = [];
  frameworkComponents: any;
  defaultColDef = {
    resizable: true,
    flex: 1
  };
  agSelectedRow = null;
  ledgerColumnDefs = [];
  ledgerDetails: LedgerDetails[] = [];
  ledgerData: Ledger = {};
  // ================= End AG GRID Variables ==================== //
  totalReceived = null;
  students: Student[] = [];
  invoices: Invoice[] = [];
  fiscalYears: FiscalYear[] = [];
  selectedFiscalYear: FiscalYear = {};
  hasBalance = true;
  /** Start
   * To handel after choose student and 
   * change the amount field we request the invoices again with the new amount  
  */
   selectedStudentFatherId:any;
   selectedStudentId:any;
   previousParentCollections:PaymentVouchers = {}; // to restore after cancel edit


  constructor(private listsService: ListsService,
              private sharedService: SharedService,
              private dialog: MatDialog,
              private translateService: TranslateService,
              private activatedRoute: ActivatedRoute,
              private _sharedService: SharedService,
              private toastr: ToastrService,
              private checkBeginningBalanceService: CheckBeginningBalanceService,
              private collectionFromParentsService: CollectionFromParentsService) {
    this.subscription.add(this.activatedRoute.data.subscribe(data => this.voucherType = data?.component));
    this.frameworkComponents = {
      agAutocomplete: AgAutocompleteComponent,
      agActionBtn: AgActionBtnComponent
    };
  }

  ngOnInit(): void {
    this.initializeLedgerTable();
    this.subscription.add(
      this.activatedRoute.queryParams.subscribe(res => {
        if (res?.id) {
          this.voucherId = res.id;
          this.arrow = 'equal';
        }
      })
    );

    this.subscription.add(
      this._sharedService.navChanged$.subscribe(data => {
        if (data) {
          this.selectedCompany = data.companyNum;
          this.fiscalYearId = data.fiscalYear;
          this.costCenterId = data.costCenter;
          this.selectedFiscalYear = this.fiscalYears.filter(year => year.id === this.fiscalYearId)[0];
          this.checkBeginningBalance();
          this.isEditing = false;
          this.newEntry = false;
        }
      })
    );

    this.subscription.add(
      this.sharedService.fiscalYears$
        .subscribe(
          (res) => {
            this.fiscalYears = res.data;
            this.selectedFiscalYear = this.fiscalYears.filter(year => year.id === this.fiscalYearId)[0];
          }
        )
    );

  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  checkBeginningBalance(): void {
    this.parentCollections = {};
    this.setDefaultValues(true);
    setTimeout(() => {
      this.initializeAgGrid();
    });
    this.checkBeginningBalanceService
      .checkBeginningBalance()
      .subscribe(
        (res: any) => {
          this.getAllData();
          this.hasBalance = true;
        }, err => {
          this.hasBalance = false;
        });
  }

  getParentCollections(target?: string): void {
    this.subscription.add(
      this.collectionFromParentsService.getParentCollection(this.voucherType, this.arrow, this.voucherId, target)
        .subscribe(
          (res) => {
            this.parentCollections = res?.data?.item || {};
            this.buttons = res.data?.buttons;
            this.getLedger(this.parentCollections?.details[0]?.father?.id);
            this.assignDataToVariables();
            setTimeout(() => {
              this.initializeAgGrid();
            }, 60);
            this.errorMassage = true;
          }, (error) => {
            this.messageBoxError = error.error;
            this.errorMassage = false;
            this.setDefaultValues(true);
          }
        )
    );
  }

  getAllData(): void {
    this.getPaymentMethods();
    this.getCurrencies();
    this.getStudents();
    this.getParentCollections();
  }

  getLedger(fatherId?: number): void {
    const options = {
      father_id: fatherId,
      status: 'Active',
      is_parents_receivable: 1,
      date_from: new Date(this.selectedFiscalYear?.start_at).toLocaleDateString('en-GB'),
      date_to: new Date().toLocaleDateString('en-GB'),
    };

    this.collectionFromParentsService
      .getLedgerData(options)
      .subscribe(
        (res) => {
          this.ledgerData = res;
          this.ledgerDetails = res?.items;
          this.initializeLedgerTable();
        }
      );
  }

  getSandookBalance(): void {
    if (this.paymentMethodId) {
      this.subscription.add(this.collectionFromParentsService
        .getSandookBalance(this.paymentMethodId, this.voucherType)
        .subscribe(
          (res) => {
            this.sandookBalance = res?.item;
          }
        ));
    }
  }

  getInvoicesByStudentId(id: { student_id?: number, father_id?: number,amount?:number }, sortBy: number): void {
    this.subscription.add(this.collectionFromParentsService
      .getInvoices(id)
      .subscribe(
        (res) => {
          this.invoices = res.sort((a, b) => (a.student_id === sortBy) > (b.student_id === sortBy) ? -1 : 1); // sort by selected student
          if (!this.invoices.length) {
          }
          this.fillTableByInvoices();
        }
      )
    );
  }

  fillTableByInvoices(): void {
    if (this.invoices.length) {
      this.rowData = [];
      this.invoices.forEach((invoice, index) => {
        const newRow: PaymentVoucherDetails = {
          total_invoice_value: +invoice?.value.toFixed(2),
          value: +invoice?.amount.toFixed(2) ,
          statement: invoice?.name,
          total_paid: +invoice?.paid.toFixed(2),
          rest: +invoice.rest.toFixed(2),
          student_id: invoice.student_id,
          attachments: [],
          colType: '',
          tax_status: '',
          tag: '',
          key: 'xx',
          father: invoice.father,
          account_guide_id: null,
          uploadedFiles: [],
          invoice_id: invoice?.id,
          due_date: invoice?.due_date
        };
        if (index === 0) {
          this.rowData[0] = newRow;
        } else {
          this.rowData.push(newRow);
        }
        this.rowData = this.rowData.slice();
        this.refreshTable();
      });

      /**
       * distributeTotal depend on Islam
       */
      // if (this.totalReceived > 0) {
      //   this.distributeTotal();
      // }


    } else {
      // will reset the table data
      const firstRow = this.rowData[0];
      firstRow.rest = null;
      firstRow.autoValue = false;
      firstRow.total_paid = null;
      firstRow.total_invoice_value = null;
      firstRow.invoice_id = null;
      firstRow.statement = null;
      firstRow.due_date = null;
      this.rowData = [firstRow];
    }
  }

  distributeTotal(): void {
    if (this.invoices?.length && this.totalReceived > 0) {
      let total = this.totalReceived;
      // this.rowData?.forEach(row => {
      //   row.autoValue = true;
      //   if (total === 0) {
      //     return;
      //   } else if (row?.rest === total) {
      //     row.value = total;
      //     total = 0;
      //     return;
      //   } else if (row?.rest < total) {
      //     row.value = row?.rest;
      //     total -= row?.rest;
      //   } else if (row?.rest > total && total !== 0) {
      //     row.value = total;
      //     total = 0;
      //     return;
      //   }
      // });

      // if (total > 0) {
      //   // insert new row with the rest from total
      //   const newRow: PaymentVoucherDetails = {
      //     value: total,
      //     father_id: this.rowData[0]?.father?.id,
      //     attachments: [],
      //     father: this.rowData[0]?.father,
      //     colType: 'rest',
      //     tax_status: '',
      //     tag: '',
      //     statement: 'الباقي',
      //     key: 'xx',
      //   };
      //   this.rowData.push(newRow);
      //   this.rowData = this.rowData.slice();
      // }
      this.getInvoicesByStudentId({father_id: this.selectedStudentFatherId,amount:+total}, this.selectedStudentId); // 5 for test

      this.refreshTable();
    }
  }

  openAttachmentsDialog(): void {
    this.dialog.open(AttachmentsDialogComponent, {
      data: {
        attachmentsPaths: this.agSelectedRow?.attachment_paths || null,
        attachments: this.agSelectedRow?.attachments,
        edit: this.isEditing
      },
      width: '600px',
      disableClose: true,
      panelClass: 'custom-dialog-container'
    });
  }

  attachmentsCount(): number {
    return this.agSelectedRow?.attachments?.length || 0;
  }

  new(): void {
    this.isEditing = true;
    this.newEntry = true;
    this.errorMassage = true;
    this.parentCollections = {};

    setTimeout(() => {
      this.initializeAgGrid();
    });

    this.agSelectedRow = null;
    this.setDefaultValues();
  }

  getStudents(): void {
    this.subscription.add(
      this.collectionFromParentsService.getStudents(this.selectedCompany)
        .subscribe(
          (res) => {
            this.students = res;
          }
        ));
  }

  goToEntry(event): void {
    if (event?.target?.value !== this.parentCollections?.setting_show) {
      this.arrow = 'equal';
      this.getParentCollections(event.target.value);
    }
  }


  getPaymentMethods(): void {
    this.subscription.add(
      this.collectionFromParentsService.getPaymentMethods()
        .subscribe((res) => this.paymentMethods = res?.paginate?.data));
  }

  getCurrencies(): void {
    this.subscription.add(
      this.listsService.getCurrencies(this.selectedCompany, this.fiscalYearId)
        .subscribe(
          (res) => {
            this.currencies = res.items;
            this.currency = res.items?.filter(i => i?.is_default === 1)[0]?.id;
            this.currencyChanged(this.currency);
          }
        )
    );
  }

  mapTableData(items: PaymentVoucherDetails[]): PaymentVoucherDetails[] {
    return items?.map(item => {
      return {
        ...item,
        colType: item?.key ? '' : 'tax',
        student_id: item?.key ? item?.student?.id : null
      };
    }).filter(i => i.colType === '');
  }


  errorToaster(err): void {
    for (const error in err.error) {
      if (Array.isArray(err?.error[error])) {
        if (typeof err?.error[error][0] === 'object') {
          // tslint:disable-next-line:forin
          for (const item in err?.error[error]) {
            // tslint:disable-next-line:forin
            for (const subItem in err?.error[error][item]) {
              this.toastr.error(err?.error[error][item][subItem]?.map(x => x));
            }
          }
        } else {
          this.toastr.error(err.error[error]?.map(x => x));
        }
      }
    }
  }

  dateChanged(evt) {
    this.date = evt;
    this.getFiscalYearByDate();
  }

  accountChanged(evt) {
    this.getSandookBalance();
  }

  currencyChanged(evt) {
    this.transferPrice = this.currencies?.filter(c => c?.id === evt)[0]?.rate;
  }


  onImageUpload(event): void {
    if (event?.target?.files && event?.target?.files?.length) {
      const index = this.rowData.indexOf(this.agSelectedRow);
      this.rowData[index].uploadedFiles = event?.target?.files;
    }
  }

  getFiscalYearByDate(): void {
    this.collectionFromParentsService
      .getNumber(this.date?.toLocaleDateString('en-GB'), this.voucherType)
      .subscribe(
        (res) => {
          if (res.code === 400) {
            this.date = null;
          }
          this.fiscalYearNumber = res?.item?.setting_show;
        }, err => {
          this.date = null;
        }
      );
  }

  assignDataToVariables(): void {
    this.paymentMethodId = this.voucherType === 'collections' ?
      this.parentCollections?.payment_method_id : this.parentCollections?.receipt_method_id;
    this.statement = this.parentCollections?.statement;
    this.fiscalYearNumber = this.parentCollections.setting_show;
    this.costCenterId = this.parentCollections?.cost_center_id;
    this.currency = this.parentCollections?.currency_id;
    this.symbol = this.currencies?.filter(c => c.id === this.currency)[0]?.name_symbol;
    this.transferPrice = this.parentCollections?.conversion_factor;
    this.original = this.parentCollections?.journal_entry?.setting_show;
    // this.date = new Date(this.parentCollections?.date) || null;
    this.date = moment(this.parentCollections?.date, 'DD/MM/YYYY').toDate()
    this.totalReceived = this.parentCollections?.total_received;
    this.getSandookBalance();
  }

  getTotal(): number {
    let total = 0;
    this.rowData?.forEach((row, index) => {
      if (row?.colType === '') {
        total += +row?.value || 0;
      }
    });
    return total || 0;
  }

  getDifference(): number {
    return Math.abs(this.getTotal() - this.sandookBalance?.credit || 0);
  }

//    pagination
  next(): void {
    if (this.isLastPage()) {
      this.setDefaultValues();
      this.voucherId = String(this.parentCollections?.id);
      this.arrow = 'next';
      this.getParentCollections();
      this.newEntry = false;
      this.isEditing = false;
    }
  }

  previous(): void {
    if (this.buttons?.previous) {
      this.setDefaultValues();
      this.voucherId = String(this.parentCollections?.id);
      this.arrow = 'previous';
      this.getParentCollections();
      this.newEntry = false;
      this.isEditing = false;
    }
  }

  last(): void {
    if (this.isLastPage()) {
      this.setDefaultValues();
      this.voucherId = String(this.parentCollections?.id);
      this.arrow = 'last';
      this.getParentCollections();
      this.newEntry = false;
      this.isEditing = false;
    }
  }

  first(): void {
    this.setDefaultValues();
    this.voucherId = String(this.parentCollections?.id);
    this.arrow = 'first';
    this.getParentCollections();
    this.newEntry = false;
    this.isEditing = false;
  }

  isLastPage(): boolean {
    return this.buttons?.last;
  }

  setDefaultValues(noResults?: boolean): void {
    this.buttons = {
      first: false,
      last: false,
      next: false,
      previous: false,
    };
    this.paymentMethodId = null;
    this.statement = '';
    setTimeout(() => {
      this.date = new Date();
    });
    if (!noResults) {
      setTimeout(() => {
        this.currency = this.currencies?.filter(i => i?.is_default === 1)[0]?.id;
        this.currencyChanged(this.currency);
      });
    } else {
      setTimeout(() => {
        this.currency = null;
        this.currencyChanged(this.currency);
      });
    }
    this.sandookBalance = {
      credit: null,
      debit: null
    };
    setTimeout(() => {
      this.sharedService.selectedConstCenterId$.subscribe(
        (res) => {
          this.costCenterId = res;
        }
      );
    }, 100);
    this.agSelectedRow = null;
    this.original = null;
    this.fiscalYearNumber = null;
    this.totalReceived = 0;

    this.ledgerDetails = [];
    this.ledgerData = {};
  }

  prePost(): void {
    let data = JSON.parse(JSON.stringify(this.rowData));
    this.formData = new FormData();
    // add global values
    data.filter(d => d?.value && d?.colType === '')
      .forEach(row => {
          if (!row?.statement) {
            row.statement = this.statement;
            delete row.rest;
          }
        }
      );

    data = data?.filter(d => d?.value > 0);
    // append data from table
    for (let i = 0; i < data?.length; i++) {
      for (const key in data[i]) {
        if (data[i]?.hasOwnProperty(key) && data[i][key]) {
          if (key !== null && key === 'uploadedFiles') {
            let targetIndex = -1;
            this.rowData.forEach((r, index) => {
              if (r.key === data[i].key) {
                targetIndex = index;
              }
            });
            for (const item of this.rowData[targetIndex][key] || []) {
              if (typeof item === 'object') {
                this.formData.append(`journal_entry[${i}][attachments][]`, item, item?.name);
              }
            }
          } else if (key === 'attachments') {
            for (const item of data[i][key]) {
              if (typeof item === 'string') {
                this.formData.append(`journal_entry[${i}][pattachments][]`, item);
              }
            }
          } else if (key === 'taxes') {
            for (const item of data[i][key]) {
              this.formData.append(`journal_entry[${i}][taxes][]`, item.toString());
            }
          } else if (!Array.isArray(key) && key !== 'attachments' && key !== 'uploadedFiles') {
            this.formData.append(`journal_entry[${i}][${key}]`, data[i][key]);
          }

        }
      }
    }

    if (!this.newEntry) {
      this.formData.append('id', this.parentCollections?.id?.toString());
    }

    if (this.totalReceived === 0) {
      this.totalReceived = this.getTotal();
    }
    // append data outside the table
    this.formData.append('statement', this.statement);
    this.formData.append('date', this.date?.toLocaleDateString('en-GB'));
    this.formData.append(this.voucherType === 'collections' ? 'payment_method_id' : 'receipt_method_id', this.paymentMethodId);
    this.formData.append('currency_id', this.currency);
    this.formData.append('total_received', this.totalReceived.toString());

    const object = {};
    this.formData.forEach((value, key) => {
      object[key] = value;
    });
  }

  postData(): void {
    this.prePost();
    this.subscription.add(
      this.collectionFromParentsService.addParentCollection(this.formData, this.voucherType)
        .subscribe(
          (res) => {
            this.isEditing = false;
            this.newEntry = false;
            this.agSelectedRow = null;
            this.page = 1;
            this.arrow = 'equal';
            this.getParentCollections(res?.item?.setting_show);
          }, err => {
            this.errorToaster(err);
          }
        )
    );
  }

//  AG Grid Methods
  initializeAgGrid(): void {
    this.drawAgGrid();
    this.rowData = this.mapTableData(this.parentCollections?.details) || [];

    if (!this.rowData?.length) { // if there are not items in the table then add 5 rows
      for (let i = 1; i <= 1; i++) {
        this.onAddRow();
      }
    } else { // if the items in the table is less than 5 then add rows until it becomes a table of 5 rows

      for (let i = 1; i >= this.parentCollections?.details?.length; i--) {
        this.onAddRow();
      }
    }
  }

  initializeLedgerTable(): void {
    this.drawLedger();
  }

  drawAgGrid(): void {
    this.columnDefs = [
      {
        headerName: '#',
        valueGetter: 'node.rowIndex + 1',
        filter: true,
        minWidth: 80
      },
      {
        headerName: 'المستلم',
        field: 'value',
        valueParser: (params) => {
          return convertArabicDigitsToEnglish(params.newValue);
        },
        editable: (params) => params.data.colType === '' && this.isEditing && this.totalReceived <= 0,
        minWidth: 150
      },
      {
        headerName: 'المبلغ',
        field: 'total_invoice_value',
        editable: false,
        minWidth: 150
      },
      {
        headerName: 'المسدد',
        field: 'total_paid',
        editable: false,
        valueGetter: 'Number(data.total_paid) + Number(data.value) || 0',
        minWidth: 150
      },
      {
        headerName: 'الباقي',
        field: 'rest',
        editable: false,
        valueGetter: 'data.total_invoice_value && data?.value ? (data.rest - data.value) : data.rest',
        aggFunc: 'sum',
        minWidth: 150
      },
      {
        headerName: 'الطالب',
        field: 'student.id',
        cellRenderer: 'agAutocomplete',
        cellRendererParams: {
          setData: this.setStudentId.bind(this),
          selectedKey: 'student_id',
          values: this.students,
          disabled: true,
          bindValue: 'id',
          bindLabel: 'full_name',
        },
        valueGetter: (params) => {
          if (params.data.colType === 'rest' && this.isEditing) {
            params.colDef.cellRendererParams.disabled = true;
          } else if (this.isEditing && params.data.colType === '') {
            params.colDef.cellRendererParams.disabled = false;
          }
        },
        sortable: true,
        minWidth: 400
      },
      {
        headerName: 'ولي الأمر',
        field: 'father.name',
        editable: (params) => params.data.colType === '' && this.isEditing,
        minWidth: 200
      },
      {
        headerName: 'البيان',
        field: 'statement',
        editable: (params) => params.data.colType === '' && this.isEditing,
        minWidth: 200
      },
      {
        headerName: 'تحليلي',
        field: 'tag',
        editable: (params) => params.data.colType === '' && this.isEditing,
        minWidth: 180
      },
      {
        headerName: 'الإجراءات',
        cellRenderer: 'agActionBtn',
        cellRendererParams: {
          actions: [{
            action: 'delete',
            style: {
              color: '#F64E60',
              backgroundColor: 'rgba(#F64E60, 0.2)'
            }
          }],
          disabled: !this.isEditing,
          getAction: this.getAction.bind(this),
        },
        minWidth: 130
      }
    ];
  }

  drawLedger(): void {
    this.ledgerColumnDefs = [
      {
        headerName: '#',
        valueGetter: 'node.rowIndex + 1',
        filter: true,
        minWidth: 80
      },
      {
        headerName: 'التاريخ',
        field: 'date',
        minWidth: 150
      },
      {
        headerName: 'السند',
        field: 'journal_module.name',
        minWidth: 150
      },
      {
        headerName: 'البيان',
        field: 'statement',
        minWidth: 150
      },
      {
        headerName: 'مدين',
        field: 'debit',
        minWidth: 150
      },
      {
        headerName: 'دائن',
        field: 'credit',
        minWidth: 150
      }
    ];
  }

  refreshTable(): void {
    this.agGrid?.gridApi?.redrawRows();
  }

  onAddRow(type?: string, specificRow?: boolean): void {
    const obj: PaymentVoucherDetails = {
      value: null,
      attachments: [],
      colType: type || '',
      tax_status: '',
      tag: '',
      key: 'xx',
      account_guide_id: null,
      uploadedFiles: [],
      father: null
    };
    if (specificRow) {
      const insertedIndex = this.rowData.indexOf(this.agSelectedRow) + 1;
      if (this.rowData?.length === insertedIndex) {
        this.rowData.push(obj);
      } else if (this.rowData[insertedIndex].colType !== 'tax') {
        this.rowData.splice(insertedIndex, 0, obj);
      }
    } else {
      this.rowData.push(obj);
    }
    this.rowData = this.rowData.slice();
    this.refreshTable();
  }

  onDeleteRow(row): void {
    const itemIndex = this.rowData.indexOf(row);
    this.rowData.splice(itemIndex, 1);
    this.rowData = this.rowData.slice();
  }

  onRowSelectionChange(row) {
    this.agSelectedRow = row;
  }

  onUpdateData(event): void {
    this.rowData = event;
  }

  setStudentId(e) {
    if (e) {
      /** Start
       * To handel after choose student and 
       * change the amount field we request the invoices again with the new amount  
       */
      /** End */
      console.log(e);
      

      e.data.student_id = e.event;
      setTimeout(() => {
        const father = this.students?.filter(std => std.id === e.event)[0]?.parent;
        this.selectedStudentFatherId = father?.id;
        this.selectedStudentId = father?.id;
        e.data.father = father;
        this.getInvoicesByStudentId({father_id: father?.id}, e.event);
        this.getLedger(father?.id);
      });
      this.refreshTable();
    }
  }

  getAction(e) {
    if (e.action === 'delete') {
      this.onDeleteRow(e.data);
    }
  }


  // Edit
  edit(){
    this.isEditing = true; 
    this.agSelectedRow = '';
    this.previousParentCollections = this.parentCollections;
    this.drawAgGrid()
  }

  // cancelEditOrAdd
  cancelEditOrAdd(){
    if(this.isEditing && !this.newEntry){
      this.isEditing = false;
      this.parentCollections = this.previousParentCollections;
      this.assignDataToVariables();
      setTimeout(() => {
        this.initializeAgGrid();
      });
    } else {
      this.isEditing = false;
      this.newEntry = false;
      this.getParentCollections();
    }
    this.agSelectedRow = null;
  }

}
