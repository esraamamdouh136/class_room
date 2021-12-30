import {Component, OnDestroy, OnInit} from '@angular/core';
import {MatDialog} from '@angular/material/dialog';

import {Subscription} from 'rxjs';
import {ToastrService} from 'ngx-toastr';
import {environment} from 'src/environments/environment';

import {cellActionStyle, DeleteActionStyle, TableActions} from 'src/app/shared/model/global';
import {classrooms} from '../../models/classRooms/classrooms';
import {SharedService} from 'src/app/shared/services/shared.service';
import {ClassroomsService} from '../../services/classrooms/classrooms.service';
import {FormClassroomsComponent} from './form-classrooms/form-classrooms.component';
import {ConfirmDialogComponent} from 'src/app/shared/components/confirm-dialog/confirm-dialog.component';
import {TranslateService} from '@ngx-translate/core';
import {AgActionBtnComponent} from 'src/app/shared/components/ag-grid/cell-renderers/ag-action-btn/ag-action-btn.component';
import {AgStatusBtnComponent} from 'src/app/shared/components/ag-grid/cell-renderers/ag-status-btn/ag-status-btn.component';
import {TranslationService} from 'src/app/modules/i18n/translation.service';
import * as moment from 'moment';

@Component({
  selector: 'app-classrooms',
  templateUrl: './classrooms.component.html',
  styleUrls: ['./classrooms.component.scss']
})
export class ClassroomsComponent implements OnInit, OnDestroy {
  message: string;
  querySearch: string = '';


  currentPage: number = 1;
  subscription: Subscription = new Subscription();


  update = false;
  existData = true;
  errorMassage = true;

  messageBoxError: {};
  tableItems: classrooms[];
  columnDefs = [];
  defaultColDef = {
    filter: false,
    editable: false,
    resizable: true,
  };
  frameworkComponents: any;
  tableColumns = TABLE_COLUMNS;
  // pagination Object
  pageOptions = {
    length: 10,
    paginationSizes: [],
    defaultPageSize: 15,
  };

  constructor(
    private matDialog: MatDialog,
    private toaster: ToastrService,
    private _sharedService: SharedService,
    private classRoomService: ClassroomsService,
    private translate: TranslateService,
    public translation: TranslationService,
  ) {
    this.frameworkComponents = {
      agActionBtn: AgActionBtnComponent,
      agStatusBtn: AgStatusBtnComponent,
    };
  }

  ngOnInit(): void {
    this.subscription.add(
      this._sharedService.navChanged$.subscribe(data => {
        if (data) {
          this.getClassRooms();
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
          field: (this.translation.getSelectedLanguage() == 'ar') ? 'name_ar' : 'name_en',

          minWidth: 200,
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
          headerName: this.translate.instant('general.date'),
          field: 'date',
          cellRenderer: (data) => {
            return moment(data.date).format('HH:mm MM/DD/YYYY')
        },
          minWidth: 150,
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

  onSearchChange(e) {
    this.currentPage = 1;
    this.getClassRooms();
  }


  getClassRooms() {
    this.subscription.add(
      this.classRoomService.getClassRooms(this.querySearch, this.currentPage)
        .subscribe((res: any) => {
            this.tableItems = res.data;
            this.initializeAgGrid();
            this.pageOptions.length = res?.total;
            this.existData = true;
            this.errorMassage = true;
          },
          error => {
            this.messageBoxError = error?.error;
            this.tableItems = [];
            this.initializeAgGrid();
            if (error?.error?.code === 4000) {
              this.errorMassage = false;
            } else {
              this.errorMassage = true;
              this.existData = false;
            }
          }));

  }


  // Dialog For Add And Edit Row
  openAddForm(row?): void {
    const dialogRef = this.matDialog
      .open(FormClassroomsComponent, {
        minWidth: '600px',
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
          this.getClassRooms();
        }
      })
    );
  }

  changeStatus(data) {
    const dialog = this.matDialog.open(ConfirmDialogComponent, {
      minWidth: '350px',
      data: {
        message: 'common.changeStatusMessage',
        updateStatus: true
      }
    });
    this.subscription.add(
      dialog.afterClosed().subscribe(
        (result) => {
          if ((result)) {
            this.subscription.add(
              this.classRoomService
                .changeStatus(data.id, {status: data?.status === 1 ? 2 : 1})
                .subscribe(
                  (res: any) => {
                    this.toaster.success(res?.message);
                    this.getClassRooms();
                  }
                )
            );
          }
        }
      )
    );
  }

  delete(data) {
    const dialog = this.matDialog.open(ConfirmDialogComponent, {
      minWidth: '350px',
      data: {
        message: 'common.deleteMessage',
        updateStatus: false,
        url: `users/classrooms/${data.id}/delete`,
        domainUrl: `${environment.accountant_apiUrl}`
      }
    });
    this.subscription.add(
      dialog.afterClosed().subscribe(res => {
        if (res) {
          this.getClassRooms();
        }
      }));
  }


  rowActions(data): void {
    if (data.action === TableActions.delete) {
      this.delete(data?.data);
    } else if (data?.action === TableActions.changeStatus) {
      this.changeStatus(data?.data);
    } else {
      this.update = true;
      const FormData = {
        ...data.data,
        status: data?.data?.status === 1
      };
      this.openAddForm(FormData);
    }
  }

  // pagination function
  pageEvent(event) {
    this.currentPage = event;
    this.getClassRooms();
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
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
    name: 'general.updated_at',
    dataKey: 'date',
    isSortable: false
  },
];
