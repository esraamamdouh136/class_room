import {Component, OnInit, ViewChild} from '@angular/core';
import {FormBuilder, FormGroup} from '@angular/forms';
import {TranslateService} from '@ngx-translate/core';
import {TranslationService} from 'src/app/modules/i18n/translation.service';
import {AgGridComponent} from 'src/app/shared/components/ag-grid/ag-grid.component';
import {AgActionBtnComponent} from 'src/app/shared/components/ag-grid/cell-renderers/ag-action-btn/ag-action-btn.component';
import {AgStatusBtnComponent} from 'src/app/shared/components/ag-grid/cell-renderers/ag-status-btn/ag-status-btn.component';
import {cellActionStyle, TableActions} from 'src/app/shared/model/global';
import {StudentsService} from './services/students/students.service';
import {StudentList} from './models/student';
import {Router} from '@angular/router';
import {Subscription} from 'rxjs';
import {SharedService} from '../../../../shared/services/shared.service';
import { HttpErrorResponse } from "@angular/common/http";

@Component({
  selector: 'app-students',
  templateUrl: './students.component.html',
  styleUrls: ['./students.component.scss']
})
export class StudentsComponent implements OnInit {
  @ViewChild('agGrid') agGrid: AgGridComponent;
  form: FormGroup;
  columnDefs = [];
  rowData: StudentList[] = [];
  subscription: Subscription = new Subscription();
  searchDiv: boolean = false;
  defaultColDef = {
    filter: false,
    editable: false,
    resizable: true,
  };
  agSelectedRow;
  frameworkComponents: any;
  columnDefHeader: object = {};
  messageBoxError = {};
  studentList: StudentList[] = [];
  tableItems = [];
  pageOptions = {
    length: 10,
    paginationSizes: [],
    defaultPageSize: 15
  };
  fetchCriteria = {
    page: 1,
  };
  searchQuery = '';

  // Pagination
  paginationConfig = {
    length: 15,
    start: 1,
    draw: new Date().getTime(),
  };

  // rowActions: any;
  constructor(
    private translate: TranslateService,
    public translation: TranslationService,
    private studentsService: StudentsService,
    private router: Router,
    private sharedService: SharedService,
    private fb: FormBuilder,
  ) {
    this.frameworkComponents = {
      agActionBtn: AgActionBtnComponent,
      agStatusBtn: AgStatusBtnComponent,
    };
  }

  ngOnInit(): void {
    this.initForm();
    this.subscription.add(
      this.sharedService.navChanged$.subscribe(data => {
        if (data) {
          this.getStudents();
        }
      })
    );

  }

  initForm(){
    this.form = this.fb.group({
      name : ['']
    })
  }


  getStudents() {
    this.studentsService.getStudents(this.form.value?.name, this.fetchCriteria.page)
      .subscribe(
        (res) => {
          this.studentList = res?.data;
          this.pageOptions.length = res?.total;
          this.initializeAgGrid();
        }
      ,(error:HttpErrorResponse) => {
        this.messageBoxError = error.error;
        this.studentList = [];
        this.initializeAgGrid();
      });
  }

  search(){
    this.getStudents();
  }

  initializeAgGrid(): void {
    this.rowData = this.studentList || [];
    this.drawAgGrid(); // call drawAgGrid Function
  }


  /**
   * @description A function that draws AG Grid
   */
  drawAgGrid(): void {
    if (!this.columnDefs.length) {
      this.columnDefs = [
        {
          headerCheckboxSelection: true,
          headerCheckboxSelectionFilteredOnly: true,
          checkboxSelection: true,
          width: 80
        },
        {
          headerName: this.translate.instant('general.name'),
          // field: 'first_name',
          valueGetter: (params) => this.getUserFullName(params.data),
          minWidth: 150,
          width: 250
        },
        {
          headerName: this.translate.instant('general.numAcademy'),
          field: 'academic_id',
          minWidth: 150
        },
        {
          headerName: this.translate.instant('general.classRoom'),
          field: 'classroom.name',
          minWidth: 150
        },
        {
          headerName: this.translate.instant('parent_pages.Student_status'),
          field: 'register_status',
          minWidth: 150
        },
        {
          headerName: this.translate.instant('contracts.class'),
          field: 'semster.name',
          minWidth: 150
        },
        {
          headerName: this.translate.instant('contracts.last_activity'),
          field: 'last_active',
          minWidth: 150
        },
        {
          headerName: this.translate.instant('parent_pages.type'),
          field: 'gender',
          valueGetter: (params) => {
            if (this.translation.getSelectedLanguage() === 'ar') {
              return params?.data?.gender === 'Male' ? 'ذكر' : 'أنثي';
            } else {
              return params?.data?.gender;
            }
          },
          width: 100
        },
        {
          headerName: this.translate.instant('general.updated_at'),
          field: 'updated_at',
          valueGetter: params => new Date(params.data.updated_at).toLocaleDateString(),
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
              }
            ],
            getAction: this.rowActions.bind(this),
          },
          width: 100
        },

      ];
    }

  }

  // ===========[AG-GRID FUNCTION]==============
  
  getUserFullName(data){
    let name = '';
    if(this.translation.getSelectedLanguage() === 'ar'){
      name = `${data?.name_ar} 
      ${data?.father?.name_ar ? data?.father?.name_ar : ''} 
      ${data?.father?.father_name_ar ? data?.father?.father_name_ar : ''}
      ${data?.father?.grandfather_name_ar ? data?.father?.grandfather_name_ar : ''}
      ${data?.father?.family_name_ar ? data?.father?.family_name_ar : ''}` 
    } else {
      name = `${data?.name_en} 
      ${data?.father?.name_en ? data?.father?.name_en : ''} 
      ${data?.father?.father_name_en ? data?.father?.father_name_en : ''} 
      ${data?.father?.grandfather_name_en ? data?.father?.grandfather_name_en : ''}
      ${data?.father?.family_name_en ? data?.father?.family_name_en : ''}` 
    }
    return  name
  }

  rowActions(evt: any): void {
    console.log(evt);
    
    if (evt.action === TableActions.edit) {
      this.router.navigate(['/financial-operations/students/add_new_student'],
        {queryParams: {edit: true}, state: evt?.data});
    }
  }

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
    this.getStudents();
  }

  toggleSearch() {
    this.searchDiv = !this.searchDiv;
  }

}
