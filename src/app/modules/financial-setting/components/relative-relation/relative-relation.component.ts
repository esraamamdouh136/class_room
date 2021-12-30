import { MatDialog } from '@angular/material/dialog';
import { Component, OnDestroy, OnInit } from '@angular/core';

import { Subscription } from 'rxjs';
import { ToastrService } from 'ngx-toastr';

import { environment } from '../../../../../environments/environment';
import { SharedService } from 'src/app/shared/services/shared.service';
import { cellActionStyle, DeleteActionStyle, TableActions, TableColumns } from '../../../../shared/model/global';
import { RelativeRelation } from '../../models/relative-relation/relative-relation';
import { AddEditRelationComponent } from './add-edit-relation/add-edit-relation.component';
import { RelativeRelationService } from '../../services/relative-relation/relative-relation.service';
import { ConfirmDialogComponent } from '../../../../shared/components/confirm-dialog/confirm-dialog.component';
import { TranslateService } from '@ngx-translate/core';
import { AgActionBtnComponent } from 'src/app/shared/components/ag-grid/cell-renderers/ag-action-btn/ag-action-btn.component';
import { AgStatusBtnComponent } from 'src/app/shared/components/ag-grid/cell-renderers/ag-status-btn/ag-status-btn.component';
import { TranslationService } from 'src/app/modules/i18n/translation.service';

@Component({
    selector: 'app-relative-relation',
    templateUrl: './relative-relation.component.html',
    styleUrls: ['./relative-relation.component.scss']
})
export class RelativeRelationComponent implements OnInit, OnDestroy {

    message = '';
    searchQuery = '';
    errorMassage = true;
    messageBoxError: {};
    existData : boolean = true;
    tableColumns: TableColumns[] = TABLE_COLUMNS;
    tableItems: RelativeRelation[] = [];
    columnDefs = [];
    defaultColDef = {
      filter: false,
      editable: false,
      resizable: true,
    };
    frameworkComponents: any;
    subscription: Subscription = new Subscription();

    // Objects
    pageOptions = {
        length: 10,
        paginationSizes: [],
        defaultPageSize: 15,
    };
    fetchCriteria = {
        page: 1,
    };

    constructor(
        private matDialog: MatDialog,
        private toaster: ToastrService,
        private sharedService: SharedService,
        private relativeRelationService: RelativeRelationService,
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
        this.subscription.add(
            this.sharedService.navChanged$.subscribe(data => {
                if (data) {
                    this.getRelativeRelationData();
                }
            })
        )
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
              minWidth: 100
            },
            {
              headerName: this.translate.instant('general.name'),
              field: (this.translation.getSelectedLanguage()== 'ar') ? 'name_ar' : 'name_en',
              minWidth: 250,
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
                  {
                    action: 'delete',
                    style: DeleteActionStyle
                  },
                ],
                getAction: this.rowActions.bind(this),
              },
              minWidth: 250
            }
          ];
        }
      }

    ngOnDestroy() {
        this.subscription.unsubscribe();
    }

    // Dialog for adding new relative
    openAddRelativeDialog(row?: RelativeRelation): void {
        const newData: RelativeRelation = {
            status: 1
        };
        const dialogRef = this.matDialog
            .open(AddEditRelationComponent, {
                width: '600px',
                panelClass: 'custom-dialog-container',
                data: row || newData
            });

        this.subscription.add(
            dialogRef.afterClosed().subscribe(result => {
                if (result) {
                    this.getRelativeRelationData();
                }
            })
        );
    }

    // Get Relative Relation Data
    getRelativeRelationData(): void {
        this.subscription.add(
            this.relativeRelationService
                .getRelativeRelationData(this.searchQuery, this.fetchCriteria.page)
                .subscribe(
                    (res) => {
                        this.tableItems = res?.data;
                        this.initializeAgGrid()
                        this.pageOptions.length = res.total;
                        this.existData = true;
                        this.errorMassage = true;
                    },
                    error => {
                        this.messageBoxError = error.error,
                        this.tableItems = [];
                        if(error.error.code === 4000 ){
                        this.errorMassage = false;
                        }
                        else{
                        this.errorMassage = true;
                        this.existData = false;
                    }}

                ));
    }

    onSearchChange(e){
        this.getRelativeRelationData()
    }

    changeStatus(data) {
        const dialogRef = this.matDialog.open(ConfirmDialogComponent, {
            width: '500px',
            data: {
                message: 'common.changeStatusMessage',
                updateStatus: true,
            }
        });
        this.subscription.add(
            dialogRef.afterClosed().subscribe(result => {
                if (result) {
                    this.subscription.add(
                        this.relativeRelationService
                        .changeStatus(data.id, { status: data.status === 1 ? 2 : 1 })
                        .subscribe(
                            (res) => {
                                this.toaster.success(res.message);
                                this.getRelativeRelationData();
                            })
                    );
                }
            })
        );
    }

    onDelete(row) {
        const dialogRef = this.matDialog
            .open(ConfirmDialogComponent, {
                width: '500px',
                data: {
                    message: 'common.deleteMessage',
                    updateStatus: false,
                    url: `users/relative-relations/${row?.id}/delete`,
                    domainUrl: `${environment.accountant_apiUrl}`
                }
            });

        this.subscription.add(
            dialogRef.afterClosed()
            .subscribe(
                (result) => {
                    if (result) {
                        this.getRelativeRelationData();
                    }
                })
        );
    }


    rowActions(evt): void {
        if (evt.action === TableActions.delete) {
            this.onDelete(evt.data);
        } else if (evt.action === TableActions.changeStatus) {
            this.changeStatus(evt.data);
        } else {
            this.openAddRelativeDialog(evt.data);
        }
    }

    pageEvent(evt): void {
        if (typeof evt === 'object') {
            this.fetchCriteria.page = evt.pageIndex + 1;
        } else {
            this.fetchCriteria.page = evt;
        }
        this.getRelativeRelationData();
    }
}

export const TABLE_COLUMNS = [
    {
        name: 'general.name',
        dataKey: 'auto_name',
        isSortable: false
    },
    {
        name: 'general.status',
        dataKey: 'statusView',
        isSortable: false
    }
];