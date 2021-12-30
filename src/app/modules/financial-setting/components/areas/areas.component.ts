import { MatDialog } from '@angular/material/dialog';
import { Component, OnDestroy, OnInit } from '@angular/core';

import { Subscription } from 'rxjs';

import { environment } from 'src/environments/environment';
import { AreasService } from '../../services/areas/areas.service';
import { SharedService } from 'src/app/shared/services/shared.service';
import { AddEditAreaComponent } from "./add-edit-area/add-edit-area.component";
import { ConfirmDialogComponent } from 'src/app/shared/components/confirm-dialog/confirm-dialog.component';
import { TranslateService } from '@ngx-translate/core';
import { AgStatusBtnComponent } from 'src/app/shared/components/ag-grid/cell-renderers/ag-status-btn/ag-status-btn.component';
import { AgActionBtnComponent } from 'src/app/shared/components/ag-grid/cell-renderers/ag-action-btn/ag-action-btn.component';
import { cellActionStyle, DeleteActionStyle } from 'src/app/shared/model/global';
import { TranslationService } from 'src/app/modules/i18n/translation.service';

@Component({
  selector: 'app-areas',
  templateUrl: './areas.component.html',
  styleUrls: ['./areas.component.scss']
})
export class AreasComponent implements OnInit, OnDestroy {
  subscription: Subscription = new Subscription();

  tableItems = [];
  tableColumns = [];
  messageBoxError = {};
  columnDefs = [];
  defaultColDef = {
    filter: false,
    editable: false,
    resizable: true,
  };
  frameworkComponents: any;



  message = '';
  selectedArea;
  searchWord = '';

  update = false;
  showLoading = false;
  existData: boolean = true;
  errorMassage: boolean = true;


  fetchCriteria = {
    page: 1,
  };

  pageOptions = {
    length: 10,
    paginationSizes: [],
    defaultPageSize: 15,
  };

  // end booleans ___________________


  constructor(
    private _areas: AreasService,
    private _MatDialog: MatDialog,
    private _shredService: SharedService,
    private translate : TranslateService,
    public translation: TranslationService,

    ) 
  {
    this.frameworkComponents = {
      agActionBtn: AgActionBtnComponent,
      agStatusBtn: AgStatusBtnComponent,
    };
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
          headerName: this.translate.instant('general.Area_Name'),
          field: (this.translation.getSelectedLanguage()== 'ar') ? 'name_ar' : 'name_en',
          minWidth: 200,
        },
        {
          headerName: this.translate.instant('general.costcenterbranchescount'),
          field: 'cost_center_branches_count',
          minWidth: 250
        },
        {
          headerName: this.translate.instant('general.costcenterscount'),
          field: 'cost_centers_count',
          minWidth: 250
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
              },
            ],
            getAction: this.rowActions.bind(this),
          },
          minWidth: 200
        }
      ];
    }
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  getData() {
    this.subscription.add(
      this._shredService.navChanged$.subscribe(val => {
        if (val) {
          this.getAreas();
        }
      }));
  }

  // initialize Columns in vacations requests table
  initializeColumns(): void {
    this.tableColumns = TABLE_COLUMNS;
  }

  /**
   * Get all areas
   */
  getAreas() {
    this.subscription.add(
      this._areas.getAllAreas(this.searchWord, this.fetchCriteria.page).subscribe(res => {
        this.tableItems = res.data
        this.tableItems.forEach(e => {
          if (e.cost_center_branches_count > 0 || e.cost_centers_count > 0) {
            e.deleteRemoveIcon = true;
          }
        });
        this.pageOptions.length = res.total;
        this.existData = true;
        this.initializeAgGrid()
      },
        error => {
          this.messageBoxError = error.error,
          this.tableItems = [];
          if (error.error.code === 4000) {
            this.errorMassage = false;
          }
          else {
            this.errorMassage = true;
            this.existData = false;
          }
        })
    )
  }


  /**
   * When user search get data with keyword
   */
  onSearchChange(word) {
    this.tableItems = [];
    this.searchWord = word;
    this.getAreas();
  }

  /**
   * Start all table action _______________________________________________
   */
  openAddEditArea(row?) {
    const dialogRef = this._MatDialog.open(AddEditAreaComponent, {
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
          this.getAreas();
        }
      })
    )

  }


  /**
   * row tabel actions
   * @param data
   */
  rowActions(data) {
    if (data.action == 'edit') {
      this.update = true;
      const FormData = {
        ...data.data,
        status: data.data.status == 1 ? true : false,
      };
      this.openAddEditArea(FormData);
    } else if (data.action == 'delete') {
      this.onDelete(data.data);
    } else {
      this.onChangeStatus(data.data);
    }
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
          this._areas.changeStatus(row.id, row.status == 1 ? 2 : 1).subscribe(res => {
            this.getAreas();
          });
        }
      })
    )
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
        url: `users/cost-center-regions/${row.id}/delete`,
        domainUrl: `${environment.accountant_apiUrl}`
      }
    });
    this.subscription.add(

      dialogRef.afterClosed().subscribe(result => {
        if (result) {
          this.getAreas();
        }
      })
    )
  }

  /**
   * End all table action _______________________________________________
   */

  /**
   * pagination events _____________________
   * @param event
   */
  pageEvent(event) {
    if (typeof event == 'object') {
      this.fetchCriteria.page = event.pageIndex + 1;
    } else {
      this.fetchCriteria.page = event;
    }
    this.getAreas();
  }


  /**
   * Map area data to show in table
   * @param items
   * @returns
   */
 

}

export const TABLE_COLUMNS = [
  {
    name: 'general.Area_Name',
    dataKey: 'auto_name',
    isSortable: false,
  },
  {
    name: 'general.costcenterbranchescount',
    dataKey: 'cost_center_branches_count',
    isSortable: false,
  },
  {
    name: 'general.costcenterscount',
    dataKey: 'cost_centers_count',
    isSortable: false,
  },
  {
    name: 'general.status',
    dataKey: 'statusView',
    isSortable: false,
  },
];