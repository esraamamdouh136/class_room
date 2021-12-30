import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { ToastrService } from 'ngx-toastr';
import { Subscription } from 'rxjs';
import { AgGridComponent } from 'src/app/shared/components/ag-grid/ag-grid.component';
import { AgActionBtnComponent } from 'src/app/shared/components/ag-grid/cell-renderers/ag-action-btn/ag-action-btn.component';
import { AgStatusBtnComponent } from 'src/app/shared/components/ag-grid/cell-renderers/ag-status-btn/ag-status-btn.component';
import { ConfirmDialogComponent } from 'src/app/shared/components/confirm-dialog/confirm-dialog.component';
import { cellActionStyle, TableActions } from 'src/app/shared/model/global';
import { SharedService } from 'src/app/shared/services/shared.service';
import { environment } from 'src/environments/environment';
import { ServiceService } from '../../service/service.service';
import { ContractDownloadDialogComponent } from './contract-download-dialog/contract-download-dialog.component';

@Component({
  selector: 'app-viewcontract',
  templateUrl: './viewcontract.component.html',
  styleUrls: ['./viewcontract.component.scss']
})
export class ViewcontractComponent implements OnInit {
  Subscription: Subscription = new Subscription()

  // ===============[AG-RID]=====================
  @ViewChild('agGrid') agGrid: AgGridComponent;

  currentPage = 1;
  message: string;
  existData = true;
  querySearch: string = '';
  errorMassage = true;
  columnDefs = [];
  rowData: any[] = [];
  defaultColDef = {
    filter: false,
    editable: false,
    resizable: true,
  };
  agSelectedRow;
  frameworkComponents: any;
  columnDefHeader: object = {};
  messageBoxError = {};
  tableItems = [];
  // pageOptions = {
  //   length: 10,
  //   paginationSizes: [],
  //   defaultPageSize: 15
  // };
  fetchCriteria = {
    page: 1,
  };
  constructor
    (
      private router: Router,
      private contractService: ServiceService,
      private matDialog: MatDialog,
      private toaster: ToastrService,
      private translate: TranslateService,
      private _shredService: SharedService,
  ) {
    this.frameworkComponents = {
      agActionBtn: AgActionBtnComponent,
      agStatusBtn: AgStatusBtnComponent,
    };
  }

  ngOnInit(): void {
    this.Subscription.add(
      this._shredService.navChanged$.subscribe(val => {
        if (val) {
        this.getContracts();
        }
    }))        
  }


  getContracts() {
    this.Subscription.add(
      this.contractService.getContracts(this.querySearch, this.fetchCriteria.page)
        .subscribe((res: any) => {
          this.tableItems = res.data;
          this.initializeAgGrid()
          // this.pageOptions.length = res.total;
          this.existData = true;
          this.errorMassage = true;
        },
          error => {
            this.messageBoxError = error.error;
            this.tableItems = [];
            this.initializeAgGrid();
            if (error.error.code === 4000) {
              this.errorMassage = false;
            } else {
              this.errorMassage = true;
              this.existData = false;
            }
          }));

  }




  // ===========[AG-GRID FUNCTION]==============
  /**
 * @description A function that initializes AG Grid
 */
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
          minWidth: 140
        },
        {
          headerName: this.translate.instant('contracts.name_contract'),
          field: 'main.name',
          minWidth: 300
        },
        // {
        //   headerName:this.translate.instant('contracts.item_of_number'),
        //   field: 'itemsLen',
        //   minWidth: 150
        // },
        // {
        //   headerName: this.translate.instant('general.status'),
        //   cellRenderer: 'agStatusBtn',
        //   cellRendererParams: {
        //     getAction: this.rowActions.bind(this),
        //   },
        //   minWidth: 150
        // },
        // {
        //   headerName:  this.translate.instant('general.date'),
        //   field: 'main.date',
        //   minWidth: 110,
        // },
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
                style: cellActionStyle
              },
              // {
              //   action: 'download',
              //   style: cellActionStyle
              // },

            ],
            getAction: this.rowActions.bind(this),
          },
          minWidth: 370
        }


      ];
    }
  }

  // ===========[AG-GRID FUNCTION]==============
  changeStatus(data?) {
    const dialog = this.matDialog.open(ConfirmDialogComponent, {
      width: '350px',
      data: {
        message: 'common.changeStatusMessage',
        updateStatus: true
      }
    });
    this.Subscription.add(
      dialog.afterClosed().subscribe(
        (result) => {
          if ((result)) {
            this.Subscription.add(
              this.contractService
                .changeStatus(data.id, { status: data.status === 1 ? 2 : 1 })
                .subscribe(
                  (res: any) => {
                    this.toaster.success(res?.message);
                    this.getContracts();
                  })
            );
          }
        }));
  }

  delete(data) {
    const dialog = this.matDialog.open(ConfirmDialogComponent, {
      width: '350px',
      data: {
        message: 'common.deleteMessage',
        updateStatus: false,
        url: `users/contract-templates/${data.id}/delete`,
        domainUrl: `${environment.accountant_apiUrl}`
      }
    });
    this.Subscription.add(
      dialog.afterClosed().subscribe(res => {
        if (res) {
          this.getContracts();
        }
      }));
  }


  rowActions(data: any): void {
    if (data.action === TableActions.delete) {
      this.delete(data?.data);
    } else if (data?.action === TableActions.download) {
      this.openDownload(data?.data);
    } else if (data?.action === TableActions.changeStatus) {
      this.changeStatus(data?.data);
    }
    else {
      this.router.navigate(['financial-operations/contracts-management/new_contract'], { queryParams: { id: data.data.id } })
    }
  }

  /**
 * pagination events _____________________
 * @param event
 */
  routerFuncLink() {
    this.router.navigateByUrl('financial-operations/contracts-management/new_contract')
  }

  openDownload(row?): void {
    const dialogRef = this.matDialog
      .open(ContractDownloadDialogComponent, {
        width: '600px',
        panelClass: 'custom-dialog-container',
        data: row
      });

    // this.subscription.add(
    //     dialogRef.afterClosed().subscribe(result => {
    //         if (result) {
    //             // this.getSemesters();
    //         }
    //     })
    // );
  }

}
