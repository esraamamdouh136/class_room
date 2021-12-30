import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { CostCenter, Currencies, GuideTree } from '../../../../shared/model/global';
import { Subscription } from 'rxjs';
import { SharedService } from '../../../../shared/services/shared.service';
import { JournalEntriesService } from '../../../../shared/services/journal-entries.service';
import { MatDialog } from '@angular/material/dialog';
import { AttachmentsDialogComponent } from './attachments-dialog/attachments-dialog.component';
import { ToastrService } from 'ngx-toastr';
import { JournalEntry, JournalEntryDetails, JournalModule } from '../../models/journal-entry';
import { AgAutocompleteComponent } from '../../../../shared/components/ag-grid/cell-renderers/ag-autocomplete/ag-autocomplete';
import { AgActionBtnComponent } from '../../../../shared/components/ag-grid/cell-renderers/ag-action-btn/ag-action-btn.component';
import { AgGridComponent } from '../../../../shared/components/ag-grid/ag-grid.component';
import { ActivatedRoute } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { FiscalYear } from '../../../financial-setting/models/fiscalYears/fiscalYear';
import { CheckBeginningBalanceService } from '../../../../shared/services/check-beginning-balance.service';
import { convertArabicDigitsToEnglish } from '../../../../shared/components/ag-grid/only-english-numbers/only-english-numbers';
import { ListsService } from "src/app/shared/services/list_Service/lists.service";
import * as moment from "moment";

@Component({
  selector: 'app-jornal-entry',
  templateUrl: './jornal-entry.component.html',
  styleUrls: ['./jornal-entry.component.scss'],
})
export class JornalEntryComponent implements OnInit, OnDestroy {
  @ViewChild('agGrid') agGrid: AgGridComponent;
  subscription: Subscription = new Subscription();
  formData: FormData = new FormData();
  isEditing = false;
  page: number = 1;
  lastPage = 1;
  errorMassage = true;
  arrow: 'first' | 'last' | 'next' | 'equal' | 'previous' = 'first';
  journalId = '';
  buttons = {
    first: false,
    last: false,
    next: false,
    previous: false,
  };
  messageBoxError: {};
  formErrors = {};
  selectedCompany: number;
  fiscalYearId: number;
  date = null;
  journalEntry: JournalEntry = {
    cost_center_id: null,
    statement: '',
  };
  symbol = '';
  statement = '';
  costCenterId = null;
  journalModuleId = null;
  currency = null;
  transferPrice: number = null;
  fiscalYearNumber = null;
  original: string;
  newEntry = false;
  component = '';   //  specify which component is rendered
  guideTree: GuideTree[] = [];
  journalModules: JournalModule[] = [];
  costCenters: CostCenter[] = [];
  currencies: Currencies[] = [];
  fiscalYears: FiscalYear[] = [];

  // ================= Start AG GRID Variables ==================== //
  columnDefs: any[] = [];
  rowData: JournalEntryDetails[] = [];
  frameworkComponents: any;
  defaultColDef = {
    resizable: true,
  };
  agSelectedRow: any;
  hasBalance = true;

  constructor(
    private listsService: ListsService,
    private sharedService: SharedService,
    private dialog: MatDialog,
    private toastr: ToastrService,
    private activatedRoute: ActivatedRoute,
    private _sharedService: SharedService,
    private translate: TranslateService,
    private journalEntriesService: JournalEntriesService,
    private checkBeginningBalanceService: CheckBeginningBalanceService,
  ) {
    this.subscription.add(
      this.activatedRoute.data.subscribe(
        (data) => (this.component = data?.component)
      )
    );
    this.frameworkComponents = {
      agAutocomplete: AgAutocompleteComponent,
      agActionBtn: AgActionBtnComponent,
    };
  }

