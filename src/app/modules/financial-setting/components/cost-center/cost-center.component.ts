import {MatDialog} from '@angular/material/dialog';
import {Component, OnDestroy, OnInit, TemplateRef, ViewChild} from '@angular/core';

import {Subscription} from 'rxjs';

import {CostCenter} from '../../models/costCentesr/costCenter';
import {SharedService} from 'src/app/shared/services/shared.service';
import {TopNavService} from '../../../../shared/services/top-nav.service';
import {CostCenterService} from '../../services/cost-centers/cost-center.service';
import {AddEditCostCenterComponent} from './add-edit-cost-center/add-edit-cost-center.component';
import {ConfirmDialogComponent} from 'src/app/shared/components/confirm-dialog/confirm-dialog.component';
import { cellActionStyle, DeleteActionStyle } from 'src/app/shared/model/global';
import { TranslateService } from '@ngx-translate/core';
import { AgActionBtnComponent } from 'src/app/shared/components/ag-grid/cell-renderers/ag-action-btn/ag-action-btn.component';
import { AgStatusBtnComponent } from 'src/app/shared/components/ag-grid/cell-renderers/ag-status-btn/ag-status-btn.component';
import { TranslationService } from 'src/app/modules/i18n/translation.service';

@Component({
  selector: 'app-cost-center',
  templateUrl: './cost-center.component.html',
  styleUrls: ['./cost-center.component.scss']
})
export class CostCenterComponent implements OnInit, OnDestroy {

  subscription: Subscription = new Subscription();
  @ViewChild('addCostCenter', {static: true}) addCostCenter: TemplateRef<any>;

  tableItems: CostCenter[] = [];
  tableColumns = [];
  columnDefs = [];

  searchWord = '';
  message: string;
  messageBoxError = {};

  update = false;
  addLoading = false;
  showLoading = false;
  existData: boolean = true;
  errorMassage: boolean = true;


  fetchCriteria = {
    page: 1,
  };
  pageOptions = {
    paginationSizes: [],
    defaultPageSize: 15,
    length: 10
  };
  frameworkComponents: any;
  defaultColDef = {
    filter: false,
    editable: false,
    resizable: true,
  };


  constructor(
    private _MatDialog: MatDialog,
    private _shredService: SharedService,
    private topNavService: TopNavService,
    private _costCenter: CostCenterService,
    private translate : TranslateService,
    public translation: TranslationService,
    )
    {
      this.frameworkComponents = {
        agActionBtn: AgActionBtnComponent,
        agStatusBtn: AgStatusBtnComponent,
      }
  }


  ngOnInit(): void {
    // init table columns
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
          headerName: this.translate.instant('general.Cost_Center_Name'),
          field:'name_ar',
          minWidth: 200,
        },
        {
          headerName: this.translate.instant('general.Area_Name'),
          field: 'areaName',
          minWidth: 200
        },
        {
          headerName: this.translate.instant('general.Branch_Name'),
          field: 'branchName',
          minWidth: 200
        },
        {
          headerName: this.translate.instant('setting.currencies.Default'),
          field: 'add',
          minWidth: 100
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
      this._shredService.navChanged$.subscribe(val => {
        if (val) {
          this.getCostCenters();
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
    this.getCostCenters();
  }

  /**
   * Get cost center data.
   */
  getCostCenters() {
    this.showLoading = true;
    this.subscription.add(
      this._costCenter.getCostCenters(this.fetchCriteria.page, this.searchWord)
        .subscribe(res => {
          this.tableItems = res?.data;
          this.initializeAgGrid()
          this.pageOptions.length = res?.total;
          this.existData = true;
          this.errorMassage = true;
        }, error => {
          this.messageBoxError = error.error;
          this.tableItems = [];
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
      const FormData = {
        ...data.data,
        status: data.data.status === 1,
      };
      this.update = true;
      this.openAddEditCostCenterForm(FormData);
    } else {
      this.onChangeStatus(data.data);
    }
  }

  openAddEditCostCenterForm(row?) {
    const dialogRef = this._MatDialog.open(AddEditCostCenterComponent, {
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
          this.getCostCenters();
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
          const body = {status: row.status === 1 ? 2 : 1};
          this._costCenter.changeStatus(row.id, body).subscribe(res => {
            this.getCostCenters();
            this.topNavService.getTopNavData();
          });
        }
      })
    );
  }

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
    this.getCostCenters();
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

}

export const TABLE_COLUMNS = [
  {
    name: 'general.Cost_Center_Name',
    dataKey: 'auto_name',
    isSortable: false,
  },
  {
    name: 'general.Area_Name',
    dataKey: 'areaName',
    isSortable: false,
  },
  {
    name: 'general.Branch_Name',
    dataKey: 'branchName',
    isSortable: false,
  },
  {
    name: 'cost_center.add',
    dataKey: 'add',
    isSortable: false
  },
  {
    name: 'general.status',
    dataKey: 'statusView',
    isSortable: false,
  },
];
