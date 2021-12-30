import {Component, OnDestroy, OnInit} from '@angular/core';
import {TransferStudentsService} from '../../../../../services/semesters/transfer-students.service';
import {StudentList} from '../../../../../../financial-operations/modules/students/models/student';
import {TranslateService} from '@ngx-translate/core';
import {TranslationService} from '../../../../../../i18n/translation.service';
import {Subscription} from 'rxjs';
import {TransferStudents} from '../../../../../models/semester/semesters';

export interface FormArray {
  to?: TransferForm;
  from?: TransferForm;
}

export interface IdTitle {
  id?: number;
  title?: number;
}

interface TransferForm {
  class?: number;
  classRoom?: number;
  classRoomList?: any[];
  studentList?: StudentList[];
  selectedStudents?: number[];
  totalStudents?: number;
  studentPagination?: {
    length: number;
    start: number;
    draw: number;
  };
}

// لحد دلوقتي بجيب المدارس والسنوات

@Component({
  selector: 'app-transfare-student-to-study-year',
  templateUrl: './transfare-student-to-study-year.component.html',
  styleUrls: ['./transfare-student-to-study-year.component.scss'],
})
export class TransfareStudentToStudyYearComponent implements OnInit, OnDestroy {

  subscription: Subscription = new Subscription();
  schools: IdTitle[] = [];

  fromYears: IdTitle[] = [];
  toYears: IdTitle[] = [];

  fromSemesters: IdTitle[] = [];
  toSemesters: IdTitle[] = [];

  fromClasses: IdTitle[] = [];
  toClasses: IdTitle[] = [];

  formArray: FormArray[] = [
    {
      from: {
        class: null,
        classRoom: null,
        classRoomList: [],
        studentList: [],
        selectedStudents: [],
        studentPagination: {
          length: 10,
          start: 1,
          draw: new Date().getTime()
        },
        totalStudents: null,
      },
      to: {
        class: null,
        classRoom: null,
        classRoomList: [],
      },
    }
  ];
  data: TransferStudents = {};

  pageOptions = {
    length: 10,
    paginationSizes: [],
    defaultPageSize: 10
  };

  from = {
    school: null,
    year: null,
    semester: null,
  };
  to = {
    school: null,
    year: null,
    semester: null,
  };

  // students table
  defaultColDef = {
    filter: false,
    editable: false,
    resizable: true,
    flex: 1,
  };
  rowData: StudentList[] = [];
  columnDefs = [];
  // Pagination
  paginationConfig = {
    length: 10,
    start: 1,
    draw: new Date().getTime(),
  };

  constructor(private transferStudentsService: TransferStudentsService,
              private translation: TranslationService,
              private translate: TranslateService) {
  }

