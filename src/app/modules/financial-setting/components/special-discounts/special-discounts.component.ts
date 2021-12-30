import { Component, OnDestroy, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';

import { Subscription } from 'rxjs';
import { ToastrService } from 'ngx-toastr';

import { environment } from 'src/environments/environment';
import { SharedService } from 'src/app/shared/services/shared.service';
import { cellActionStyle, DeleteActionStyle, TableActions } from '../../../../shared/model/global';
import { specialDiscounts } from '../../models/special-discounts.ts/special-discounts';
import { SpecialDiscountsService } from '../../services/special-discounts/special-discounts.service';
import { SpecialDialogComponent } from './add-edit-special-discount/add-edit-special-discount.component';
import { ConfirmDialogComponent } from 'src/app/shared/components/confirm-dialog/confirm-dialog.component';
import { JournalEntriesComponent } from 'src/app/shared/components/journal-entries/journal-entries.component';
import { TranslateService } from '@ngx-translate/core';
import { AgActionBtnComponent } from 'src/app/shared/components/ag-grid/cell-renderers/ag-action-btn/ag-action-btn.component';
import { AgStatusBtnComponent } from 'src/app/shared/components/ag-grid/cell-renderers/ag-status-btn/ag-status-btn.component';
import { TranslationService } from 'src/app/modules/i18n/translation.service';

@Component({
    selector: 'app-special-discounts',
    templateUrl: './special-discounts.component.html',
    styleUrls: ['./special-discounts.component.scss']
})
export class SpecialDiscountsComponent implements OnInit, OnDestroy {
    message: string;
    querySearch: string = '';
    
    currentPage: number = 1;
    subscription: Subscription = new Subscription();


    existData = true;
    errorMassage = true;

    tableColumns = TABLE_COLUMNS;
    tableItems: specialDiscounts[];
    messageBoxError:{};
    columnDefs = [];
    defaultColDef = {
      filter: false,
      editable: false,
      resizable: true,
    };
    frameworkComponents: any;
    // pagination Object
    pageOptions = {
        length: 10,
        paginationSizes: [],
        defaultPageSize: 15,
    };

    constructor(
        private matDialog: MatDialog,
        private toaster: ToastrService,
        private sharedService: SharedService,
        private SpecialDiscountsService: SpecialDiscountsService,
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
                    this.getSpecialDiscounts();
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
              minWidth: 80
            },
            {
              headerName: this.translate.instant('general.name'),
             field: (this.translation.getSelectedLanguage()== 'ar') ? 'name_ar' : 'name_en',

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
              headerName: this.translate.instant('general.discount_percentage'),
              field: 'discount_per',
              minWidth: 100
            },
            {
              headerName: this.translate.instant('general.discount_value'),
              field: 'discount_value',
              minWidth: 100
            },
            {
                headerName: this.translate.instant('general.class_room'),
                field: 'classrooms_str',
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
              minWidth: 150
            }
          ];
        }
      }

    ngOnDestroy() {
        this.subscription.unsubscribe();
    }

    getSpecialDiscounts() {
        this.subscription.add(
            this.SpecialDiscountsService.getSpecialDoscounts(this.querySearch, this.currentPage)
                .subscribe(
                    (res: any) => {
                        this.tableItems = res?.data
                        this.initializeAgGrid()
                        this.pageOptions.length = res?.total;
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
                    })
        );
    }

    onSearchChange(e){
        this.currentPage = 1
        this.getSpecialDiscounts();
    }



    // Dialog For Add And Edit Row
    openAddEditSpecialDiscountForm(row?): void {
        const newData = {
            status: 1
        };
        const dialogRef = this.matDialog
            .open(SpecialDialogComponent, {
                width: '600px',
                panelClass: 'custom-dialog-container',
                data: row || newData
            });

        this.subscription.add(
            dialogRef.afterClosed().subscribe(result => {
                if (result) {
                    this.getSpecialDiscounts();
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
                        this.SpecialDiscountsService.changeStatus(data.id, { status: data.status === 1 ? 2 : 1 })
                            .subscribe((res: any) => {
                                this.toaster.success(res.message);
                                this.getSpecialDiscounts();
                            });
                    }
                })
        );
    }

    delete(data) {
        const dialog = this.matDialog.open(ConfirmDialogComponent, {
            width: '350px',
            data: {
                message: 'common.deleteMessage',
                updateStatus: false,
                url: `users/special-discounts/${data.id}/delete`,
                domainUrl: `${environment.accountant_apiUrl}`
            }
        });
        this.subscription.add(
            dialog.afterClosed().subscribe(res => {
                if (res) {
                    this.getSpecialDiscounts();
                }
            })
        );
    }


    rowActions(evt): void {
        if (evt.action === TableActions.delete) {
            this.delete(evt.data);
        } else if (evt.action === TableActions.changeStatus) {
            this.changeStatus(evt.data);
        } else {
            this.openAddEditSpecialDiscountForm(evt.data);
        }
    }


    // pagination function
    pageEvent(event) {
        this.currentPage = event;
        this.getSpecialDiscounts();
    }

    openJournalEntriesDialog(): void {
        const dialogRef = this.matDialog
            .open(JournalEntriesComponent, {
                width: '1200px',
                panelClass: 'custom-dialog-container',
                data: { type: 'specialdiscounts' }
            });
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
    },
    {
        name: 'general.discount_percentage',
        dataKey: 'discount_per',
        isSortable: false
    },
    {
        name: 'general.discount_value',
        dataKey: 'discount_value',
        isSortable: false
    },
    {
        name: 'general.class_room',
        dataKey: 'classrooms_str',
        isSortable: false
    },

];