  ngOnInit(): void {
    this.subscription.add(
      this.activatedRoute.queryParams.subscribe((res) => {
        if (res?.id) {
          this.journalId = res.id;
          this.arrow = 'equal';
        }
      })
    );

    this.subscription.add(
      this._sharedService.navChanged$.subscribe((data) => {
        if (data) {
          this.selectedCompany = data.companyNum;
          this.fiscalYearId = data.fiscalYear;
          this.costCenterId = data.costCenter;
          this.newEntry = false;
          this.isEditing = false;
          this.component === 'journal'
            ? this.checkBeginningBalance()
            : this.getAllData();
        }
      })
    );

    this.subscription.add(
      this.sharedService.fiscalYears$.subscribe((res) => {
        this.fiscalYears = res.data;
      })
    );
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  checkBeginningBalance(): void {
    this.journalEntry = {};
    this.setDefaultValues(true);
    setTimeout(() => {
      this.initializeAgGrid();
    });
    this.checkBeginningBalanceService.checkBeginningBalance().subscribe(
      (res: any) => {
        this.getAllData();
        this.hasBalance = true;
      },
      (err) => {
        this.hasBalance = false;
      }
    );
  }

  getJournalEntries(target?: string): void {
    this.subscription.add(
      this.journalEntriesService
        .getJournalEntries(
          this.arrow,
          this.component === 'journal' ? '' : '1',
          this.journalId,
          target
        )
        .subscribe(
          (res) => {
            this.lastPage = res?.paginate?.last_page || 1;
            this.journalEntry = res?.data?.item || {};
            this.buttons = res?.data?.buttons || {};
            this.assignDataToVariables();
            setTimeout(() => {
              this.initializeAgGrid();
            }, 100);
            this.errorMassage = true;
          },
          (error) => {
            this.messageBoxError = error?.error;
            this.errorMassage = false;
            this.setDefaultValues(true);
          }
        )
    );
  }

  openAttachmentsDialog(): void {
    this.dialog.open(AttachmentsDialogComponent, {
      data: {
        attachmentsPaths: this.agSelectedRow?.attachment_paths || null,
        attachments: this.agSelectedRow?.attachments,
        edit: this.isEditing,
      },
      minWidth: '600px',
      disableClose: true,
    });
  }

  getGuideTree(): void {
    this.subscription.add(
      this.listsService
        .getAccountGuideTree(this.selectedCompany)
        .subscribe((res) => {
          this.guideTree = res;
          this.guideTree.splice(0, 1); // remove حسب الاختيار
          this.drawAgGrid();
        })
    );
  }

  getJournalModules(): void {
    this.subscription.add(
      this.listsService.getJournalModules().subscribe((res) => {
        this.journalModules = res?.items;
      })
    );
  }

  getCurrencies(): void {
    this.subscription.add(
      this.listsService
        .getCurrencies(this.selectedCompany, this.fiscalYearId)
        .subscribe((res) => {
          this.currencies = res.items;
          this.currency = res.items?.filter((i) => i?.is_default === 1)[0]?.id;
          this.currencyChanged({
            rate: res.items?.filter((i) => i?.is_default === 1)[0]?.rate,
          });
        })
    );
  }

  getCostCenters(): void {
    this.subscription.add(
      this.listsService
        .costCenters(this.selectedCompany, 1)
        .subscribe((res) => {
          this.costCenters = res?.items;
        })
    );
  }

  getAllData(): void {
    this.getJournalEntries();
    this.getJournalModules();
    this.getCostCenters();
    this.getCurrencies();
    this.getGuideTree();
  }

  new(): void {
    this.isEditing = true;
    this.errorMassage = true;
    this.newEntry = true;
    this.journalEntry = {};
    this.initializeAgGrid();
    this.setDefaultValues();
  }

  goToEntry(event): void {
    if (event.target.value !== this.journalEntry?.setting_show) {
      this.arrow = 'equal';
      this.getJournalEntries(event.target.value);
    }
  }

  assignDataToVariables(): void {
    this.date = moment(this.journalEntry?.date, 'DD/MM/YYYY').toDate() || null;
    this.journalModuleId = this.journalEntry.journal_module_id;
    this.statement = this.journalEntry?.statement;
    this.costCenterId = this.journalEntry?.cost_center_id;
    this.currency = this.journalEntry?.currency_id;
    this.symbol = this.currencies?.filter(
      (c) => c.id === this.currency
    )[0]?.name_symbol;
    this.transferPrice = this.journalEntry?.conversion_factor;

    if (this.component === 'opening') {
      this.original = String(this.journalEntry?.id);
    } else {
      this.original = this.journalEntry?.module?.title;
    }
    this.fiscalYearNumber = this.journalEntry.setting_show;
  }

  prePost(): void {
    let data: any[];
    data = JSON.parse(JSON.stringify(this.rowData));
    this.formData = new FormData();
    // add global values
    data
      .filter((d) => d?.credit || d?.debit)
      .forEach((row) => {
        if (!row?.cost_center_id) {
          row.cost_center_id = Number(this.costCenterId);
        }
        if (!row?.currency_id) {
          row.currency_id = Number(this.currency);
        }
        if (!row?.statement) {
          row.statement = this.statement;
        }

        if (!row?.credit) {
          row.credit = '0';
        }
        if (!row?.debit) {
          row.debit = '0';
        }
      });

    // append data from table
    for (let i = 0; i < data?.filter((d) => d?.credit || d?.debit)?.length; i++) {
      for (const key in data[i]) {
        if (data[i]?.hasOwnProperty(key) && data[i][key]) {
          if (key !== null && key === 'uploadedFiles') {
            for (const item of this.rowData[i][key]) {
              if (typeof item === 'object') {
                this.formData.append(
                  `journal_entry[${i}][attachments][]`,
                  item,
                  item?.name
                );
              }
            }
          } else if (key === 'attachments') {
            for (const item of this.rowData[i][key]) {
              if (typeof item === 'string') {
                this.formData.append(
                  `journal_entry[${i}][pattachments][]`,
                  item
                );
              }
            }
          } else if (
            !Array.isArray(key) &&
            key !== 'attachments' &&
            key !== 'uploadedFiles'
          ) {
            this.formData.append(
              `journal_entry[${i}][${key}]`,
              data[i][key]
            );
          }
        }
      }
    }

    if (!this.newEntry) {
      this.formData.append('id', this.journalEntry?.id?.toString());
    }
    // append data outside the table
    this.formData.append('journal_module_id', this.journalModuleId);
    this.formData.append('statement', this.statement);
    this.formData.append('date', this.date?.toLocaleDateString('en-GB'));
    this.formData.append('cost_center_id', this.costCenterId);
    this.formData.append('currency_id', this.currency);

    const object = {};
    this.formData.forEach((value, key) => {
      object[key] = value;
    });
  }

  attachmentsCount(): number {
    return this.agSelectedRow?.attachments?.length;
  }

  postData(): void {
    this.prePost();
    this.subscription.add(
      this.journalEntriesService.addEntry(this.formData).subscribe(
        (res) => {
          this.isEditing = false;
          this.newEntry = false;
          this.agSelectedRow = null;
          this.page = 1;
          this.arrow = 'equal';
          this.getJournalEntries(res?.items?.setting_show.toString());
          this.toastr.success('تم الحفظ بنجاح');
        },
        (err) => {
          this.errorToaster(err);
        }
      )
    );
  }

  errorToaster(err): void {
    for (const error in err.error) {
      if (Array.isArray(err?.error[error])) {
        if (typeof err?.error[error][0] === 'object') {
          for (const item in err?.error[error]) {
            for (const subItem in err?.error[error][item]) {
              this.toastr.error(
                err?.error[error][item][subItem]?.map((x) => x)
              );
            }
          }
        } else {
          this.toastr.error(err.error[error]?.map((x) => x));
        }
      }
    }
  }

  setDefaultValues(noResults?: boolean): void {
    this.statement = '';
    if (!noResults) {
      setTimeout(() => {
        this.currency = this.currencies?.filter(
          (i) => i?.is_default === 1
        )[0]?.id;
        this.currencyChanged({
          rate: this.currencies?.filter((i) => i?.is_default === 1)[0]?.rate,
        });
      }, 100);
    } else {
      setTimeout(() => {
        this.currency = null;
        this.currencyChanged({
          rate: this.currencies?.filter((i) => i?.is_default === 1)[0]?.rate,
        });
      }, 100);
    }
    setTimeout(() => {
      this.sharedService.selectedConstCenterId$.subscribe((res) => {
        this.costCenterId = res;
      });
    }, 100);
    setTimeout(() => {
      if (this.component === 'journal') {
        this.journalModuleId = this.journalModules.filter((j) =>
          j.name.includes('سند يدوى')
        )[0]?.id;
      } else if (this.component === 'opening') {
        this.journalModuleId = this.journalModules.filter((j) =>
          j.name.includes('قيد ارصدة افتتاحيه')
        )[0]?.id;
      }
    }, 100);
    this.agSelectedRow = null;
    this.original = null;
    this.fiscalYearNumber = null;

    const dayOne = this.fiscalYears.filter(
      (year) => year.id === this.fiscalYearId
    )[0]?.start_at;
    if (this.component === 'opening') {
      const currentYear = new Date().getFullYear();
      // this.date = new Date(`01/01/${currentYear}`);
      this.date = new Date(dayOne);
      this.dateChanged(this.date);
    } else {
      this.date = new Date();
      this.dateChanged(this.date);
    }

    // this.journalEntry = {};
  }

  getFiscalYearByDate(): void {
    if (this.date && this.newEntry) {
      this.subscription.add(
        this.journalEntriesService
          .getNumber(this.date?.toLocaleDateString('en-GB'))
          .subscribe(
            (res) => {
              if (res.code === 400) {
                this.date = null;
                return;
              }
              this.fiscalYearNumber = res?.item?.setting_show;
            },
            (err) => {
              this.date = null;
            }
          )
      );
    }
  }

  canEdit(): boolean {
    const target = this.journalModules?.filter(
      (j) => j?.name === 'سند يدوى'
    )[0];
    return this.journalModuleId === target?.id;
  }

  dateChanged(evt) {
    this.date = evt;
    this.getFiscalYearByDate();
  }

  currencyChanged(evt) {
    // this.transferPrice = this.currencies?.filter(c => c?.id === evt.id)[0]?.rate;
    this.transferPrice = evt?.rate;
    this.symbol = this.currencies?.filter(
      (c) => c.id === this.currency
    )[0]?.name_symbol;
  }

  onImageUpload(event): void {
    if (event?.target?.files && event?.target?.files?.length) {
      this.agSelectedRow.uploadedFiles = event?.target?.files;
    }
  }

  // get total debit or credit
  getTotalDebitOrCredit(type: 'credit' | 'debit') {
    let sum = 0;
    this.rowData
      ?.filter((t) => t[type])
      .forEach((d) => {
        if (d?.currency_id) {
          sum += Number(d[type]) * Number(d?.conversion_factor);
        } else {
          sum +=
            Number(d[type]) *
            this.currencies.filter((c) => c.id === this.currency)[0]?.rate;
        }
      });
    return sum || 0;
  }

  getDebitCreditDifference(
    type: 'credit' | 'debit', otherType: 'credit' | 'debit'): number {
    if (
      this.getTotalDebitOrCredit(type) <= this.getTotalDebitOrCredit(otherType)
    ) {
      return Math.abs(this.getTotalDebitOrCredit(type) - this.getTotalDebitOrCredit(otherType));
    } else {
      return 0;
    }
  }

  //    pagination
  next(): void {
    if (this.isLastPage()) {
      this.newEntry = false;
      this.journalId = String(this.journalEntry?.id);
      this.arrow = 'next';
      this.getJournalEntries();
      this.isEditing = false;
    }
  }

  previous(): void {
    if (this.buttons?.previous) {
      this.arrow = 'previous';
      this.journalId = String(this.journalEntry?.id);
      this.newEntry = false;
      this.getJournalEntries();
      this.isEditing = false;
    }
  }

  last(): void {
    if (this.isLastPage()) {
      this.arrow = 'last';
      this.journalId = String(this.journalEntry?.id);
      this.getJournalEntries();
      this.newEntry = false;
      this.isEditing = false;
    }
  }

  first(): void {
    this.arrow = 'first';
    this.getJournalEntries();
    this.journalId = String(this.journalEntry?.id);
    this.newEntry = false;
    this.isEditing = false;
  }

  isLastPage(): boolean {
    return this.buttons?.last;
  }

  //  AG Grid Methods
  initializeAgGrid(): void {
    this.drawAgGrid();
    this.rowData = this.journalEntry?.journal_entry_details || [];
    if (!this.rowData?.length) {
      // if there are not items in the table then add 5 rows
      for (let i = 1; i <= 5; i++) {
        this.onAddRow();
      }
    } else {
      // if the items in the table is less than 5 then add rows until it becomes a table of 5 rows
      for (let i = 5; i >= this.journalEntry?.journal_entry_details?.length; i--) {
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
        rowDrag: true,
        minWidth: 80,
      },
      {
        headerName: this.translate.instant('general.account'),
        field: 'account_guide_id',
        cellRenderer: 'agAutocomplete',
        cellRendererParams: {
          setData: this.setAccGuideId.bind(this),
          selectedKey: 'account_guide_id',
          values: this.guideTree,
          disabled: !this.isEditing,
          bindValue: 'id',
          bindLabel: 'viewLabel',
        },
        sortable: true,
        minWidth: 300,
      },
      {
        headerName: this.translate.instant('general.statement'),
        field: 'statement',
        editable: this.isEditing,
        minWidth: 180,
      },
      {
        headerName: this.translate.instant('general.debit'),
        // valueParser: 'parseInt(newValue)',
        // valueFormatter: `Math.floor(value).toString().replace(/(\\d)(?=(\\d{3})+(?!\\d))/g, "$1,")`,
        field: 'debit',
        valueParser: (params) => {
          return convertArabicDigitsToEnglish(params.newValue);
        },
        editable: (params) => this.isEditing && !params.data.credit,
        minWidth: 100,
      },
      {
        headerName: this.translate.instant('general.credit'),
        field: 'credit',
        valueParser: (params) => {
          return convertArabicDigitsToEnglish(params.newValue);
        },
        // valueFormatter: `Math.floor(value).toString().replace(/(\\d)(?=(\\d{3})+(?!\\d))/g, "$1,")`,
        // valueParser: 'parseInt(newValue)',
        editable: (params) => this.isEditing && !params.data.debit,
        minWidth: 100,
      },
      {
        headerName: this.translate.instant('general.currency'),
        field: 'currency_id',
        cellRenderer: 'agAutocomplete',
        cellRendererParams: {
          setData: this.setCurrencyId.bind(this),
          selectedKey: 'currency_id',
          bindValue: 'id',
          disabled: !this.isEditing,
          bindLabel: 'name',
          values: this.currencies,
        },
        sortable: true,
        minWidth: 200,
      },
      {
        headerName: this.translate.instant('general.Cost_Center'),
        field: 'cost_center_id',
        cellRenderer: 'agAutocomplete',
        cellRendererParams: {
          setData: this.setCostCenterId.bind(this),
          selectedKey: 'cost_center_id',
          disabled: !this.isEditing,
          bindValue: 'id',
          bindLabel: 'name',
          values: this.costCenters,
        },
        sortable: true,
        minWidth: 180,
      },
      {
        headerName: this.translate.instant('general.tag'),
        field: 'tag',
        editable: this.isEditing,
        minWidth: 180,
      },
      {
        headerName: this.translate.instant('general.area'),
        field: 'cost_center_branch.name',
        editable: false,
        minWidth: 150,
      },
      {
        headerName: this.translate.instant('general.branch'),
        field: 'cost_center_region.name',
        editable: false,
        minWidth: 150,
      },
      {
        headerName: this.translate.instant('setting.usersPage.actions'),
        cellRenderer: 'agActionBtn',
        cellRendererParams: {
          actions: [
            {
              action: 'delete',
              style: {
                color: '#F64E60',
                backgroundColor: 'rgba(#F64E60, 0.2)',
              },
            },
          ],
          disabled: !this.isEditing,
          getAction: this.getAction.bind(this),
        },
        minWidth: 130,
      },
    ];
  }

  refreshTable(): void {
    this.agGrid.gridApi.redrawRows();
  }

  onAddRow(): void {
    this.rowData.push({
      credit: null,
      debit: null,
      attachments: [],
    });
    this.rowData = this.rowData.slice();
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

  setCurrencyId(e) {
    if (e) {
      e.data.currency_id = e.event;
    }
  }

  setCostCenterId(e) {
    if (e) {
      e.data.cost_center_id = e.event;
    }
  }

  getAction(e) {
    if (e.action === 'delete') {
      this.onDeleteRow(e.data);
    }
  }

  // cancelEditOrAdd
  cancelEditOrAdd() {
    if (this.isEditing && !this.newEntry) {
      this.isEditing = !this.isEditing;
      this.drawAgGrid();
    } else {
      this.isEditing = !this.isEditing;
      this.newEntry = false;
      this.getJournalEntries();
    }
  }
}
