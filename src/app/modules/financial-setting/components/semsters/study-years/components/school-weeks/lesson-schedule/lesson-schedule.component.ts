import { Component, OnInit } from '@angular/core';
import { Subscription } from "rxjs";
import { GlobalDropDown,Subject } from "src/app/modules/financial-setting/models/study-years/StudyYears";
import { StudyYearsService } from "src/app/modules/financial-setting/services/studeyYears/studey-years.service";
import { AgActionBtnComponent } from "src/app/shared/components/ag-grid/cell-renderers/ag-action-btn/ag-action-btn.component";
import { AgStatusBtnComponent } from "src/app/shared/components/ag-grid/cell-renderers/ag-status-btn/ag-status-btn.component";
import { cellActionStyle, DeleteActionStyle, TableActions } from "src/app/shared/model/global";

@Component({
  selector: 'app-lesson-schedule',
  templateUrl: './lesson-schedule.component.html',
  styleUrls: ['./lesson-schedule.component.scss']
})
export class LessonScheduleComponent implements OnInit {

  classes:GlobalDropDown[] = [];
  subjects:Subject[] = [];
  tableItems: any;
  currentPage = 1;
  message: string;
  existData = true;
  searchQuery = '';
  errorMassage = true;
  messageBoxError: {};
  subjectTableData: any;
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
    private _studyYears: StudyYearsService,
  ) {
    this.frameworkComponents = {
      agActionBtn: AgActionBtnComponent,
      agStatusBtn: AgStatusBtnComponent,
    };
  }

  ngOnInit(): void {
    this.getClasses();
  }

  getClasses() {
    this._studyYears.getClasses().subscribe(res => {
      this.classes = res.data[0];
    })
  }

  selectClass(e) {
    this._studyYears.getSubjects(e).subscribe(res => {
      console.log(res);
      // this.subjects = res.data[0];
      this.subjects = [
        {
          grade: "الأول الابتدائي",
          id: 305,
          title: "المادة الاسطورية",
          trans_template_subject_id: 303,
        }
      ];
    })
  }

  selectSubject(e) {
    this._studyYears.getStudyWeeksTableBySubject(e).subscribe(res => {
      // this.subjectTableData = res[1];
      this.subjectTableData = {
        season: "2021 - 2022 - الفصل الثاني",
        subject: "المادة الاسطورية",
        weeks: [
          {
            ends_at: "2021-11-24",
            id: 66,
            lectures: [],
            starts_at: "2021-11-24",
            title: "ddd",
          }
        ]
      };
    })
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
          headerName: 'الفصل',
          field: 'semester',
          minWidth: 100,
        },
        {
          headerName: 'بداية الفصل',
          field: 'date_start',
          minWidth: 120
        },
        {
          headerName: 'نهاية الفصل',
          field: 'date_end',
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


  rowActions(evt): void {
    if (evt.action === TableActions.delete) {
      // this.delete(evt.data);
    }
  }


  // pagination function
  pageEvent(event) {
    this.currentPage = event;
    // this.getSemesters();
  }

}
