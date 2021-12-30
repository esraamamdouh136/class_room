import {Router} from '@angular/router';
import {Component, OnDestroy, OnInit, ViewChild} from '@angular/core';

import {Subscription} from 'rxjs';
import {ToastrService} from 'ngx-toastr';
import {MatDialog} from '@angular/material/dialog';

import {ParentsListService} from './service/parents-list.service';
import {SharedService} from 'src/app/shared/services/shared.service';
import {ParentsComponent} from '../../modules/parents/parents.component';
import {cellActionStyle, TableActions} from 'src/app/shared/model/global';
import {AgGridComponent} from 'src/app/shared/components/ag-grid/ag-grid.component';
import {ConfirmDialogComponent} from 'src/app/shared/components/confirm-dialog/confirm-dialog.component';
import {AgActionBtnComponent} from 'src/app/shared/components/ag-grid/cell-renderers/ag-action-btn/ag-action-btn.component';
import {AgStatusBtnComponent} from 'src/app/shared/components/ag-grid/cell-renderers/ag-status-btn/ag-status-btn.component';
import { TranslationService } from "src/app/modules/i18n/translation.service";


@Component({
  selector: 'app-parents-list-ag-grid',
  templateUrl: './parents-list-ag-grid.component.html',
  styleUrls: ['./parents-list-ag-grid.component.scss']
})
export class ParentsListAgGridComponent implements OnInit, OnDestroy {

  @ViewChild(ParentsComponent) parents: ParentsComponent;

  // ===============[AG-RID]=====================
  @ViewChild('agGrid') agGrid: AgGridComponent;

  columnDefs = [];
  rowData: any[] = [];
  messageBoxError: {};
  system_id: number;

  defaultColDef = {
    filter: false,
    editable: false,
    resizable: true,
  };
  agSelectedRow;
  frameworkComponents: any;
  columnDefHeader: object = {};
  // ===============[AG-RID]=====================
  message: string;
  tableItems: any;
  searchInput = '';
  currentPage: number;
  subscription: Subscription = new Subscription();
  // pagination Object
  fetchCriteria = {
    page: 1,
  };
  pageOptions = {
    paginationSizes: [],
    defaultPageSize: 15,
    length: 10
  };
  show: boolean = false;
  exist_data: boolean = true;
  firstRequest: boolean = true;
  errorMassage: boolean = true;


  constructor
  (
    private router: Router,
    private matDialog: MatDialog,
    private toaster: ToastrService,
    private services: ParentsListService,
    private _sharedService: SharedService,
    private translation: TranslationService,
    private parents_service: ParentsListService
  ) {
    this.frameworkComponents = {
      agActionBtn: AgActionBtnComponent,
      agStatusBtn: AgStatusBtnComponent,
    };
  }

  ngOnInit(): void {
    this.subscription.add(
      this._sharedService.navChanged$.subscribe((data: any) => {
        if (data) {
          this.system_id = data?.system_id;
          this.getParentsTable();
        }
      })
    );
  }

  // ===========[AG-GRID FUNCTION]==============
  /**
   * @description A function that initializes AG Grid
   */
  initializeAgGrid(data: any): void {
    this.rowData = data || [];
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
          field: 'id',
          // valueGetter: 'node.rowIndex + 1',
          filter: false,
          minWidth: 80
        },
        {
          headerName: 'general.account_name',
          valueGetter: (params) => this.getFatherFullName(params.data),
          // field: 'fatherName',
          minWidth: 150
        },
        {
          headerName: 'general.mother_name',
          field: 'matherName',
          minWidth: 150
        },
        {
          headerName: 'general.relative_name',
          field: 'relativeName',
          minWidth: 150
        },
        {
          headerName: 'general.childern',
          field: 'childernLength',
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
                action: 'visibility',
                style: cellActionStyle
              },
              {
                action: 'lock',
                style: cellActionStyle
              },
            ],
            getAction: this.rowActions.bind(this),
          },
          minWidth: 200
        }
      ];
    }
  }

  getFatherFullName(data){
    let name = '';
    if(this.translation.getSelectedLanguage() === 'ar'){
        name = `${data?.father?.name_ar} ${data?.father?.father_name_ar ? 
        data?.father?.father_name_ar : ''} 
        ${data?.father?.grandfather_name_ar ? data?.father?.grandfather_name_ar : ''} 
        ${data?.father?.family_name_ar ? data?.father?.family_name_ar : ''}` 
    } else {
        name = `${data?.father?.name_en} ${data?.father?.father_name_en ? 
        data?.father?.father_name_en : ''} 
        ${data?.father?.grandfather_name_en ? data?.father?.grandfather_name_en : ''} 
        ${data?.father?.family_name_en ? data?.father?.family_name_en : ''}` 
    }
    return  name
  }

  // ===========[AG-GRID FUNCTION]==============

  /**
   * @description A function that gets parents data
   */
  getParentsTable() {
    this.subscription.add(this.services.getParentsTable(this.fetchCriteria.page, this.searchInput, this.firstRequest)
      .subscribe(res => {
          if (res.code === 200) {
            this.firstRequest = false;
            // AG-GRID
            this.rowData = res.data;
            this.show = true;
            this.initializeAgGrid(this.rowData);
            this.pageOptions.length = res.total;
            this.exist_data = true;
            this.errorMassage = true;
          }
        },
        error => {
          this.messageBoxError = error.error;
          if (error.error.code === 4000) {
            this.errorMassage = false;
          } else {
            this.errorMassage = true;
            this.exist_data = false;
          }
        }
      ));
  }

  editRow(row: any) {
    this.router.navigate(['financial-operations/parents-list'], {queryParams: {id: row.id, edit: true}});
  }

  changeStatus(data) {
    const dialogRef = this.matDialog.open(ConfirmDialogComponent, {
      minWidth: '500px',
      data: {
        message: 'common.changeStatusMessage',
        updateStatus: true,
      }
    });
    this.subscription.add(
      dialogRef.afterClosed().subscribe(result => {
        if (result) {
          this.services.changeStatus(data.id, {status: data.status === 1 ? 2 : 1})
            .subscribe((res: any) => {
                this.toaster.success(res.message);
                this.getParentsTable();
              }
            );
        }
      }));
  }

  add(row?) {
    this.router.navigate(['financial-operations/parents-list'], {queryParams: {id: row.id, edit: false}});
  }

  rowActions(evt: any): void {
    if (evt.action === TableActions.show) {
      this.add(evt.data);
    } else if (evt.action === TableActions.changeStatus) {
      this.changeStatus(evt.data);
    } else {
      this.editRow(evt.data);
    }
  }

  onSearchChange(e) {
    this.fetchCriteria.page = 1;
    this.getParentsTable();
  }

  // pagination function
  pageEvent(event) {

    if (typeof event == 'object') {
      this.fetchCriteria.page = event.pageIndex + 1;
    } else {
      this.fetchCriteria.page = event;
    }
    this.getParentsTable();
  }

  getImportButton() {
    this.subscription.add(this.parents_service.getImportFromParents().subscribe((res: any) => {
      this.toaster.success(res.message);
    }));
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

}
