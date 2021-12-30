import { Component, Input, OnInit, SimpleChanges } from '@angular/core';
import { MatDialog } from "@angular/material/dialog";
import { TranslateService } from "@ngx-translate/core";
import { ToastrService } from "ngx-toastr";
import { Subscription } from "rxjs";
import { TranslationService } from "src/app/modules/i18n/translation.service";
import { AgActionBtnComponent } from "src/app/shared/components/ag-grid/cell-renderers/ag-action-btn/ag-action-btn.component";
import { ConfirmDialogComponent } from "src/app/shared/components/confirm-dialog/confirm-dialog.component";
import { cellActionStyle, DeleteActionStyle } from "src/app/shared/model/global";
import { SharedService } from "src/app/shared/services/shared.service";
import { environment } from "src/environments/environment";
import { ParentsService } from "../../service/parents.service";
import { AddEditFilesComponent } from "./add-edit-files/add-edit-files.component";

@Component({
  selector: 'app-archive-file',
  templateUrl: './archive-file.component.html',
  styleUrls: ['./archive-file.component.scss']
})
export class ArchiveFileComponent implements OnInit {
  tableItems: any[];
  searchInput = '';
  searchWord = '';
  currentPage = 1;
  update = false;
  existData: boolean = true;
  errorMassage: boolean = true;
  messageBoxError = {};

  @Input() dataParents;
  @Input() parent_file_id: number;

  fetchCriteria = {
    page: 1,
  };

  pageOptions = {
    paginationSizes: [],
    defaultPageSize: 15,
    length: 10
  }
  subscription: Subscription = new Subscription();

  // Table
  columnDefs = [];
  defaultColDef = {
    filter: false,
    editable: false,
    resizable: true,
  };
  frameworkComponents: any;

  constructor(
    private parents: ParentsService, 
    private _MatDialog: MatDialog,
    private translate:TranslateService,
    public translation: TranslationService,
    private _shredService: SharedService,
    private toaster: ToastrService,
  ) { 
    this.frameworkComponents = {
      agActionBtn: AgActionBtnComponent,
    };
  }
  ngOnChanges(changes: SimpleChanges): void {
   this.getData();
  }

  ngOnInit(): void {
    this.getData();    
  }

  getData() {
    this.subscription.add(
      this._shredService.navChanged$.subscribe(val => {
        if (val) {
          this.getAttachments();
        }
      }));
  }

  getAttachments() {

    this.parents.getAllAttachments(this.parent_file_id,this.searchWord, this.fetchCriteria.page).subscribe((res: any) => {
      this.tableItems = res?.paginate?.data
      this.pageOptions.length = res?.paginate?.total;
      this.existData = true;
      this.initializeAgGrid()
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
  }

    /**
   * When user search get data with keyword
   */
    onSearchChange(word) {
      this.tableItems = [];
      this.searchWord = word;
      this.getAttachments();
    }

  // Start Table

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
          headerName: 'اسم الملف',
          field: (this.translation.getSelectedLanguage()== 'ar') ? 'title_ar' : 'title_en',
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
                action: 'visibility',
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
  // End Table



  /**
 * row tabel actions
 * @param data
 */
  rowActions(data) {
    if (data.action == 'edit') {
      this.update = true;
      const FormData = {
        ...data.data,
        status: data.data.status == 1 ? true : false,
      };
      this.openAddEditFile(FormData);
    } else if (data.action == 'delete') {
      this.onDelete(data.data);
    } else {
      if(data?.data?.full_path){
        window.open(data?.data?.full_path,'blank')
      } else {
        this.toaster.error('لا يوجد ملف مرفق');
      }
    }
  }

  /**
   * If user click to delete Area show confirm dialog
   * @param row (All row data (area data))
   */
  onDelete(row) {
    const dialogRef = this._MatDialog.open(ConfirmDialogComponent, {
      width: '500px',
      data: {
        message: 'common.deleteMessage',
        updateStatus: false,
        url: `users/parents_files/delete/${this.parent_file_id}/attachments`,
        domainUrl: `${environment.accountant_apiUrl}`,
        data : {key:row.key}
      }
    });
    this.subscription.add(
      dialogRef.afterClosed().subscribe(result => {
        if (result) {
          this.getAttachments();
        }
      })
    )
  }

  openAddEditFile(row?) {
    const dialogRef = this._MatDialog.open(AddEditFilesComponent, {
      width: '650px',
      panelClass: 'custom-dialog-container',
      data: {
        update: this.update,
        data: row,
        parent_file_id : this.parent_file_id
      }
    });

    this.subscription.add(
      dialogRef.afterClosed().subscribe(result => {
        this.update = false;
        if (result) {
          this.getAttachments();
        }
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
    if (typeof event == 'object') {
      this.fetchCriteria.page = event.pageIndex + 1;
    } else {
      this.fetchCriteria.page = event;
    }
    this.getAttachments();
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
}
