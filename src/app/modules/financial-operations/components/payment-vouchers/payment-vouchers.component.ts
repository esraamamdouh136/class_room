import {Component, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {PaymentVouchersService} from '../../services/payment-vouchers.service';
import {Subscription} from 'rxjs';
import {SharedService} from '../../../../shared/services/shared.service';
import {MatDialog} from '@angular/material/dialog';
import {ToastrService} from 'ngx-toastr';
import {AgGridComponent} from '../../../../shared/components/ag-grid/ag-grid.component';
import {AttachmentsDialogComponent} from '../jornal-entry/attachments-dialog/attachments-dialog.component';
import {Currencies, GuideTree, Tax} from '../../../../shared/model/global';
import {AgAutocompleteComponent} from '../../../../shared/components/ag-grid/cell-renderers/ag-autocomplete/ag-autocomplete';
import {AgActionBtnComponent} from '../../../../shared/components/ag-grid/cell-renderers/ag-action-btn/ag-action-btn.component';
import {TranslateService} from '@ngx-translate/core';
import {ActivatedRoute} from '@angular/router';
import {PaymentVoucherDetails, PaymentVouchers} from '../../models/payment-vouchers';
import {CheckBeginningBalanceService} from '../../../../shared/services/check-beginning-balance.service';
import {NumericCellEditorComponent} from '../../../../shared/components/ag-grid/cell-renderers/ag-numeric-input/ag-numeric-input.component';
import {convertArabicDigitsToEnglish} from '../../../../shared/components/ag-grid/only-english-numbers/only-english-numbers';
import { ListsService } from "src/app/shared/services/list_Service/lists.service";

@Component({
  selector: 'app-payment-vouchers',
  templateUrl: './payment-vouchers.component.html',
  styleUrls: ['./payment-vouchers.component.scss']
})
export class PaymentVouchersComponent implements OnInit, OnDestroy {

  @ViewChild('agGrid') agGrid: AgGridComponent;
  subscription: Subscription = new Subscription();
  currencies: Currencies[] = [];
  guideTree: GuideTree[] = [];
  taxes: Tax[] = [];
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
  paymentVouchers: PaymentVouchers = {};
  paymentMethods = [];
  paymentMethodId = null;
  sandookBalance = {
    credit: null,
    debit: null
  };
  voucherType: 'payment' | 'receipt';
  taxStatus = [
    {
      id: 'tax_included',
      title: this.translateService.instant('general.tax_included')
    },
    {
      id: 'no_tax',
      title: this.translateService.instant('general.no_taxes')
    },
    {
      id: 'tax_not_included',
      title: this.translateService.instant('general.tax_not_included')
    }
  ];
  // ================= Start AG GRID Variables ==================== //
  columnDefs = [];
  rowData: PaymentVoucherDetails[] = [];
  frameworkComponents: any;
  defaultColDef = {
    resizable: true,
  };
  agSelectedRow = null;
  // ================= End AG GRID Variables ==================== //
  hasBalance = true;
  previousPaymentVouchersData:PaymentVouchers = {}; // to restore after cancel edit

  constructor(private paymentVouchersService: PaymentVouchersService,
              private listsService: ListsService,
              private sharedService: SharedService,
              private dialog: MatDialog,
              private translateService: TranslateService,
              private activatedRoute: ActivatedRoute,
              private _sharedService: SharedService,
              private checkBeginningBalanceService: CheckBeginningBalanceService,
              private toastr: ToastrService) {
    this.subscription.add(this.activatedRoute.data.subscribe(data => this.voucherType = data?.component));
    this.frameworkComponents = {
      agAutocomplete: AgAutocompleteComponent,
      agActionBtn: AgActionBtnComponent,
      numericCellEditor: NumericCellEditorComponent
    };
  }

  ngOnInit(): void {

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
          this.checkBeginningBalance();
        }
      })
    );
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  checkBeginningBalance(): void {
    this.paymentVouchers = {};
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
        }
      );
  }

  getPaymentVouchers(target?: string): void {
    this.subscription.add(
      this.paymentVouchersService.getPaymentVouchers(this.voucherType, this.arrow, this.voucherId, target)
        .subscribe(
          (res) => {
            this.paymentVouchers = res?.data?.item || {};
            this.buttons = res.data?.buttons;
            this.assignDataToVariables();
            setTimeout(() => {
              this.initializeAgGrid();
            });
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
    this.getGuideTree();
    this.getCurrencies();
    this.getTaxes();
    this.getPaymentVouchers();
  }

  getSandookBalance(): void {
    if (this.paymentMethodId) {
      this.subscription.add(this.paymentVouchersService
        .getSandookBalance(this.paymentMethodId, this.voucherType)
        .subscribe(
          (res) => {
            this.sandookBalance = res?.item;
          }
        ));
    }
  }


  openAttachmentsDialog(): void {
    const dialogRef = this.dialog.open(AttachmentsDialogComponent, {
      data: {
        attachmentsPaths: this.agSelectedRow?.attachment_paths || null,
        attachments: this.agSelectedRow?.attachments,
        edit: this.isEditing
      },
      width: '600px',
      disableClose: true
    });
  }

  attachmentsCount(): number {
    return this.agSelectedRow?.attachments?.length || 0;
  }

  new(): void {
    this.isEditing = true;
    this.newEntry = true;
    this.errorMassage = true;
    // To restore after add new 
    this.paymentVouchers = {};
    setTimeout(() => {
      this.initializeAgGrid();
    });

    this.agSelectedRow = null;
    this.setDefaultValues();
  }

  goToEntry(event): void {
    if (event.target.value !== this.paymentVouchers?.setting_show) {
      this.arrow = 'equal';
      this.getPaymentVouchers(event.target.value);
    }
  }


  getPaymentMethods(): void {
    this.subscription.add(
      this.paymentVouchersService.getPaymentMethods()
        .subscribe((res) => this.paymentMethods = res?.paginate?.data));
  }

  getGuideTree(): void {
    this.subscription.add(
      this.listsService.getAccountGuideTree(this.selectedCompany)
        .subscribe(
          (res) => {
            this.guideTree = res;
            this.guideTree.splice(0, 1); // remove حسب الاختيار
            this.drawAgGrid();
          }
        )
    );
  }

  getCurrencies(): void {
    this.subscription.add(
      this.listsService.getCurrencies(this.selectedCompany, this.fiscalYearId)
        .subscribe(
          (res) => {
            this.currencies = res.items;
            this.currency = res.items?.filter(i => i?.is_default === 1)[0]?.id;
            this.currencyChanged(this.currency);
          }));
  }

  getTaxes(): void {
    this.subscription.add(
      this.listsService.getTaxes(this.selectedCompany, this.costCenterId)
        .subscribe((res: any) => this.taxes = res.items));
  }


  mapTableData(items: PaymentVoucherDetails[]): PaymentVoucherDetails[] {
    if (items?.length) {
      const clonedItems = JSON.parse(JSON.stringify(items.filter(i => i?.key)));
      items?.filter(i => i?.key)?.forEach((item, index) => {
        if (item?.taxes?.length) {
          let counter = 0;
          const taxes = item?.taxes.map(t => t.tax_id);
          if (clonedItems[index].colType === 'tax') {
            clonedItems.splice(index + 2 + counter++, 0, {
              colType: 'tax',
              value: this.getValueAfterTax(item.value, taxes, item?.tax_status),
              key: 'xx',
              taxes
            });
          } else {
            clonedItems.splice(index + 1, 0, {
              colType: 'tax',
              value: this.getValueAfterTax(item.value, taxes, item?.tax_status),
              key: 'xx',
              taxes
            });
          }
          clonedItems[index].taxes = item?.taxes.map(t => t.tax_id);
          clonedItems[index].colType = '';
        }
      });

      clonedItems.forEach(i => {
        for (const t of i.taxes) {
          if (typeof t === 'object') {
            i.taxes = i.taxes?.map(ti => ti?.tax_id);
          }
        }
      });
      return clonedItems?.filter(i => i?.key)?.map(item => {
        return {
          ...item,
          colType: item?.tax_status ? '' : 'tax',
        };
      });
    } else {
      return [];
    }
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

  accountChanged() {
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
    this.paymentVouchersService
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
    this.paymentMethodId = this.voucherType === 'payment' ?
    this.paymentVouchers?.payment_method_id : this.paymentVouchers?.receipt_method_id;
    this.statement = this.paymentVouchers?.statement;
    this.fiscalYearNumber = this.paymentVouchers.setting_show;
    this.costCenterId = this.paymentVouchers?.cost_center_id;
    this.currency = this.paymentVouchers?.currency_id;
    this.symbol = this.currencies?.filter(c => c.id === this.currency)[0]?.name_symbol;
    this.transferPrice = this.paymentVouchers?.conversion_factor;
    this.original = this.paymentVouchers?.journal_entry?.setting_show;
    this.date = new Date(this.paymentVouchers?.date) || null;
    this.getSandookBalance();
  }

  getTotal(): number {
    let total = 0;
    this.rowData?.forEach((row, index) => {
      if (row?.colType === '') {
        if (row?.tax_status === 'tax_not_included') {
          total += +row?.value + this.rowData[index + 1]?.value || 0;
        } else {
          total += +row?.value || 0;
        }
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
      this.voucherId = String(this.paymentVouchers?.id);
      this.arrow = 'next';
      this.getPaymentVouchers();
      this.newEntry = false;
      this.isEditing = false;
    }
  }

  previous(): void {
    if (this.buttons?.previous) {
      this.setDefaultValues();
      this.voucherId = String(this.paymentVouchers?.id);
      this.arrow = 'previous';
      this.getPaymentVouchers();
      this.newEntry = false;
      this.isEditing = false;
    }
  }

  last(): void {
    if (this.isLastPage()) {
      this.setDefaultValues();
      this.voucherId = String(this.paymentVouchers?.id);
      this.arrow = 'last';
      this.getPaymentVouchers();
      this.newEntry = false;
      this.isEditing = false;
    }
  }

  first(): void {
    this.setDefaultValues();
    this.voucherId = String(this.paymentVouchers?.id);
    this.arrow = 'first';
    this.getPaymentVouchers();
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

      }, 100);
    } else {
      setTimeout(() => {
        this.currency = null;
        this.currencyChanged(this.currency);

      }, 100);
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

  }

  prePost(): void {
    let data = JSON.parse(JSON.stringify(this.rowData));
    this.formData = new FormData();
    // add global values
    data.filter(d => d?.value && d?.colType === '')
      .forEach(row => {
        if (!row?.statement) {
          row.statement = this.statement;
        }
      });


    data = data?.filter(d => d?.colType === '' && d?.value > 0);
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
      this.formData.append('id', this.paymentVouchers?.id?.toString());
    }
    // append data outside the table
    this.formData.append('statement', this.statement);
    this.formData.append('date', this.date?.toLocaleDateString('en-GB'));
    this.formData.append(this.voucherType === 'payment' ? 'payment_method_id' : 'receipt_method_id', this.paymentMethodId);
    this.formData.append('currency_id', this.currency);

    const object = {};
    this.formData.forEach((value, key) => {
      object[key] = value;
    });
  }

  postData(): void {
    this.prePost();

    this.paymentVouchersService.addPaymentVoucher(this.formData, this.voucherType)
      .subscribe(
        (res) => {
          this.isEditing = false;
          this.newEntry = false;
          this.agSelectedRow = null;
          this.page = 1;
          this.arrow = 'equal';
          this.getPaymentVouchers(res?.item?.setting_show.toString());
          this.toastr.success('تم الحفظ بنجاح');
        }, err => {
          this.errorToaster(err);
        }
      );
  }

//  AG Grid Methods
  initializeAgGrid(): void {
    this.drawAgGrid();
    this.rowData = this.mapTableData(this.paymentVouchers?.details) || [];
    if (!this.rowData?.length) { // if there are not items in the table then add 5 rows
      for (let i = 1; i <= 1; i++) {
        this.onAddRow();
      }
    } else { // if the items in the table is less than 5 then add rows until it becomes a table of 5 rows

      for (let i = 1; i >= this.paymentVouchers?.details?.length; i--) {
        this.onAddRow();
      }
    }
  }

  drawAgGrid(): void {
    this.columnDefs = [
      {
        headerName: '#',
        valueGetter: 'node.rowIndex + 1',
        filter: true,
        // rowDrag: true,
        minWidth: 80
      },
      {
        headerName: 'المبلغ',
        field: 'value',
        valueParser: (params) => {
          return convertArabicDigitsToEnglish(params.newValue);
        },
        editable: (params) => params.data.colType === '' && this.isEditing,
        minWidth: 100
      },
      {
        headerName: 'الضريبة',
        field: 'tax_status',
        cellRenderer: 'agAutocomplete',
        cellRendererParams: {
          setData: this.setTaxStatus.bind(this),
          selectedKey: 'tax_status',
          values: this.taxStatus,
          disabled: !this.isEditing,
          bindValue: 'id',
          bindLabel: 'title',
          multiple: false
        },
        sortable: true,
        minWidth: 350,
        valueGetter: (params) => {
          if (params.data.colType === 'tax') {
            params.colDef.field = 'taxes';
            params.colDef.cellRendererParams.values = this.taxes;
            params.colDef.cellRendererParams.multiple = true;
            params.colDef.cellRendererParams.bindLabel = 'name';
            params.colDef.cellRendererParams.setData = this.setTaxes.bind(this);
            params.colDef.cellRendererParams.selectedKey = 'taxes';
          } else if (params.data.colType === '') {
            params.colDef.field = 'taxes_status';
            params.colDef.cellRendererParams.values = this.taxStatus;
            params.colDef.cellRendererParams.multiple = false;
            params.colDef.cellRendererParams.bindLabel = 'title';
            params.colDef.cellRendererParams.setData = this.setTaxStatus.bind(this);
            params.colDef.cellRendererParams.selectedKey = 'tax_status';
          }
        },

      },
      {
        headerName: 'الحساب',
        field: 'account_guide_id',
        cellRenderer: 'agAutocomplete',
        cellRendererParams: {
          setData: this.setAccGuideId.bind(this),
          selectedKey: 'account_guide_id',
          values: this.guideTree,
          disabled: true,
          bindValue: 'id',
          bindLabel: 'viewLabel',
        },
        valueGetter: (params) => {
          if (params.data.colType === 'tax' && this.isEditing) {
            params.colDef.cellRendererParams.disabled = true;
          } else if (this.isEditing && params.data.colType === '') {
            params.colDef.cellRendererParams.disabled = false;
          }
        },
        sortable: true,
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
          actions: [
            {
              action: 'delete',
              style: {
                color: '#F64E60',
                backgroundColor: 'rgba(#F64E60, 0.2)'
              }
            },
          ],
          disabled: !this.isEditing,
          getAction: this.getAction.bind(this),
        },
        minWidth: 130
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
      uploadedFiles: []
    };
    if (specificRow) {
      const insertedIndex = this.rowData.indexOf(this.agSelectedRow) + 1;
      console.log(insertedIndex);
      
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

  setAccGuideId(e) {
    if (e) {
      e.data.account_guide_id = e.event;
    }
  }

  setTaxes(e) {
    e.data.taxes = e.event;
    const previousRow = this.rowData.indexOf(e.data) - 1;
    this.rowData[previousRow].taxes = e.event;
    e.data.value = this.getValueAfterTax(this.rowData[previousRow].value, e.event, this.rowData[previousRow].tax_status);
    this.refreshTable();
  }

  getValueAfterTax(value: number, taxes: number[], taxType: string): number {
    const targetTaxes = this.taxes.filter(t => taxes.includes(t.id));
    let totalPercent = 0;
    targetTaxes.forEach(t => {
      totalPercent += t.percentage;
    });
    switch (taxType) {
      case 'tax_included': {
        return Number((value / ((totalPercent / 100) + 1)).toFixed(2)); // 115 - (15 / 100) * 115
      }
      case 'tax_not_included': {
        return Number(((totalPercent / 100) * value).toFixed(2));
      }
      default:
        return Number(value.toFixed(2));
    }
  }

  setTaxStatus(e) {
    if (e) {
      e.data.tax_status = e.event;
      if (e.event === 'tax_included' || e.event === 'tax_not_included') {
        this.onAddRow('tax', true);
      } else {
        const deletedIndex = this.rowData.indexOf(this.agSelectedRow) + 1;
        if (deletedIndex && this.rowData[deletedIndex]?.colType === 'tax' && e.event === 'no_tax') {
          this.onDeleteRow(this.rowData[deletedIndex]);
        }
      }
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
    this.previousPaymentVouchersData = this.paymentVouchers;
    this.drawAgGrid()
  }

  // cancelEditOrAdd
  cancelEditOrAdd(){
    if(this.isEditing && !this.newEntry){
      this.isEditing = false;
      this.paymentVouchers = this.previousPaymentVouchersData;
      this.assignDataToVariables();
      setTimeout(() => {
        this.initializeAgGrid();
      });
    } else {
      this.isEditing = false;
      this.newEntry = false;
      this.getPaymentVouchers();
    }
    this.agSelectedRow = null
  }
}
