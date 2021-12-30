import {MatDialog} from '@angular/material/dialog';
import {FormBuilder, FormGroup} from '@angular/forms';
import {Component, OnDestroy, OnInit, TemplateRef, ViewChild} from '@angular/core';

import {Subscription} from 'rxjs';
import {FileUploadControl, FileUploadValidators} from '@iplab/ngx-file-upload';

import {environment} from 'src/environments/environment';
import {FiscalYear} from '../../models/fiscalYears/fiscalYear';
import {SharedService} from 'src/app/shared/services/shared.service';
import {FicalYearService} from '../../services/fiscal-years/fical-year.service';
import {FiscalYearFormComponent} from './add-edit-fiscal-year/add-edit-fiscal-year.component';
import {ConfirmDialogComponent} from 'src/app/shared/components/confirm-dialog/confirm-dialog.component';
import {cellActionStyle, DeleteActionStyle, TableActions} from 'src/app/shared/model/global';
import {AgStatusBtnComponent} from 'src/app/shared/components/ag-grid/cell-renderers/ag-status-btn/ag-status-btn.component';
import {AgActionBtnComponent} from 'src/app/shared/components/ag-grid/cell-renderers/ag-action-btn/ag-action-btn.component';
import {AgIsDefaultBtnComponent} from 'src/app/shared/components/ag-grid/cell-renderers/ag-is-default-btn/ag-is-default-btn.component';
import {TranslateService} from '@ngx-translate/core';

@Component({
  selector: 'app-fiscal-year',
  templateUrl: './fiscal-year.component.html',
  styleUrls: ['./fiscal-year.component.scss']
})
export class FiscalYearComponent implements OnInit, OnDestroy {
  columnDefs = [];
  rowData: any[] = [];


  tableColumns = [];
  motherCompanies = [];
  tableItems: FiscalYear[] = [];
  passwordValidationsMessages: any[];
  localFiscalYears: FiscalYear[] = [];
  defaultColDef = {
    filter: false,
    editable: false,
    resizable: true,
  };
  pageOptions = {
    length: null,
    paginationSizes: [],
    defaultPageSize: 15,
  };
  fetchCriteria = {
    page: 1,
  };


  form: FormGroup;
  subscription: Subscription = new Subscription();
  @ViewChild('addFiscalYear', {static: true}) addFiscalYear: TemplateRef<any>;
  public fileUploadControl = new FileUploadControl(null, FileUploadValidators.filesLimit(2));

  message: string;
  searchWord = '';
  motherCompanyId;
  messageBoxError = {};
  frameworkComponents: any;


  update = false;
  existData = true;
  errorMassage = true;
  enableEdit: boolean = false;

  constructor(
    private _MatDialog: MatDialog,
    private _shared: SharedService,
    private _FormBuilder: FormBuilder,
    private _fiscalYear: FicalYearService,
    private translate: TranslateService,
  ) {
    this.frameworkComponents = {
      agActionBtn: AgActionBtnComponent,
      agStatusBtn: AgStatusBtnComponent,
      agIsDefaultBtn: AgIsDefaultBtnComponent

    };
  }


  ngOnInit(): void {
    // init form
    this.initForm();
    this.getData();
  }

  initializeAgGrid(data: any): void {
    this.rowData = data || [];
    this.drawAgGrid(); // call drawAgGrid Function
  }

  drawAgGrid(): void {
    if (!this.columnDefs.length) {
      this.columnDefs = [
        {
          headerName: '#',
          valueGetter: 'node.rowIndex + 1',
          filter: false,
          minWidth: 50
        },
        {
          headerName: this.translate.instant('setting.fiscalYearPage.details'),
          field: 'accountDetails',
          minWidth: 200
        },
        {
          headerName: 'setting.fiscalYearPage.start_at',
          field: 'date',
          minWidth: 200
        },
        {
          headerName: 'setting.fiscalYearPage.end_at',
          field: 'endYear',
          minWidth: 200
        },
        {
          headerName: 'setting.fiscalYearPage.Default',
          cellRenderer: 'agIsDefaultBtn',
          cellRendererParams: {
            getAction: this.rowActions.bind(this),
          },
          minWidth: 150
        },
        {
          headerName: 'general.status',
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
          minWidth: 150,
        }
      ];
    }
  }


  // initialize Columns in vacations requests table
  // initializeColumns(): void {
  //   this.tableColumns = TABLE_COLONS;
  // }

  getData() {
    this.subscription.add(
      this._shared.navChanged$.subscribe(data => {
        if (data?.companyId) {
          this.motherCompanyId = data?.companyId;
          this.getFiscalYearData(this.searchWord);
        }
      })
    );
  }


