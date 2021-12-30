import {
    MatDialog
} from '@angular/material/dialog';
import {
    Component,
    OnDestroy,
    OnInit
} from '@angular/core';

import {
    Subscription
} from 'rxjs';
import {
    ToastrService
} from 'ngx-toastr';
import {
    TranslateService
} from '@ngx-translate/core';

import {
    cellActionStyle,
    DeleteActionStyle,
    TableActions
} from "src/app/shared/model/global";
import {
    environment
} from '../../../../../environments/environment';
import {
    SharedService
} from "src/app/shared/services/shared.service";
import {
    SemestersService
} from '../../services/semesters/semesters.service';
import {
    AddEditSemestersComponent
} from './add-edit-semesters/add-edit-semesters.component';
import {
    ConfirmDialogComponent
} from '../../../../shared/components/confirm-dialog/confirm-dialog.component';
import { AgActionBtnComponent } from 'src/app/shared/components/ag-grid/cell-renderers/ag-action-btn/ag-action-btn.component';
import { AgStatusBtnComponent } from 'src/app/shared/components/ag-grid/cell-renderers/ag-status-btn/ag-status-btn.component';
import { TranslationService } from 'src/app/modules/i18n/translation.service';
import { AgSetPresentBtnComponent } from "src/app/shared/components/ag-grid/cell-renderers/ag-set-present-btn/ag-set-present-btn.component";

@Component({
    selector: 'app-semsters',
    templateUrl: './semsters.component.html',
    styleUrls: ['./semsters.component.scss']
})
export class SemstersComponent implements OnInit, OnDestroy {

    tableItems: any;
    currentPage = 1;
    message: string;
    existData = true;
    searchQuery = '';
    errorMassage = true;
    messageBoxError: {};
    subscription: Subscription = new Subscription();

    tableColumns = TABLE_COLUMNS;

    // pagination Object
    pageOptions = {
        length: 10,
        paginationSizes: [],
        defaultPageSize: 15,
    };
    columnDefs = [];
    defaultColDef = {
        filter: false,
        editable: false,
        resizable: true,
    };
    frameworkComponents: any;

    constructor(
        private matDialog: MatDialog,
        private toaster: ToastrService,
        private _sharedService: SharedService,
        private semestersService: SemestersService,
        private translate: TranslateService,
        public translation: TranslationService,
    ) {
        this.frameworkComponents = {
            agActionBtn: AgActionBtnComponent,
            agStatusBtn: AgStatusBtnComponent,
            agSetPresent: AgSetPresentBtnComponent,
        };
    }

    ngOnInit(): void {
        this.subscription.add(
            this._sharedService.navChanged$.subscribe(data => {
                if (data) {
                    this.getSemesters();
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
                    field: (this.translation.getSelectedLanguage() == 'ar') ? 'name_ar' : 'name_en',

                    minWidth: 100,
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
                    headerName: this.translate.instant('general.date_start'),
                    field: 'date_start',
                    minWidth: 120
                },
                {
                    headerName: this.translate.instant('general.date_end'),
                    field: 'date_end',
                    minWidth: 150
                },
                {
                    headerName: 'الحالي',
                    cellRenderer: 'agSetPresent',
                    cellClass: 'action-cell',
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
                    minWidth: 200
                }
            ];
        }
    }

    ngOnDestroy(): void {
        this.subscription.unsubscribe();
    }

    getSemesters(): void {
        this.subscription.add(this.semestersService
            .getSemesters(this.searchQuery, this.currentPage)
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
                    if (error.error.code === 4000) {
                        this.errorMassage = false;
                    }
                    else {
                        this.errorMassage = true;
                        this.existData = false;
                    }
                }

            ));
    }

    onSearchChange(e) {
        this.currentPage = 1
        this.getSemesters();
    }

    // Dialog For Add And Edit Row
    openAddEditSemester(row?): void {
        const newData = {
            status: 1
        };
        const dialogRef = this.matDialog
            .open(AddEditSemestersComponent, {
                width: '600px',
                panelClass: 'custom-dialog-container',
                data: row || newData
            });

        this.subscription.add(
            dialogRef.afterClosed().subscribe(result => {
                if (result) {
                    this.getSemesters();
                }
            })
        );
    }

    changeStatus(data): void {
        const dialog = this.matDialog
            .open(ConfirmDialogComponent, {
                width: '350px',
                data: {
                    message: 'common.changeStatusMessage',
                    updateStatus: true
                }
            });
        this.subscription.add(
            dialog.afterClosed().subscribe(
                (result: any) => {
                    if ((result)) {
                        this.semestersService.changeStatus(data.id, {
                            status: data.status === 1 ? 2 : 1
                        })
                            .subscribe((res: any) => {
                                this.toaster.success(res.message);
                                this.getSemesters();
                            });
                    }
                })
        );
    }

    delete(data): void {
        const dialog = this.matDialog.open(ConfirmDialogComponent, {
            width: '350px',
            data: {
                message: 'common.deleteMessage',
                updateStatus: false,
                url: `users/semsters/${data.id}/delete`,
                domainUrl: `${environment.accountant_apiUrl}`
            }
        });
        this.subscription.add(
            dialog.afterClosed().subscribe(res => {
                if (res) {
                    this.getSemesters();
                }
            })
        );
    }

    rowActions(evt): void {
        if (evt.action === TableActions.delete) {
            this.delete(evt.data);
        } else if (evt.action === TableActions.changeStatus) {
            this.changeStatus(evt.data);
        } else if (evt.action === TableActions.edit) {
            this.openAddEditSemester(evt.data);
        } 
    }

    


    // pagination function
    pageEvent(event) {
        this.currentPage = event;
        this.getSemesters();
    }


}
export const TABLE_COLUMNS = [{
    name: 'general.semaster',
    dataKey: 'auto_name',
    isSortable: false
},
{
    name: 'general.semasterStart',
    dataKey: 'date_start',
    isSortable: false
},
{
    name: 'general.semasterEnd',
    dataKey: 'date_end',
    isSortable: false
},
{
    name: 'general.status',
    dataKey: 'statusView',
    isSortable: false
},
];