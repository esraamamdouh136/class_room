import { Component, OnDestroy, OnInit } from '@angular/core';
import { TypesOfFees } from '../../models/types-of-fees/types-of-fees';
import { Subscription } from 'rxjs';
import { cellActionStyle, DeleteActionStyle, TableActions, TableColumns } from '../../../../shared/model/global';
import { MatDialog } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';
import { TypesOfFeesService } from '../../services/types-of-fees/types-of-fees.service';
import { ConfirmDialogComponent } from '../../../../shared/components/confirm-dialog/confirm-dialog.component';
import { AddEditFeesComponent } from './add-edit-fees/add-edit-fees.component';
import { environment } from '../../../../../environments/environment';
import { SharedService } from 'src/app/shared/services/shared.service';
import { AgActionBtnComponent } from 'src/app/shared/components/ag-grid/cell-renderers/ag-action-btn/ag-action-btn.component';
import { AgStatusBtnComponent } from 'src/app/shared/components/ag-grid/cell-renderers/ag-status-btn/ag-status-btn.component';
import { TranslateService } from '@ngx-translate/core';
import { TranslationService } from 'src/app/modules/i18n/translation.service';
import * as moment from 'moment';

@Component({
    selector: 'app-types-of-fees',
    templateUrl: './types-of-fees.component.html',
    styleUrls: ['./types-of-fees.component.scss']
})
export class TypesOfFeesComponent implements OnInit, OnDestroy {

    // Variables
    subscription: Subscription = new Subscription();
    searchQuery = '';
    existData = true;
    errorMassage = true;

    // Arrays
    tableColumns: TableColumns[] = [
        {
            name: 'general.name',
            dataKey: 'auto_name',
            isSortable: false
        },
        {
            name: 'general.status',
            dataKey: 'statusView',
            isSortable: false
        },
        {
            name: 'setting.typesOfFees.cost_center',
            dataKey: 'cost_center_name',
            isSortable: false
        },
        {
            name: 'general.updated_at',
            dataKey: 'date',
            isSortable: false
        },
    ];
    tableItems: TypesOfFees[] = [];

    // Objects
    messageBoxError: {};
    pageOptions = {
        paginationSizes: [],
        defaultPageSize: 15,
        length: 10
    };
    fetchCriteria = {
        page: 1,
    };
    columnDefs = [];
    defaultColDef = {
        filter: false,
        editable: false,
        resizable: true,
    };
    frameworkComponents: any;

    constructor(
        private typesOfFeesService: TypesOfFeesService,
        private matDialog: MatDialog,
        private toaster: ToastrService,
        private _sharedService: SharedService,
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
            this._sharedService.navChanged$.subscribe(data => {
                if (data) {
                    this.getTypesOfFees();
                }
            })
        );
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
              headerName: this.translate.instant('general.name'),
             field: (this.translation.getSelectedLanguage()== 'ar') ? 'name_ar' : 'name_en',

              minWidth: 200,
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
                headerName: this.translate.instant('general.cost_center'),
                field: 'cost_center_name',
                minWidth: 200,
              },
              {
                headerName: this.translate.instant('general.updated_at'),
                field: 'date',
                cellRenderer: (data) => {
                    return moment(data.date).format('HH:mm MM/DD/YYYY')
                },
                minWidth: 200,
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
              minWidth: 150
            }
          ];

        }
    }

    ngOnDestroy(): void {
        this.subscription.unsubscribe();
    }

    getTypesOfFees(): void {
        this.subscription.add(
            this.typesOfFeesService
                .getTypesOfFees(this.searchQuery, this.fetchCriteria.page)
                .subscribe(
                    (res) => {
                        this.tableItems = res?.data;
                        this.initializeAgGrid()
                        this.pageOptions.length = res.total;
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
                    }
                ));
    }

    onSearchChange(e) {
        this.getTypesOfFees();
    }

    openAddTypesOfFees(row?: TypesOfFees): void {
        const newData: TypesOfFees = {
            status: 1,
        };
        const dialogRef = this.matDialog
            .open(AddEditFeesComponent, {
                minWidth: '600px',
                panelClass: 'custom-dialog-container',
                data: row || newData
            });

        dialogRef.afterClosed().subscribe(result => {
            if (result) {
                this.getTypesOfFees();
            }
        });
    }

    changeStatus(data) {
        const dialogRef = this.matDialog.open(ConfirmDialogComponent, {
            width: '500px',
            data: {
                message: 'common.changeStatusMessage',
                updateStatus: true,
            }
        });
        this.subscription.add(dialogRef.afterClosed().subscribe(result => {
            if (result) {
                this.typesOfFeesService
                    .changeStatus(data.id, { status: data.status === 1 ? 2 : 1 })
                    .subscribe(
                        (res) => {
                            this.toaster.success(res.message);
                            this.getTypesOfFees();
                        });
            }
        }));
    }

    onDelete(row) {
        const dialogRef = this.matDialog
            .open(ConfirmDialogComponent, {
                width: '500px',
                data: {
                    message: 'common.deleteMessage',
                    updateStatus: false,
                    url: `users/fees_classes/${row?.id}/delete`,
                    domainUrl: `${environment.accountant_apiUrl}`
                }
            });

        this.subscription.add(dialogRef.afterClosed()
            .subscribe(
                (result) => {
                    if (result) {
                        this.getTypesOfFees();
                    }
                }));
    }

    rowActions(evt): void {
        if (evt.action === TableActions.delete) {
            this.onDelete(evt.data);
        } else if (evt.action === TableActions.changeStatus) {
            this.changeStatus(evt.data);
        } else {
            this.openAddTypesOfFees(evt.data);
        }
    }

    pageEvent(evt): void {
        if (typeof evt === 'object') {
            this.fetchCriteria.page = evt.pageIndex + 1;
        } else {
            this.fetchCriteria.page = evt;

        }
        this.getTypesOfFees();
    }

}
