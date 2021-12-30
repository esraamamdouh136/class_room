import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material/core';
import { MomentDateAdapter } from '@angular/material-moment-adapter';


import { MY_FORMATS } from 'src/app/modules/datePicker';
import { AgGridComponent } from "src/app/shared/components/ag-grid/ag-grid.component";
import { cellActionStyle, DeleteActionStyle, MoreActionStyle, TableActions } from "src/app/shared/model/global";
import { AgActionBtnComponent } from "src/app/shared/components/ag-grid/cell-renderers/ag-action-btn/ag-action-btn.component";
import { AgStatusBtnComponent } from "src/app/shared/components/ag-grid/cell-renderers/ag-status-btn/ag-status-btn.component";
import { ContractsService } from "../../service/contracts/contracts.service";
import { AgTagesCellComponent } from "src/app/shared/components/ag-grid/cell-renderers/ag-tages-cell/ag-tages-cell.component";
import { MatDialog } from "@angular/material/dialog";
import { AddEditContractComponent } from "./add-edit-contract/add-edit-contract/add-edit-contract.component";
import { ConfirmDialogComponent } from "src/app/shared/components/confirm-dialog/confirm-dialog.component";
import { ToastrService } from "ngx-toastr";
import { ContractBillsComponent } from "./contract-bills/contract-bills.component";
import { SideBarDef } from "ag-grid-community";
import { TranslateService } from '@ngx-translate/core';
import { DownloadContractComponent } from './download-contract/download-contract.component';
import { SharedService } from 'src/app/shared/services/shared.service';
import { environment } from "src/environments/environment";
import { saveAs } from 'file-saver';

@Component({
  selector: 'app-contracts',
  templateUrl: './contracts.component.html',
  styleUrls: ['./contracts.component.scss'],
  providers: [
    // `MomentDateAdapter` and `MAT_MOMENT_DATE_FORMATS` can be automatically provided by importing
    // `MatMomentDateModule` in your applications root module. We provide it at the component level
    // here, due to limitations of our example generation script.
    { provide: DateAdapter, useClass: MomentDateAdapter, deps: [MAT_DATE_LOCALE] },
    { provide: MAT_DATE_FORMATS, useValue: MY_FORMATS },
  ],
})
export class ContractsComponent implements OnInit {
  exist_data: boolean = true;
  Subscription: Subscription = new Subscription()

  // ===============[AG-RID]=====================
  @ViewChild('agGrid') agGrid: AgGridComponent;
  
  columnDefs = [];
  rowData: any[] = [];

  sideBar: SideBarDef;
  rowGroupPanelShow;
  pivotPanelShow;

  defaultColDef = {
    // filter: false,
    // editable: false,
    // resizable: true,
    // sortable: true,
    // enableRowGroup : true,
    // enableValue: true,
    // enablePivot: true,
    flex: 1,
      minWidth: 100,
      sortable: true,
      enablePivot: true,
  };
  agSelectedRow;
  frameworkComponents: any;
  columnDefHeader: object = {};
  messageBoxError = {};
  tableItems = [];
  pageOptions = {
    length: 10,
    paginationSizes: [],
    defaultPageSize: 15
  };
  fetchCriteria = {
    page: 1,
  };

  gridApi;
  gridColumnApi;

  // ===============[AG-RID]=====================
  constructor
    (
      private _contract: ContractsService,
      private _MatDialog: MatDialog,
      private toaster: ToastrService,
      private translate: TranslateService,
      private _shredService: SharedService,
    ) {
    this.frameworkComponents = {
      agActionBtn: AgActionBtnComponent,
      agStatusBtn: AgStatusBtnComponent,
      agTagsCell: AgTagesCellComponent,
    };
    this.sideBar = {
      toolPanels: [
        {
          id: 'columns',
          labelDefault: 'Columns', // here you can change displayed name
          labelKey: 'columns',
          iconKey: 'columns',
          toolPanel: 'agColumnsToolPanel',
          toolPanelParams: {
            suppressRowGroups: true,
            suppressValues: true,
            suppressPivots: true,
            suppressPivotMode: true,
            suppressColumnFilter: true,
            suppressColumnSelectAll: true,
            suppressColumnExpandAll: true,
          },
        }
        
      ],
      position: "right"
    };
  }

