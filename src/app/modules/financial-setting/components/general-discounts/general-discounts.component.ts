import { Component, OnDestroy, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { TranslateService } from '@ngx-translate/core';


import { Subscription } from 'rxjs';
import { ToastrService } from 'ngx-toastr';
import { environment } from 'src/environments/environment';
import { SharedService } from "src/app/shared/services/shared.service";
import { generalDiscount } from '../../models/general-discount/general-discount';
import { GeneralDiscountsService } from '../../services/general-discounts/general-discounts.service';
import { ConfirmDialogComponent } from 'src/app/shared/components/confirm-dialog/confirm-dialog.component';
import { GeneralDiscountsFormComponent } from './add-edit-general-discount/add-edit-general-discount.component';
import { AgActionBtnComponent } from 'src/app/shared/components/ag-grid/cell-renderers/ag-action-btn/ag-action-btn.component';
import { AgStatusBtnComponent } from 'src/app/shared/components/ag-grid/cell-renderers/ag-status-btn/ag-status-btn.component';
import { cellActionStyle, DeleteActionStyle } from 'src/app/shared/model/global';
import { TranslationService } from 'src/app/modules/i18n/translation.service';

@Component({
    selector: 'app-general-discounts',
    templateUrl: './general-discounts.component.html',
    styleUrls: ['./general-discounts.component.scss']
})
export class GeneralDiscountsComponent implements OnInit, OnDestroy {
    message: string;
    querySearch: string = '';

    currentPage: number = 1;
    subscription: Subscription = new Subscription();

    exist_data: boolean = true;
    update = false;
    errorMassage = true;

    messageBoxError: {};
    class_rooms: any;
    tableItems : generalDiscount[];
    columnDefs = [];
    defaultColDef = {
      filter: false,
      editable: false,
      resizable: true,
    };
    frameworkComponents: any;
    tableColumns = [
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


    // pagination Object
    pageOptions = {
        paginationSizes: [],
        defaultPageSize: 15,
        length: 10
    };

    constructor(
        private generalDiscountsService: GeneralDiscountsService,
        private matDialog: MatDialog,
        private toaster: ToastrService,
        private sharedService: SharedService,
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
                minWidth: 120
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
                  {
                    action: 'lock',
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
    

    ngOnDestroy(): void {
        this.subscription.unsubscribe();
    }


    getSpecialDiscounts() {
        this.subscription.add(
            this.generalDiscountsService.getGeneralDoscounts(this.querySearch, this.currentPage)
                .subscribe((res: any) => {
                    if (res.code === 200) {
                        this.tableItems  = res.data
                        this.initializeAgGrid()
                        this.pageOptions.length = res.total;
                        this.exist_data = true;
                        this.errorMassage = true;

                    }
                },
                    error => {
                        this.messageBoxError = error.error,
                        this.tableItems = [];
                        if (error.error.code === 4000) {
                            this.errorMassage = false;
                        }
                        else {
                            this.errorMassage = true;
                            this.exist_data = false;
                        }
                    }

                )
        );
    }

    onSearchChange(e) {
        this.currentPage = 1;
        this.getSpecialDiscounts();
    }


    // Dialog For Add And Edit Row
    openAddEditGeneralDiscountForm(row?): void {
        const dialogRef = this.matDialog
            .open(GeneralDiscountsFormComponent, {
                width: '600px',
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
                    this.getSpecialDiscounts();
                }
            }))
    }

    changeStatus(data) {
        const dialog = this.matDialog.open(ConfirmDialogComponent, {
            width: '350px',
            data: {
                message: 'common.changeStatusMessage',
                updateStatus: true
            }
        });
        this.subscription.add(
            dialog.afterClosed().subscribe((result: any) => {
                if ((result)) {
                    this.generalDiscountsService
                        .changeStatus(data.id, { status: data.status === 1 ? 2 : 1 })
                        .subscribe((res: any) => {
                            this.toaster.success(res.message);
                            this.getSpecialDiscounts();
                        });
                }
            }))
    }

    delete(data) {
        const dialog = this.matDialog.open(ConfirmDialogComponent, {
            width: '350px',
            data: {
                message: 'common.deleteMessage',
                updateStatus: false,
                url: `users/general-discounts/${data.id}/delete`,
                domainUrl: `${environment.accountant_apiUrl}`
            }
        })
        this.subscription.add(
            dialog.afterClosed().subscribe(res => {
                if (res) {
                    this.getSpecialDiscounts();
                }
            }))
    }


    rowActions(data): void {
        if (data.action === 'delete') {
            this.delete(data.data);
        } else if (data.action === 'CHANGE_STATUS') {
            this.changeStatus(data.data);
        } else {
            this.update = true;
            const FormData = {
                ...data.data,
                status: data.data.status === 1,
            };
            this.openAddEditGeneralDiscountForm(FormData);
        }
    }

    // pagination function
    pageEvent(event) {
        this.currentPage = event;
        this.getSpecialDiscounts();
    }
}


