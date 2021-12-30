import { Component, OnInit } from '@angular/core';
import { MatDialog } from "@angular/material/dialog";

import { Subscription } from "rxjs";

import { environment } from "src/environments/environment";
import { Currency } from "../../models/currencies/currency";
import { SharedService } from "src/app/shared/services/shared.service";
import { CurrenciesService } from "../../services/currencies/currencies.service";
import { AddEditCurrencyComponent } from "./add-edit-currency/add-edit-currency.component";
import { ConfirmDialogComponent } from "src/app/shared/components/confirm-dialog/confirm-dialog.component";
import { cellActionStyle, DeleteActionStyle, TableActions } from "src/app/shared/model/global";
import { AgActionBtnComponent } from 'src/app/shared/components/ag-grid/cell-renderers/ag-action-btn/ag-action-btn.component';
import { AgStatusBtnComponent } from 'src/app/shared/components/ag-grid/cell-renderers/ag-status-btn/ag-status-btn.component';
import { AgIsDefaultBtnComponent } from 'src/app/shared/components/ag-grid/cell-renderers/ag-is-default-btn/ag-is-default-btn.component';
import { TranslateService } from '@ngx-translate/core';
import { TranslationService } from 'src/app/modules/i18n/translation.service';

@Component({
  selector: 'app-currencies',
  templateUrl: './currencies.component.html',
  styleUrls: ['./currencies.component.scss']
})
export class CurrenciesComponent implements OnInit {

  columnDefs = [];
  defaultColDef = {
    filter: false,
    editable: false,
    resizable: true,
  };

  tableItems: Currency[] = [];
  tableColumns = [];
  frameworkComponents: any;

  companyId;
  companyNum;
  subscription: Subscription = new Subscription();

  searchWord = '';
  message: string;

  update = false;
  exist_data = true;
  errorMassage = true;

  messageBoxError: {};
  fetchCriteria = {
    page: 1,
  };

  pageOptions = {
    paginationSizes: [],
    defaultPageSize: 15,
    length: 10
  }

  constructor
    (
    private currencies: CurrenciesService,
    private _MatDialog: MatDialog,
    private _shredService: SharedService,
    private translate : TranslateService,
    public translation: TranslationService,

    ) 
  {
    this.frameworkComponents = {
      agActionBtn: AgActionBtnComponent,
      agStatusBtn: AgStatusBtnComponent,
      agIsDefualt : AgIsDefaultBtnComponent
    };
   }

  ngOnInit(): void {
    this.getData();

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
          headerName: this.translate.instant('setting.currencies.sequence'),
          field: 'sequence',
          minWidth: 110,
        },
        {
          headerName: this.translate.instant('setting.currencies.currencyname'),
         field: (this.translation.getSelectedLanguage()== 'ar') ? 'name_ar' : 'name_en',

          minWidth: 100
        },
        {
          headerName: this.translate.instant('setting.currencies.currencysymbol'),
          field: 'currency_symbol_ar',
          minWidth: 100
        },
        {
          headerName: this.translate.instant('setting.currencies.Default'),
          cellRenderer: 'agIsDefualt',
          cellRendererParams: {
            getAction: this.rowActions.bind(this),
          },
          minWidth: 100
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

  getData() {
    this.subscription.add(
      this._shredService.navChanged$.subscribe(val => {
        if (val) {
          this.companyId = val?.companyId;
          this.companyNum = val?.companyNum;
          this.getCurrencies();
        }
      })
    );
  }

  // initialize Columns in vacations requests table



  /**
* When user search get data with keyword
*/
  onSearchChange() {
    this.tableItems = [];
    this.getCurrencies();
  }

  /**
 * Get all currencies
 */
  getCurrencies() {
    this.subscription.add(
      this.currencies.getCurrencies({ keyword: this.searchWord, companyId: this.companyId, companyNumber: this.companyNum, page: this.fetchCriteria.page })
        .subscribe(res => {
          this.tableItems = res?.data;
          this.initializeAgGrid()
          this.pageOptions.length = res.total;
          this.exist_data = true;
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
              this.exist_data = false;
            }
          }
        )
    )
  }


  /**
 * Start all table action _______________________________________________
 */
  openAddEditCurrencyForm(row?) {
    const dialogRef = this._MatDialog.open(AddEditCurrencyComponent, {
      width: "650px",
      panelClass: "custom-dialog-container",
      data: {
        update: this.update,
        data: row
      }
    });

    this.subscription.add(
      dialogRef.afterClosed().subscribe(result => {
        this.update = false;
        if (result) {
          this.getCurrencies();
        }
      })
    )
  }

  /**
* row tabel actions
* @param data
*/
  rowActions(data) {
    if (data.action == TableActions.edit) {
      this.update = true;
      const FormData = {
        ...data.data,
        status: data.data.status == 1 ? true : false,
      }
      this.openAddEditCurrencyForm(FormData)
    } else if (data.action == TableActions.delete) {
      this.onDelete(data.data);
    } else if (data.action == TableActions.changeStatus) {
      this.onChangeStatus(data.data)
    } else {
      this.changeIsDefault(data.data)
    }
  }

  /**
* Change year status
* @param row (Fiscal year data)
*/
  onChangeStatus(row) {
    const dialogRef = this._MatDialog.open(ConfirmDialogComponent, {
      width: "500px",
      data: {
        message: 'common.changeStatusMessage',
        updateStatus: true,
      }
    });

    this.subscription.add(
      dialogRef.afterClosed().subscribe(result => {
        if (result) {
          this.currencies.changeStatus(row.id, row.status == 1 ? 2 : 1).subscribe(res => {
            this.getCurrencies();
          })
        }
      })
    )
  }

  /**
 * If user click to delete Area show confirm dialog
 * @param row (All row data (area data))
 */
  onDelete(row) {
    const dialogRef = this._MatDialog.open(ConfirmDialogComponent, {
      width: "500px",
      data: {
        message: 'common.deleteMessage',
        updateStatus: false,
        url: `users/currencies/${row.id}/delete`,
        domainUrl: `${environment.accountant_apiUrl}`
      }
    });

    this.subscription.add(
      dialogRef.afterClosed().subscribe(result => {
        if (result) {
          this.getCurrencies();
        }
      })
    )
  }

  changeIsDefault(row) {
    // Change isDefault value until request complete
    this.tableItems.map(el => {
      el.isDefault = el.isDefault ? false : el.isDefault
    })

    this.subscription.add(
      this.currencies.changeIsDefault(row.id).subscribe(res => {
        this.getCurrencies();
      }, error => {
        this.getCurrencies();
      })
    )
  }

  /**
   * End all table action _______________________________________________
   */

  /**
   * pagination events _____________________
   * @param event
   */
  pageEvent(event) {
    if (typeof event == "object") {
      this.fetchCriteria.page = event.pageIndex + 1;
    } else {
      this.fetchCriteria.page = event
    }
    this.getCurrencies();
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }
}