  /**
   * Get fiscal year data
   * @param keyWord
   */

  getFiscalYearData(keyWord) {
    this.subscription.add(
      this._fiscalYear.getFiscalYear(this.motherCompanyId, keyWord, this.fetchCriteria?.page).subscribe(res => {
          if (res.code === 200) {
            console.log(res);
            this.tableItems = res.data;
            this.initializeAgGrid(this.tableItems);
            const topHeaderNavData = res.data.filter(e => e.status == 1);
            this._shared.fiscalYears.next({data: topHeaderNavData, type: 'second'});
            this.existData = true;
            this.errorMassage = true;
          }
        },
        error => {
          this.messageBoxError = error.error;
          this.tableItems = [];
          this.initializeAgGrid(this.tableItems);
          if (error.error.code === 4000) {
            this.errorMassage = false;
          } else {
            this.errorMassage = true;
            this.existData = false;
          }
        }
      ));

  }

  // initialize Form
  initForm() {
    this.form = this._FormBuilder.group({
      password: [''],
    });
  }

  openAddEditFiscalYearForm(row?: any) {
    const dialogRef = this._MatDialog.open(FiscalYearFormComponent, {
      width: '600px',
      data: {row, id: row?.id, mother_company_id: this.motherCompanyId},
      panelClass: 'custom-dialog-container',
    });

    this.subscription.add(
      dialogRef.afterClosed().subscribe(result => {
        if (result) {
          this.getFiscalYearData(this.searchWord);
        }
      })
    );
  }


  /**
   * row tabel actions
   * @param data
   */
  rowActions(data) {
    if (data.action == TableActions.edit) {
      this.openAddEditFiscalYearForm(data.data);
    } else if (data.action == TableActions.changeStatus) {
      this.onChangeStatus(data.data);
    } else if (data.action == TableActions.delete) {
      this.onDelete(data.data);
    } else {
      this.changeIsDefault(data.data);
    }
  }

  /**
   * When user start to search
   */
  onSearchChange(word) {
    this.searchWord = word;
    this.getFiscalYearData(this.searchWord);
  }

  /**
   * Change year status
   * @param row (Fiscal year data)
   */
  onChangeStatus(row) {
    if (row.isDefault == false) {
      const dialogRef = this._MatDialog.open(ConfirmDialogComponent, {
        width: '500px',
        data: {
          message: 'common.changeStatusMessage',
          updateStatus: true,
        }
      });
      this.subscription.add(
        dialogRef.afterClosed().subscribe(result => {
          if (result) {
            this._fiscalYear.changeStatus(row.id, row.status == 1 ? 2 : 1).subscribe(res => {
              this.getFiscalYearData(this.searchWord);
            });
          }
        })
      );
    }
  }

  changeIsDefault(row) {
    this.tableItems.map(el => {
      el.isDefault = el.isDefault ? false : el.isDefault;
    });
    this._fiscalYear.changeIsDefault(row.id).subscribe(res => {
      this.getFiscalYearData(this.searchWord);
    }, error => {
      this.getFiscalYearData(this.searchWord);
    });
  }

  /**
   * If user click to delete Area show confirm dialog
   * @param row (All row data (area data))
   */
  onDelete(row) {
    const dialogRef = this._MatDialog.open(ConfirmDialogComponent, {
      width: '500px',
      data: {
        message: 'common.deleteMessage',
        updateStatus: false,
        url: `users/fiscal-year/${row.id}/delete`,
        domainUrl: `${environment.accountant_apiUrl}`
      }
    });

    this.subscription.add(
      dialogRef.afterClosed().subscribe(result => {
        if (result) {
          this.getFiscalYearData(this.searchWord);
        }
      })
    );
  }

  onEdit(row) {
    this.openAddEditFiscalYearForm(row);
  }

  pageEvent(event) {
    if (typeof event == 'object') {
      this.fetchCriteria.page = event.pageIndex + 1;
    } else {
      this.fetchCriteria.page = event;
    }
    this.getFiscalYearData(this.searchWord);
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }
}

export const TABLE_COLONS = [
  {
    name: 'setting.fiscalYearPage.details',
    dataKey: 'accountDetails',
    isSortable: false,
  },
  {
    name: 'setting.fiscalYearPage.start_at',
    dataKey: 'date',
    isSortable: false,
  },
  {
    name: 'setting.fiscalYearPage.end_at',
    dataKey: 'endYear',
    isSortable: false,
  },
  {
    name: 'general.status',
    dataKey: 'statusView',
    isSortable: false,
  },
  {
    name: 'setting.fiscalYearPage.Default',
    dataKey: 'isDefault',
    isSortable: false,
  },
];