  ngOnInit(): void {
    this.Subscription.add(
      this._shredService.navChanged$.subscribe(val => {
        if (val) {
          this.getContracts();
        }
      }
    ));
  }

  ngOnDestroy(): void {
    this.Subscription.unsubscribe();
  }


  getContracts() {
    this.Subscription.add(
      this._contract.getContractsTable('', this.fetchCriteria.page).subscribe(res => {
        this.exist_data = true;
        this.pageOptions.length = res.total;
        this.initializeAgGrid(res.data);
        setTimeout(() => {
          this.restoreState()
        }, 100);
      },error => {
        this.messageBoxError = error.error;
        this.exist_data = false;
      })
    )
  }

  // ===========[AG-GRID FUNCTION]==============
  /**
 * @description A function that initializes AG Grid
 */
  initializeAgGrid(data: any): void {
    this.tableItems = data || [];
    this.drawAgGrid(); // call drawAgGrid Function
  }

  getColumApi(e) {
    this.gridColumnApi = e;
  }


  /**
   * @description A function that draws AG Grid
   */
  drawAgGrid(): void {
    if (!this.columnDefs.length) {
      this.columnDefs = [
        {
          headerName: this.translate.instant('contracts.contractNumber'),
          field: 'contract_number',
          filter: false,
          minWidth: 150,
        },
        {
          headerName: this.translate.instant('contracts.addContractDate'),
          field: 'date_show',
          minWidth: 150,
        },
        {
          headerName: this.translate.instant('contracts.studentFullName'),
          field: 'student_name',
          minWidth: 150,
        },
        {
          headerName: this.translate.instant('contracts.semaster'),
          field: 'classroom_name',
          minWidth: 150,
        },
        {
          headerName: this.translate.instant('contracts.class'),
          field: 'class_name',
          minWidth: 150,
        },
        {
          headerName: this.translate.instant('contracts.contractStatus'),
          cellRenderer: 'agStatusBtn',
          cellRendererParams: {
            getAction: this.rowActions.bind(this),
          },
          minWidth: 150,
        },
        {
          headerName: this.translate.instant('contracts.contractName'),
          field: 'contract_template_name',
          minWidth: 150,
        },
        {
          headerName: this.translate.instant('contracts.cateogriesoffees'),
          cellRenderer: 'agTagsCell',
          minWidth: 300,
        },
        {
          headerName: this.translate.instant('contracts.totalContracts'),
          field: 'total',
          minWidth: 150
        },
        {
          headerName: this.translate.instant('contracts.amountPaid'),
          field: 'has_invoice_total',
          minWidth: 150
        },
        {
          headerName: this.translate.instant('contracts.amountRest'),
          field: 'amountRest',
          minWidth: 150
        },
        {
          headerName: 'الإجراءات',
          cellRenderer: 'agActionBtn',
          cellClass: 'action-cell',
          cellRendererParams: {
            actions: [
              {
                action: 'print',
                style: cellActionStyle
              },
              {
                action: 'cloud_upload',
                style: cellActionStyle
              },
              {
                action: 'wallpaper',
                style: cellActionStyle
              },
              {
                action: 'edit',
                style: cellActionStyle
              },
              {
                action: 'visibility',
                style: cellActionStyle
              },
              // {
              //   action: 'delete',
              //   style: DeleteActionStyle
              // },
            ],
            getAction: this.rowActions.bind(this),
          },
          minWidth: 300,
        }
      ];
    }
  }

  tableStateChange(e) {
    localStorage.setItem('columStatus', JSON.stringify(this.gridColumnApi.getColumnState()))
  }

