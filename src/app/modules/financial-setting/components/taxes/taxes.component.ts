import {MatDialog} from '@angular/material/dialog';
import {Component, OnDestroy, OnInit} from '@angular/core';

import {Subscription} from 'rxjs';
import {ToastrService} from 'ngx-toastr';

import {Taxes} from '../../models/taxes/taxes';
import {cellActionStyle, DeleteActionStyle, TableActions, TableColumns} from '../../../../shared/model/global';
import {TaxesService} from '../../services/taxes/taxes.service';
import {environment} from '../../../../../environments/environment';
import {SharedService} from 'src/app/shared/services/shared.service';
import {AddEditTaxesComponent} from './add-edit-taxes/add-edit-taxes.component';
import {ConfirmDialogComponent} from '../../../../shared/components/confirm-dialog/confirm-dialog.component';
import {JournalEntriesComponent} from '../../../../shared/components/journal-entries/journal-entries.component';
import {AgActionBtnComponent} from 'src/app/shared/components/ag-grid/cell-renderers/ag-action-btn/ag-action-btn.component';
import {AgStatusBtnComponent} from 'src/app/shared/components/ag-grid/cell-renderers/ag-status-btn/ag-status-btn.component';
import {AgImageFormatterComponent} from 'src/app/shared/components/ag-grid/cell-renderers/ag-imageFormatter/ag-image-formatter.component';
import {TranslateService} from '@ngx-translate/core';


@Component({
    selector: 'app-taxes',
    templateUrl: './taxes.component.html',
    styleUrls: ['./taxes.component.scss']
})
export class TaxesComponent implements OnInit, OnDestroy {

    existData = true;
    dataLoaded = false;
    errorMassage = true;

    message: string;
    searchQuery = '';
    messageBoxError = {};
    tableItems: Taxes[] = [];
    columnDefs = [];
    defaultColDef = {
        filter: false,
        editable: false,
        resizable: true,
    };
    fetchCriteria = {
        page: 1,
    };
    pageOptions = {
        length: 10,
        paginationSizes: [],
        defaultPageSize: 15,
    };
    frameworkComponents: any;


    tableColumns: TableColumns[] = TABLE_COLUMNS;
    subscription: Subscription = new Subscription();


    // Objects


    constructor(
        private matDialog: MatDialog,
        private toaster: ToastrService,
        private taxesService: TaxesService,
        private sharedService: SharedService,
        private translate: TranslateService,

    ) {
        this.frameworkComponents = {
            agActionBtn: AgActionBtnComponent,
            agStatusBtn: AgStatusBtnComponent,
            AgImageFormatter: AgImageFormatterComponent,
        };
    }

    initializeAgGrid(): void {
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
              headerName: this.translate.instant('general.image'),
              field: 'image_path',
              minWidth: 110,
              cellRenderer: 'AgImageFormatter',
              cellRendererParams: {
                width: '35px',
                height: '35px',
                radius: '50%'
              },
            },
            {
              headerName: this.translate.instant('setting.taxes.account_details'),
              field: 'account_details',
              minWidth: 250
            },
            {
              headerName: this.translate.instant('setting.taxes.tax_number'),
              field: 'tax_number',
              minWidth: 200
            },
            {
                headerName: this.translate.instant('general.taxes'),
                field: 'taxes',
                minWidth: 150
              },
              {
                headerName: this.translate.instant('setting.taxes.free_nationalities'),
                field: 'nationalities',
                minWidth: 150
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
                  }
                ],
                getAction: this.rowActions.bind(this),
              },
              minWidth: 150
            }
          ];

        }
    }

    ngOnInit(): void {
        this.getData();
    }

    ngOnDestroy(): void {
        this.subscription.unsubscribe();
    }

    getData() {
        this.subscription.add(
            this.sharedService.navChanged$.subscribe(val => {
                if (val) {
                    this.getTaxes();
                }
            })
        )
    }

    getTaxes(): void {
        this.subscription.add(
            this.taxesService.getTaxes(this.searchQuery, this.fetchCriteria.page)
                .subscribe(
                    (res) => {
                        this.tableItems = res.data;
                        this.initializeAgGrid()
                        this.pageOptions.length = res.total;
                        this.message = res.message;
                        this.existData = true;
                        this.errorMassage = true;
                    },
                    error => {
                        this.messageBoxError = error.error,
                            this.tableItems = [];
                        this.initializeAgGrid();
                        if (error.error.code === 4000) {
                            this.errorMassage = false;
                        }
                        else {
                            this.errorMassage = true;
                            this.existData = false;
                        }
                    }
                )
        );
    }


    /**
     * When user search get data with keyword
     */
    onSearchChange(word) {
        this.searchQuery = word;
        this.getTaxes();
    }

    rowActions(evt): void {
        if (evt.action === TableActions.delete) {
            this.onDelete(evt.data);
        } else if (evt.action === TableActions.changeStatus) {
            this.changeStatus(evt.data);
        } else {
            this.openAddEditTaxes(evt.data);
        }
    }

    openAddEditTaxes(row?: Taxes): void {
        const newData: Taxes = {
            status: 1,
        };
        const dialogRef = this.matDialog
            .open(AddEditTaxesComponent, {
                width: '600px',
                panelClass: 'custom-dialog-container',
                data: row || newData
            });

        this.subscription.add(
            dialogRef.afterClosed().subscribe(result => {
                if (result) {
                    this.getTaxes();
                }
            }
            )
        )
    }


    openJournalEntriesDialog(): void {
        const dialogRef = this.matDialog
            .open(JournalEntriesComponent, {
                width: '1200px',
                panelClass: 'custom-dialog-container',
                data: { type: 'tax' }
            });

        this.subscription.add(
            dialogRef.afterClosed().subscribe(result => {
                if (result) {
                }
            })
        )
    }

    onDelete(row) {
        const dialogRef = this.matDialog
            .open(ConfirmDialogComponent, {
                width: '500px',
                data: {
                    message: 'common.deleteMessage',
                    updateStatus: false,
                    url: `users/taxes/${row?.id}/delete`,
                    domainUrl: `${environment.accountant_apiUrl}`
                }
            });

        this.subscription.add(
            dialogRef.afterClosed()
                .subscribe(
                    (result) => {
                        if (result) {
                            this.getTaxes();
                        }
                    }
                )
        )
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
                        this.taxesService
                            .changeStatus(data.id, { status: data.status === 1 ? 2 : 1 })
                            .subscribe(
                                (res) => {
                                    this.toaster.success(res.message);
                                    this.getTaxes();
                                }
                            )
                    )
                }
            })
        )
    }

    pageEvent(evt): void {
        if (typeof evt === 'object') {
            this.fetchCriteria.page = evt.pageIndex + 1;
        } else {
            this.fetchCriteria.page = evt;

        }
        this.getTaxes();
    }

}

export const TABLE_COLUMNS = [
    {
        name: 'general.image',
        dataKey: 'image_path',
        isSortable: false
    },
    {
        name: 'setting.taxes.account_details',
        dataKey: 'account_details',
        isSortable: false
    },
    {
        name: 'setting.taxes.tax_number',
        dataKey: 'tax_number',
        isSortable: false
    },
    {
        name: 'general.taxes',
        dataKey: 'taxes',
        isSortable: false
    },
    {
        name: 'setting.taxes.free_nationalities',
        dataKey: 'nationalities',
        isSortable: false
    },
    {
        name: 'general.status',
        dataKey: 'statusView',
        isSortable: false
    },
]