  ngOnInit(): void {
    this.getAllData();
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  getAllData(): void {
    this.getSchools();
  }

  getSchools(): void {
    this.subscription.add(
      this.transferStudentsService.getSchools()
        .subscribe(res => {
          this.schools = res;
          console.log(res, 'schools');
        }));
  }

  getYears(condition: 'from' | 'to', schoolId: number): void {
    switch (condition) {
      case 'to': {
        this.subscription.add(this.transferStudentsService.getYears(schoolId)
          .subscribe(res => {
            this.toYears = res;
            console.log(res);
          }));
        break;
      }
      case 'from': {
        this.subscription.add(this.transferStudentsService.getYears(schoolId)
          .subscribe(res => {
            this.fromYears = res;
            console.log(res);
          }));
        break;
      }
    }
  }

  getClasses(condition: 'from' | 'to', schoolId): void {
    switch (condition) {
      case 'to': {
        this.subscription.add(this.transferStudentsService.getClass(schoolId)
          .subscribe(res => {
            this.toClasses = res;
          }));
        break;
      }
      case 'from': {
        this.subscription.add(this.transferStudentsService.getClass(schoolId)
          .subscribe(res => {
            this.fromClasses = res;
          }));
        break;
      }
    }
  }

  getSemesters(condition: 'from' | 'to', yearId): void {
    switch (condition) {
      case 'from': {
        this.subscription.add(this.transferStudentsService.getSemesters(yearId)
          .subscribe(res => {
            console.log(res);
            this.fromSemesters = res;
          }));
        break;
      }
      case 'to': {
        this.subscription.add(this.transferStudentsService.getSemesters(yearId)
          .subscribe(res => {
            this.toSemesters = res;
            console.log(res);
          }));
        break;
      }
    }
  }

  getClassRooms(condition: 'from' | 'to', classId: number, index: number): void {
    this.subscription.add(this.transferStudentsService
      .getClassRooms(
        classId, condition === 'from' ? this.from.semester : this.to.semester,
        condition === 'from' ? this.from.school : this.to.school
      )
      .subscribe(res => {
        this.formArray[index][condition].classRoomList = res;
      }));

  }

  compareWith(item, selected) {
    return item.id === selected.id;
  }

  schoolChanged(condition: 'from' | 'to', event): void {
    if (event?.id) {
      this.getYears(condition, event?.id);
      this.getClasses(condition, event?.id);
    } else {
      this.resetAll(condition);
    }
  }

  yearChanged(condition: 'from' | 'to', event): void {
    if (event?.id) {
      this.getSemesters(condition, event.id);
    } else {
      this.resetAll(condition);
    }
  }

  classesChanged(condition: 'from' | 'to', event, index): void {
    if (event?.id) {
      this.getClassRooms(condition, event.id, index);
    } else {
      this.formArray[index][condition].classRoom = null;
      this.formArray[index][condition].classRoomList = [];
      this.formArray[index][condition].studentList = [];
    }
  }

  classRoomChanged(condition: 'from' | 'to', index, event): void {
    if (event?.id) {
      this.getStudents(condition, index);
      console.log(this.formArray, 'form array');
    } else {
      this.formArray[index][condition].studentList = [];
    }
  }

  resetAll(condition: 'from' | 'to'): void {
    this[condition].year = null;
    this[condition].semester = null;
    if (condition === 'from') {
      this.fromYears = [];
      this.fromSemesters = [];
      this.fromClasses = [];
      this.formArray.forEach(form => {
        form.from = {
          class: null,
          classRoom: null,
          classRoomList: [],
          studentList: [],
          selectedStudents: [],
          studentPagination: {
            length: 10,
            start: 1,
            draw: new Date().getTime()
          },
          totalStudents: null,
        };
      });
    } else {
      this.toYears = [];
      this.toSemesters = [];
      this.toClasses = [];
      this.formArray.forEach(form => {
        form.to = {
          class: null,
          classRoom: null,
          classRoomList: [],
        };
      });
    }

    this.formArray.forEach(form => {
      form.to.classRoom = null;
      form.to.classRoomList = null;
      form.to.class = null;
    });
  }

  initializeAgGrid(): void {
    this.columnDefs = [
      {
        headerCheckboxSelection: true,
        headerCheckboxSelectionFilteredOnly: true,
        checkboxSelection: true,
        width: 80,
        field: 'selected',
        headerName: ''
      },
      {
        headerName: this.translate?.instant('general.identity_number'),
        field: 'identity_number',
        minWidth: 150
      },
      {
        headerName: this.translate?.instant('general.name'),
        valueGetter: (params) => params?.data?.first_name.concat(' ', params?.data?.father_name, ' ', params?.data?.last_name),
        minWidth: 150,
        width: 250
      },
      {
        headerName: this.translate?.instant('general.classRoom'),
        field: 'class',
        minWidth: 150
      }
    ];
  }

  getSelectedRows(evt, index): void {
    this.formArray[index].from.selectedStudents = evt.map(row => row.id);
    console.log(this.formArray[index].from.selectedStudents);
  }

  getStudents(condition: 'from' | 'to', index: number): void {
    switch (condition) {
      case 'from': {
        this.subscription.add(this.transferStudentsService
          .getStudents(
            this.formArray[index].from.studentPagination,
            this.formArray[index][condition].classRoom,
            this.from.school, this.from.semester)
          .subscribe(
            (res) => {
              this.formArray[index][condition].studentList = res.data;
              console.log(this.formArray, 'form array');
              this.formArray[index].from.totalStudents = res?.total;
              console.log(this.formArray, 'form array get students');
              console.log(res?.data?.total, 'total');
              this.initializeAgGrid();
            }
          ));
        break;
      }
    }
  }

  addItem(): void {
    this.formArray.push({
      from: {
        class: null,
        classRoom: null,
        classRoomList: [],
        studentList: [],
        selectedStudents: [],
        studentPagination: {
          length: 10,
          start: 1,
          draw: new Date().getTime()
        },
        totalStudents: null,
      },
      to: {
        class: null,
        classRoom: null,
        classRoomList: [],
      },
    });
  }

  remove(index) {
    this.formArray.splice(index, 1);
  }

  pageEvent(event, index) {
    if (typeof event === 'object') {
    } else {
      const length = this.formArray[index]?.from?.studentPagination?.length;
      this.formArray[index].from.studentPagination.start = (event * length) - length;
    }
    this.getStudents('from', index);
  }

  transferStudents(): void {
    for (const form of this.formArray) {
      const payload: TransferStudents = {
        students: form?.from?.selectedStudents,
        from_school_id: this.from.school,
        to_school_id: this.to.school,
        class: form.to.class,
      };
      this.subscription.add(this.transferStudentsService.transferStudents(payload)
        .subscribe(res => {
          console.log(res);
        }));
    }
  }

}