  restoreState() {
    if (!localStorage.getItem('columStatus')) {
      return;
    }
    this.gridColumnApi.applyColumnState({
      state: JSON.parse(localStorage.getItem('columStatus')),
      applyOrder: true,
    });
  }

  // ===========[AG-GRID FUNCTION]==============

  rowActions(evt: any): void {
    if (evt.action === TableActions.printContract) {
      this.printContract(evt.data);
    }
    if (evt.action === TableActions.uploadModel) {
      this.uploadModel(evt.data);
    }
    if (evt.action === TableActions.contractInvoices) {
      this.contractInvoices(evt.data);
    }
    if (evt.action === TableActions.changeStatus) {
      this.changeStatus(evt.data);
    }
    if (evt.action == TableActions.delete) {
      this.onDelete(evt.data);
    }
    if (evt.action == TableActions.show) {
      this.openAddEditContract(evt.data,true);
    }
    if (evt.action == TableActions.edit) {
      this.openAddEditContract(evt.data);
    }
  }

  printContract(data) {
    const options = {
      orientation: 'P',
      format: 'A4',
      marginLeft: '5',
      marginTop: '5',
      marginRight: '5',
      marginBottom: '5',
    }
    this.Subscription.add(
      this._contract.downloadContract(data.id,options).subscribe(res =>{
        saveAs(res);
      })
    )
  }

  uploadModel(data) {
    const options = {
      orientation: 'P',
      format: 'A4',
      marginLeft: '5',
      marginTop: '5',
      marginRight: '5',
      marginBottom: '5',
      save_file:1
    }
    this.Subscription.add(
      this._contract.uploadContractToUser(data.id,options).subscribe((res:any) =>{
        this.toaster.success(res.message);
      })
    )
  }

  contractInvoices(data) {
    const dialogRef = this._MatDialog.open(ContractBillsComponent, {
      data: data,
      panelClass: ['custom-dialog-container', 'full-screen-modal'],
      width: '80vw',
      height: '80vh',
      autoFocus: false
    });

    this.Subscription.add(
      dialogRef.afterClosed().subscribe(
        (result) => {
          if (result) {
  
          }
        }
      )
    )
  }

  openAddEditContract(row?,disable?) {
    const dialogRef = this._MatDialog.open(AddEditContractComponent, {
      width: '650px',
      panelClass: 'custom-dialog-container',
      data: {
        data: row,
        disable : disable ? disable : false
      },
      autoFocus: false
    });

    this.Subscription.add(
      dialogRef.afterClosed().subscribe(result => {
        if (result) {
          this.getContracts();
        }
      })
    )
  }

  /**
 *
 * @param row
 */
  changeStatus(data) {
    const dialogRef = this._MatDialog.open(ConfirmDialogComponent, {
      width: "500px",
      data: {
        message: "common.changeStatusMessage",
        updateStatus: true,
      },
    });
    this.Subscription.add(
      dialogRef.afterClosed().subscribe((result) => {
        if (result) {
          this.Subscription.add(
            this._contract
              .changeStatus(data.id, data.status == 1 ? 2 : 1)
              .subscribe((res) => {
                this.toaster.success(res.message);
                this.getContracts();
              })
          )
        }
      })
    )
  }

  /**
 * @param row (All row data)
 */
  onDelete(row) {
    const dialogRef = this._MatDialog.open(ConfirmDialogComponent, {
      width: '500px',
      data: {
        message: 'common.deleteMessage',
        updateStatus: false,
        url: `users/contracts/${row.id}/delete`,
        domainUrl: `${environment.accountant_apiUrl}`,
        data : {
          "status":row.status
      }
      }
    });
    this.Subscription.add(
      dialogRef.afterClosed().subscribe(result => {
        if (result) {
          this.getContracts();
        }
      })
    )
  }

  /**
 * pagination events _____________________
 * @param event
 */
  pageEvent(event) {
    if (typeof event == "object") {
      this.fetchCriteria.page = event.pageIndex + 1;
    } else {
      this.fetchCriteria.page = event;
    }
    this.getContracts()
  }

}


