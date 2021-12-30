import {Component, OnDestroy, OnInit} from '@angular/core';
import {MatDialog} from '@angular/material/dialog';

import {Subscription} from 'rxjs';

import {environment} from 'src/environments/environment';
import {SharedService} from 'src/app/shared/services/shared.service';
import {BranchesService} from '../../services/branches/branches.service';
import {AddEditBranchComponent} from './add-edit-branch/add-edit-branch.component';
import {ConfirmDialogComponent} from 'src/app/shared/components/confirm-dialog/confirm-dialog.component';
import { AgStatusBtnComponent } from 'src/app/shared/components/ag-grid/cell-renderers/ag-status-btn/ag-status-btn.component';
import { AgActionBtnComponent } from 'src/app/shared/components/ag-grid/cell-renderers/ag-action-btn/ag-action-btn.component';
import { TranslateService } from '@ngx-translate/core';
import { cellActionStyle, DeleteActionStyle } from 'src/app/shared/model/global';
import { TranslationService } from 'src/app/modules/i18n/translation.service';

@Component({
  selector: 'app-branches',
  templateUrl: './branches.component.html',
  styleUrls: ['./branches.component.scss']
})
export class BranchesComponent implements OnInit, OnDestroy {

  tableItems = [];
  tableColumns = [];
  columnDefs = [];
  defaultColDef = {
    filter: false,
    editable: false,
    resizable: true,
  };
  frameworkComponents: any;


  searchWord = '';
  message: string;

  update = false;
  errorMassage = true;
  existData: boolean = true;

  messageBoxError: {};
  subscription: Subscription = new Subscription();

  fetchCriteria = {
    page: 1,
  };

  pageOptions = {
    length: 10,
    paginationSizes: [],
    defaultPageSize: 15,
  };

  constructor(
    private _MatDialog: MatDialog,
    private _branches: BranchesService,
    private _shredService: SharedService,
    private translate : TranslateService,
    public translation: TranslationService,

  ) {
    this.frameworkComponents = {
      agActionBtn: AgActionBtnComponent,
      agStatusBtn: AgStatusBtnComponent,
    };
  }


  ngOnInit(): void {
    this.initializeColumns();
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
          headerName: this.translate.instant('general.Branch_Name'),
          field: (this.translation.getSelectedLanguage()== 'ar') ? 'name_ar' : 'name_en',
          minWidth: 150,
        },
        {
          headerName: this.translate.instant('general.area'),
          field: 'area',
          minWidth: 250
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
            ],
            getAction: this.rowActions.bind(this),
          },
          minWidth: 150
        }
      ];
    }
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  getData() {
    this.subscription.add(
      this._shredService.navChanged$.subscribe(data => {
        if (data) {
          this.getBranches();
        }
      })
    );
  }

  // initialize Columns in vacations requests table
  initializeColumns(): void {
    this.tableColumns = TABLE_COLUMNS;
  }

  /**
   * When user search get data with keyword
   */
  onSearchChange(word) {
    this.searchWord = word;
    this.tableItems = [];
    this.getBranches();
  }


  /**
   * Get all branches
   */
  getBranches() {
    this.subscription.add(
      this._branches.getAllBranches(this.searchWord, this.fetchCriteria.page).subscribe(res => {
        if (res.paginate && res.code == 200) {
          this.tableItems = this.itemsDataMapping(res?.paginate?.data);
          this.pageOptions.length = res.paginate.total;
          this.existData = true;
          this.initializeAgGrid();
          this.errorMassage = true;
        }
      }, error => {
        this.messageBoxError = error.error;
        if (error.error.code === 4000) {
          this.errorMassage = false;
        } else {
          this.errorMassage = true;
          this.existData = false;
        }
      })
    );
  }

  /**
   * Start all table action
   */

  /**
   * row tabel actions
   * @param data
   */
  rowActions(data) {

    if (data.action === 'edit') {
      this.update = true;
      const FormData = {
        ...data.data,
        status: data.data.status === 1,
      };
      this.openAddEditBranchForm(FormData);
    } else if (data.action === 'delete') {
      this.onDelete(data.data);
    } else {
      this.onChangeStatus(data.data);
    }
  }


  openAddEditBranchForm(row?) {
    const dialogRef = this._MatDialog.open(AddEditBranchComponent, {
      width: '650px',
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
          this.getBranches();
        }
      })
    );
  }

  /**
   * Change year status
   * @param row (Fiscal year data)
   */
  onChangeStatus(row) {
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
          this._branches.changeStatus(row.id, row.status == 1 ? 2 : 1).subscribe(res => {
            this.getBranches();
          });
        }
      })
    );
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
        url: `users/cost-center-branches/${row.id}/delete`,
        domainUrl: `${environment.accountant_apiUrl}`
      }
    });

    this.subscription.add(
      dialogRef.afterClosed().subscribe(result => {
        if (result) {
          this.getBranches();
        }
      })
    );
  }

  /**
   * End all table action
   */


  /**
   * pagination events
   * @param event
   */
  pageEvent(event) {
    if (typeof event === 'object') {
      this.fetchCriteria.page = event.pageIndex + 1;
    } else {
      this.fetchCriteria.page = event;

    }
    this.getBranches();
  }


  /**
   * Map area data to show in table
   * @param items
   * @returns
   */
  itemsDataMapping(items) {
    return items.map((item) => {
      return {
        ...item,
        statusView: item?.status === 1 ? 'مفعله' : 'غير مفعله',
        area: item?.cost_center_region?.name
      };
    });
  }
}


export const TABLE_COLUMNS = [
  {
    name: 'general.Branch_Name',
    dataKey: 'auto_name',
    isSortable: false,
  },
  {
    name: 'general.area',
    dataKey: 'area',
    isSortable: false
  },
  {
    name: 'general.status',
    dataKey: 'statusView',
    isSortable: false,
  },
];
