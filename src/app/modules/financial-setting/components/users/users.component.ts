import {Overlay} from '@angular/cdk/overlay';
import {MatDialog} from '@angular/material/dialog';
import {Component, OnInit, ViewChild} from '@angular/core';

import {ToastrService} from 'ngx-toastr';
import {forkJoin, Subscription} from 'rxjs';

import {User} from '../../models/user/user';
import {cellActionStyle, Country, DeleteActionStyle, Role, TableActions} from 'src/app/shared/model/global';
import {environment} from 'src/environments/environment';
import {UsersService} from '../../services/users/users.service';
import {SharedService} from 'src/app/shared/services/shared.service';
import {UsersFormComponent} from './add-edit-user/add-edit-user.component';
import {ListsService} from 'src/app/shared/services/list_Service/lists.service';
import {AgGridComponent} from 'src/app/shared/components/ag-grid/ag-grid.component';
import {UpdateUserRoleComponent} from './update-user-role/update-user-role.component';
import {ConfirmDialogComponent} from 'src/app/shared/components/confirm-dialog/confirm-dialog.component';
import {AgActionBtnComponent} from 'src/app/shared/components/ag-grid/cell-renderers/ag-action-btn/ag-action-btn.component';
import {AgStatusBtnComponent} from 'src/app/shared/components/ag-grid/cell-renderers/ag-status-btn/ag-status-btn.component';
import {AgImageFormatterComponent} from 'src/app/shared/components/ag-grid/cell-renderers/ag-imageFormatter/ag-image-formatter.component';

@Component({
  selector: "app-users",
  templateUrl: "./users.component.html",
  styleUrls: ["./users.component.scss"],
})
export class UsersComponent implements OnInit {
  roles: Role[] = [];
  tableItems: User[] = [];
  countries: Country[] = [];
  tableColumns = TABLE_COLUMNS;
  passwordValidationsMessages: any[];
  subscription: Subscription = new Subscription();

  // ===============[AG-RID]=====================
  @ViewChild('agGrid') agGrid: AgGridComponent;

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
  // ===============[AG-RID]=====================


  errors = {};
  searchWord = "";
  message: string;

  update = false;
  existData = true;
  errorMassage = true;


  messageBoxError = {};
  fetchCriteria = {
    page: 1,
  };
  pageOptions = {
    length: null,
    paginationSizes: [],
    defaultPageSize: 15,
  };

  enableEdit: boolean = false;
  dataLoaded: boolean = false;
  errorPhone: boolean = false;
  updateUser: boolean = false;
  addUserLoader: boolean = false;
  changePassword: boolean = false;

  constructor(
    private overlay: Overlay,
    private _users: UsersService,
    private _MatDialog: MatDialog,
    private toaster: ToastrService,
    private _listsService: ListsService,
    private _shredService: SharedService,
  ) {
    this.frameworkComponents = {
      agActionBtn: AgActionBtnComponent,
      agStatusBtn: AgStatusBtnComponent,
      AgImageFormatter: AgImageFormatterComponent,
    };
  }

  ngOnInit(): void {
    this.subscription.add(this._shredService.navChanged$.subscribe((data) => {
     if(data) {
       this.getUsersData();
     }
    }))
  }


