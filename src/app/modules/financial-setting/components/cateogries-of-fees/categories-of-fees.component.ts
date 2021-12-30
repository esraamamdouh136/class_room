import {Component, OnDestroy, OnInit} from '@angular/core';
import {MatDialog} from '@angular/material/dialog';
import {Router} from '@angular/router';
import {TranslateService} from '@ngx-translate/core';


import {Subscription} from 'rxjs';
import {ToastrService} from 'ngx-toastr';
import {environment} from 'src/environments/environment';
import {SharedService} from 'src/app/shared/services/shared.service';
import {categoriesFess} from '../../models/categoriesFees/categories';


import {categoriesFeesService} from '../../services/cateogries-of-fees/categories-of-fees.service';
import {ConfirmDialogComponent} from 'src/app/shared/components/confirm-dialog/confirm-dialog.component';
import {JournalEntriesComponent} from 'src/app/shared/components/journal-entries/journal-entries.component';
import { AgActionBtnComponent } from 'src/app/shared/components/ag-grid/cell-renderers/ag-action-btn/ag-action-btn.component';
import { AgStatusBtnComponent } from 'src/app/shared/components/ag-grid/cell-renderers/ag-status-btn/ag-status-btn.component';
import { cellActionStyle, DeleteActionStyle } from 'src/app/shared/model/global';
import { TranslationService } from 'src/app/modules/i18n/translation.service';
import * as moment from 'moment';


@Component({
  selector: 'app-categories-of-fees',
  templateUrl: './categories-of-fees.component.html',
  styleUrls: ['./categories-of-fees.component.scss']
})

export class CategoriesOfFeesComponent implements OnInit, OnDestroy {
  message: string;
  searchInput: string = '';


  currentPage: number = 1;
  subscription: Subscription = new Subscription();

  columnDefs = [];
  defaultColDef = {
    filter: false,
    editable: false,
    resizable: true,
  };
  frameworkComponents: any;
  exist_data: boolean = true;
  errorMassage: boolean = true;

  messageBoxError: {};
  tableItems: categoriesFess[];
  selectedCompanyNumber;

  constructor(
    private serviceCategories: categoriesFeesService,
    private toaster: ToastrService,
    private router: Router,
    private sharedService: SharedService,
    private matDialog: MatDialog,
    private translate : TranslateService,
    public translation: TranslationService,

    ) 
  {
    this.frameworkComponents = {
      agActionBtn: AgActionBtnComponent,
      agStatusBtn: AgStatusBtnComponent,
    };
   }

  // Data Table
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
      name: 'general.updated_at',
      dataKey: 'date',
      isSortable: false
    }
  ];


  ngOnInit(): void {
    this.subscription.add(
      this.sharedService.navChanged$.subscribe(data => {
        if (data) {
          this.getDataCategories();
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
          minWidth: 100
        },
        {
          headerName: this.translate.instant('general.name'),
         field: (this.translation.getSelectedLanguage()== 'ar') ? 'name_ar' : 'name_en',

          minWidth: 150,
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
            headerName: this.translate.instant('general.updated_at'),
            field: 'date',
            minWidth: 150,
            cellRenderer: (data) => {
              return moment(data.date).format('HH:mm MM/DD/YYYY')
          },
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
          minWidth: 250
        }
      ];
    }
  }


  getDataCategories() {
    this.subscription.add(this.serviceCategories
      .getCategories(this.searchInput, this.currentPage)
      .subscribe(res => {
          this.tableItems = res.data;
          this.initializeAgGrid();
          this.pageOptions.length = res.total;
          this.exist_data = true;
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
            this.exist_data = false;
          }
        }
      ));
  }

  onSearchChange(e) {
    this.currentPage = 1;
    this.getDataCategories();
  }

  editCategoriesRow(row: any) {
    this.router.navigate(['/settings/general-ledger/cateogries-form'], {queryParams: {id: row.id}});
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
      dialogRef.afterClosed()
        .subscribe(result => {
          if (result) {
            this.serviceCategories
              .changeStatus(data.id, {status: data.status === 1 ? 2 : 1})
              .subscribe((res: any) => {
                  this.toaster.success(res.message);
                  this.getDataCategories();

                }
              );
          }
        }));
  }

  delete(row) {
    const dialogRef = this.matDialog
      .open(ConfirmDialogComponent, {
        width: '500px',
        data: {
          message: 'common.deleteMessage',
          updateStatus: false,
          url: `users/fees_types/${row.id}/delete`,
          domainUrl: `${environment.accountant_apiUrl}`
        }
      });
    this.subscription.add(
      dialogRef.afterClosed()
        .subscribe((result) => {
          if (result) {
            this.getDataCategories();
          }
        }));
  }

  rowActions(evt: any): void {
    if (evt.action === 'delete') {
      this.delete(evt.data);
    } else if (evt.action === 'CHANGE_STATUS') {
      this.changeStatus(evt.data);
    } else {
      this.editCategoriesRow(evt.data);
    }
  }

  // pagination Object
  pageOptions = {
    paginationSizes: [],
    defaultPageSize: 15,
    length: 10
  };


  // pagination function
  pageEvent(event) {
    this.currentPage = event;
    this.getDataCategories();
  }

  // ===========================
  openJournalEntriesDialog(): void {
    const dialogRef = this.matDialog
      .open(JournalEntriesComponent, {
        width: '1200px',
        panelClass: 'custom-dialog-container',
        data: {}
      });
    this.subscription.add(
      dialogRef.afterClosed().subscribe(result => {
        if (result) {
        }
      }));
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }
}





