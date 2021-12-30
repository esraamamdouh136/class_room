import { Component, OnInit } from '@angular/core';
import { MatDialog } from "@angular/material/dialog";
import { Subscription } from "rxjs";
import { StudyYearsService } from "src/app/modules/financial-setting/services/studeyYears/studey-years.service";
import { AgActionBtnComponent } from "src/app/shared/components/ag-grid/cell-renderers/ag-action-btn/ag-action-btn.component";
import { AgStatusBtnComponent } from "src/app/shared/components/ag-grid/cell-renderers/ag-status-btn/ag-status-btn.component";
import { ConfirmDialogComponent } from "src/app/shared/components/confirm-dialog/confirm-dialog.component";
import { cellActionStyle, DeleteActionStyle, MoreActionStyle, TableActions } from "src/app/shared/model/global";
import { AddEditSchoolWeekComponent } from "./add-edit-school-week/add-edit-school-week.component";
import { SetLessonComponent } from "./set-lesson/set-lesson.component";

@Component({
  selector: 'app-school-weeks',
  templateUrl: './school-weeks.component.html',
  styleUrls: ['./school-weeks.component.scss']
})
export class SchoolWeeksComponent implements OnInit {


  tableItems: any;
  currentPage = 1;
  message: string;
  existData = true;
  searchQuery = '';
  errorMassage = true;
  messageBoxError = {
    message : "No data found",
    code : 5000,
  };
  subscription: Subscription = new Subscription();

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

  studyYear = [
    {
      name: "2021-2022",
      selected: true,
    },
    {
      name: "2022-2023",
      selected: false,
    }
  ]


  constructor(
    private _MatDialog: MatDialog,
    private _studyYears: StudyYearsService,
  ) {
    this.frameworkComponents = {
      agActionBtn: AgActionBtnComponent,
      agStatusBtn: AgStatusBtnComponent,
    };
  }

  ngOnInit(): void {
    this.getStudyWeeks();
  }

  getStudyWeeks() {
    
    this.subscription.add(
      this._studyYears.getStudyWeeks(this.searchQuery).subscribe(res => {
        this.tableItems = res?.data?.data;
      }, error => {
  
      })
    )

    this.initializeAgGrid()
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
          headerName: 'العنوان',
          field: 'title',
          minWidth: 100,
        },
        {
          headerName: 'الفصل الدراسي',
          field: 'season',
          minWidth: 100,
        },
        {
          headerName: ' يبدا من',
          field: 'starts_at',
          minWidth: 120
        },
        {
          headerName: 'ينتهي في',
          field: 'ends_at',
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
                action: 'more',
                moreActions : [
                  {
                    title : 'تعيين درس',
                    action : 'more'
                  }
              ],
                style: MoreActionStyle
              },
            ],
            getAction: this.rowActions.bind(this),
          },
          minWidth: 200
        }
      ];
    }
  }


  /**
   * When user search get data with keyword
   */
  onSearchChange(word) {
    this.tableItems = [];
    this.searchQuery = word;
    this.getStudyWeeks();
  }


  rowActions(evt): void {
    if (evt.action === TableActions.delete) {
      this.onDelete(evt.data);
    }

    if (evt.action === TableActions.edit) {
      this.openAddEditScoolWeek(evt.data);
    }

    if (evt.action === TableActions.more) {
      this.openAddLessonModel(evt.data);
    }
  }

  /**
 * If user click to delete school week
 * @param row 
 */
  onDelete(row) {
    const dialogRef = this._MatDialog.open(ConfirmDialogComponent, {
      width: '500px',
      data: {
        message: 'common.deleteMessage',
        updateStatus: true, // To allow handel delete request here 
      }
    });
    this.subscription.add(
      dialogRef.afterClosed().subscribe(result => {
        if (result) {
          const body = {
            id: row?.id
          }
          this.subscription.add(
            this._studyYears.deleteStudyWeek(body).subscribe(res => {
              this.getStudyWeeks();
            },error => {
              console.log(error);
            })
          )
        }
      })
    )
  }


  openAddEditScoolWeek(row?) {
    const dialogRef = this._MatDialog.open(AddEditSchoolWeekComponent, {
      width: '650px',
      panelClass: 'custom-dialog-container',
      data: {
        data: row
      }
    });

    this.subscription.add(
      dialogRef.afterClosed().subscribe(result => {
        if (result) {
          this.getStudyWeeks();
        }
      })
    )

  }

  openAddLessonModel(data) {
    const dialogRef = this._MatDialog.open(SetLessonComponent, {
      width: '650px',
      panelClass: 'custom-dialog-container',
      data: {
        data: data
      }
    });

    this.subscription.add(
      dialogRef.afterClosed().subscribe(result => {
        if (result) {
        }
      })
    )

  }


  // pagination function
  pageEvent(event) {
    this.currentPage = event;
    // this.getSemesters();
  }

}