  // ===========[AG-GRID FUNCTION]==============
  /**
 * @description A function that initializes AG Grid
 */
  initializeAgGrid(data: any): void {
    this.rowData = data || [];
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
          headerName: 'general.image',
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
          headerName: 'setting.usersPage.username',
          field: 'name',
          minWidth: 150
        },
        {
          headerName: 'setting.usersPage.email',
          field: 'email',
          minWidth: 150
        },
        {
          headerName: 'general.status',
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
              {
                action: 'lock',
                style: cellActionStyle
              },
            ],
            getAction: this.rowActions.bind(this),
          },
          minWidth: 200
        }
      ];
    }
  }

  // ===========[AG-GRID FUNCTION]==============

  getUsersData() {
    // Check selected role to fix error when reload page
    this.subscription.add(
      this._shredService.navData$.subscribe((res) => {
        if (res) {
          this.getUsers("");
          this.getFromDropData();
        }
      })
    );
  }

  getFromDropData() {
    let countries = this._listsService.countries();
    let roles = this._listsService.usersRoles();
    this.subscription.add(
      forkJoin([countries, roles]).subscribe((results) => {
        if (results.every((d) => d.code === 200)) {
          this.countries = results[0].items;
          this.roles = results[1].items;
        }
      })
    )
  }

  /**
   * @param word (To search for)
   */
  getUsers(word) {
    this.subscription.add(
      this._users.getUsers(word, this.fetchCriteria.page).subscribe(
        (res) => {
            this.tableItems = res.data;
            this.pageOptions.length = res.length;
            this.initializeAgGrid(this.tableItems);
            // If the table height is tall than user screen after get data scroll to top of the table
            this._shredService.scrollToTop.next(true);
            this.existData = true;
            // this.errorMassage = true;
        },
        error => {
          this.messageBoxError = error.error
          this.tableItems = [];
          this.initializeAgGrid(this.tableItems);
          this.pageOptions.length = 0;
          if (error.error.code === 4000) {
            this.errorMassage = false;
          }
          else {
            this.errorMassage = true;
            this.existData = false;
          }
        }
      )
    )
  }

  /**
   * Subscribe for search input value change
   * Wait for 1 second until user finish search
   * @param data
   */
  onSearchChange(word) {
    this.searchWord = word;
    this.getUsers(word);
  }

  /**
   * row tabel actions
   * @param event
   */
  rowActions(event) {
    if (event.action == TableActions.delete) {
      this.onDelete(event.data);
    } else if (event.action == TableActions.changeStatus) {
      this.changeStatus(event.data);
    } else if (event.action == TableActions.edit) {
      this.oppenDialog(event.data);
    } else {
      this.updateUserRole(event.data);
    }
  }

  /**
   * pagination events _____________________
   * @param event
   */
  pageEvent(event) {
    if (typeof event == "object") {
      this.fetchCriteria.page = event.pageIndex + 1;
    } else {
      this.fetchCriteria.page = event;
    }
    this.getUsers(this.searchWord);
  }

  /**
   *
   * @param row
   */

  changeStatus(data) {
    const dialogRef = this._MatDialog.open(ConfirmDialogComponent, {
      width: "500px",
      data: {
        message: "common.changeStatusMessage",
        updateStatus: true,
      },
    });
    this.subscription.add(
      dialogRef.afterClosed().subscribe((result) => {
        if (result) {
          this.subscription.add(
            this._users
              .changeStatus(data.id, data.status == 1 ? 2 : 1)
              .subscribe((res) => {
                this.toaster.success(res.message);
                this.getUsers("");
              })
          )
        }
      })
    )
  }

  /**
   * If user click to delete user show confirm dialog
   * If click yes delete user then update data
   * @param row (All row data (user data))
   */
  onDelete(row) {
    const dialogRef = this._MatDialog.open(ConfirmDialogComponent, {
      width: "500px",
      data: {
        message: "common.deleteMessage",
        updateStatus: false,
        url: `users/admin-management/${row.id}/delete`,
        domainUrl: `${environment.auth_apiUrl}`,
      },
    });

    this.subscription.add(
      dialogRef.afterClosed().subscribe((result) => {
        if (result) {
          this.getUsers("");
        }
      })
    )
  }

  /**
   * When add new user open dialog after add the user successfully get all suers
   * If user click to edit user show user form
   * And patch values to it
   * @param {object} row (All row data (user data))

   */
  oppenDialog(row?: object) {
    const dialogRef = this._MatDialog.open(UsersFormComponent, {
      width: "650px",
      scrollStrategy: this.overlay.scrollStrategies.reposition(),
      panelClass: "custom-dialog-container",
      data: { roles: this.roles, countries: this.countries, user: row },
    });

    this.subscription.add(
      dialogRef.afterClosed().subscribe((result) => {
        if (result) {
          this.getUsers("");
        }
      })
    )
  }

  /**
   * Assign role to a user
   */
  updateUserRole(row) {
    const dialogRef = this._MatDialog.open(UpdateUserRoleComponent, {
      width: "650px",
      scrollStrategy: this.overlay.scrollStrategies.reposition(),
      panelClass: "custom-dialog-container",
      data: { user: row },
    });
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }
}

export const TABLE_COLUMNS = [
  {
    name: "general.image",
    dataKey: "image_path",
    isSortable: false,
  },
  {
    name: "setting.usersPage.username",
    dataKey: "name",
    isSortable: false,
  },
  {
    name: "setting.usersPage.email",
    dataKey: "email",
    isSortable: false,
  },
  {
    name: "general.status",
    dataKey: "statusView",
    isSortable: false,
  },
]
