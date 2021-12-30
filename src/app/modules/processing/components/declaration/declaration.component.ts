import {Component, OnDestroy, OnInit} from '@angular/core';
import {MatDialog} from '@angular/material/dialog';
import {Router} from '@angular/router';


import {ToastrService} from 'ngx-toastr';
import {Subscription} from 'rxjs';


import {environment} from 'src/environments/environment';
import {ChanelData} from 'src/app/modules/processing/models/chanel';
import {ProcessingService} from '../../services/processing.service';
import {SharedService} from 'src/app/shared/services/shared.service';
import {FormDeclarationComponent} from './form-declaration/form-declaration.component';
import {ConfirmDialogComponent} from 'src/app/shared/components/confirm-dialog/confirm-dialog.component';

@Component({
  selector: 'app-declaration',
  templateUrl: './declaration.component.html',
  styleUrls: ['./declaration.component.scss']
})
export class DeclarationComponent implements OnInit, OnDestroy {
  message: string;
  querySearch: string = '';

  currentPage: number = 1;
  subscription: Subscription = new Subscription();

  update = false;
  exist_data = true;
  errorMassage = true;

  messageBoxError: {};
  tableData: ChanelData[];
  tableColumns = [
    {
      name: 'general.email',
      dataKey: 'email',
      isSortable: false
    },
    {
      name: 'general.channel_name',
      dataKey: 'name',
      isSortable: false
    },
    {
      name: 'general.link_status',
      dataKey: 'isConnected',
      isSortable: false
    },
    {
      name: 'setting.fiscalYearPage.Default',
      dataKey: 'isDefault',
      isSortable: false,
    },

  ];
  // pagination Object
  pageOptions = {
    paginationSizes: [],
    defaultPageSize: 15,
    length: 10
  };

  constructor(
    private processingService: ProcessingService,
    private matDialog: MatDialog,
    private toaster: ToastrService,
    private router: Router,
    private _shredService: SharedService,
  ) {
  }

  ngOnInit(): void {
    this.subscription.add(
      this._shredService.navChanged$.subscribe(val => {
        if (val) {
          this.getChannelsData();
        }
      })
    );
  }


  getChannelsData() {
    this.subscription.add(
      this.processingService
        .getChannelsData(this.querySearch, this.currentPage)
        .subscribe((res: any) => {
            this.tableData = res.data;
            this.pageOptions.length = res.total;
            this.exist_data = true;
            this.errorMassage = true;
          },
          error => {
            this.messageBoxError = error.error;
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
    this.getChannelsData();
  }


  filesManagementFormDrive(row: ChanelData) {
    // Check if email connected before
    if (row.is_connected) {
      this.router.navigate(['/processing/sheets-list'], {queryParams: {id: row.id}});
    } else {
      this.subscription.add(this.processingService
        .getUrlDrive(row.id, {uri: environment.GoogleDriveRedirectUrl})
        .subscribe((res: any) => {
          this.toaster.success(res?.message);
          localStorage.setItem('chanelId', `${row.id}`);
          window.location.replace(res['uri']);
        }));
    }
  }

  // Dialog For Add And Edit Row
  openAddEditChannelForm(row?): void {
    const dialogRef = this.matDialog
      .open(FormDeclarationComponent, {
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
          this.getChannelsData();
        }
      }));
  }

  changeStatus(data) {
    if (data.is_connected === true) {
      const dialog = this.matDialog.open(ConfirmDialogComponent, {
        width: '350px',
        data: {
          message: 'common.declarationMessage',
          updateStatus: true,
          type: 'declarationMessage'
        }
      });
      this.subscription.add(
        dialog.afterClosed().subscribe(
          (result) => {
            if ((result)) {
              this.processingService
                .changeStatus(data.id)
                .subscribe(
                  (res: any) => {
                    this.toaster.success(res?.message);
                    this.getChannelsData();
                  });
            }
          }));
    }
  }

  delete(data) {
    const dialog = this.matDialog.open(ConfirmDialogComponent, {
      width: '350px',
      data: {
        message: 'common.deleteMessage',
        updateStatus: false,
        url: `users/google/channels/${data.id}/delete`,
        domainUrl: `${environment.accountant_apiUrl}`
      }
    });
    this.subscription.add(
      dialog.afterClosed()
        .subscribe(res => {
          if (res) {
            this.getChannelsData();
          }
        }));
  }


  rowActions(data): void {
    if (data.action === 'delete') {
      this.delete(data?.row);
    } else if (data?.action === 'CHANGE_STATUS') {
      this.changeStatus(data?.row);
    } else if (data?.action === 'add') {
      this.filesManagementFormDrive(data?.row);
    } else if (data.action === 'edit') {
      this.update = true;
      const FormData = {
        ...data.row,
        status: data?.row?.status === 1
      };
      this.openAddEditChannelForm(FormData);
    } else {
      this.changeIsDefault(data.row);
    }
  }

  changeIsDefault(row) {
    // Change isDefault value until request complete
    this.tableData.map(el => {
      el.isDefault = el.isDefault ? false : el.isDefault;
    });
    this.subscription.add(
      this.processingService.setIsDefault(row.id)
        .subscribe(res => {
          this.getChannelsData();
        }, error => {
          this.getChannelsData();
        }));
  }


  // pagination function
  pageEvent(event) {
    this.currentPage = event;
    this.getChannelsData();
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
}
