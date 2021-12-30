import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Subscription } from "rxjs";
import { StudyYearsService } from "../../../services/studeyYears/studey-years.service";
import { SharedService } from 'src/app/shared/services/shared.service';
import { SchoolData,Seasons,Year } from "../../../models/study-years/StudyYears";
import { AgSetPresentBtnComponent } from "src/app/shared/components/ag-grid/cell-renderers/ag-set-present-btn/ag-set-present-btn.component";
import { Router } from "@angular/router";
import { HttpErrorResponse } from '@angular/common/http';
import { MessagesService } from "src/app/shared/services/messages/messages.service";

@Component({
  selector: 'app-studey-years',
  templateUrl: './studey-years.component.html',
  styleUrls: ['./studey-years.component.scss']
})
export class StudeyYearsComponent implements OnInit {
  currentPage = 1;
  tableItems: any;
  message: string;
  searchQuery = '';
  messageBoxError: {};

  Years:Year[];
  selectedYear : Year;
  schoolData : SchoolData;


  existData = true;
  errorMassage = true;
  errorData;
  
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



  constructor(
    private _studyYears:StudyYearsService,
    private _sharedService:SharedService,
    private router:Router,
    private _messages:MessagesService,
  ) {
    this.frameworkComponents = {
      agSetPresent: AgSetPresentBtnComponent,
    };
  }

  ngOnInit(): void {
    this.subscription.add(
      this._sharedService.navChanged$.subscribe(data => {
        if(data){
          this.getData();
        }
      })
    )
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe()
  }

  getData(){
    this._studyYears.getStudyYears().subscribe((res:any) => {
      // console.log(res);
      this.schoolData = res?.data;
      this.Years = this.schoolData.years;
      this.Years[0].selected = true;
      // this.selectedYear = this.Years[0];
      this.getYearDetails(this.Years[0]?.id);
      this.tableItems = this.selectedYear?.seasons;
      
    },(error:HttpErrorResponse) =>  {
      this.tableItems = [];
      this.selectedYear = undefined;
      this.messageBoxError = error.error;
      if(error.status == 400 && error.error.code == 4000 ){
      }
    })
    this.initializeAgGrid()
  }

  /**
   * Get years details
   * @param id 
   */
  getYearDetails(id){
    this._studyYears.getStudyYearDetails(id).subscribe(res => {
      this.selectedYear = res.data;
      this.tableItems = this.selectedYear?.seasons;
    })
  }

  /**
   * When user change selected year change data
   * @param {Year} year 
   */
  changeSelectedYear(year:Year){
    if(!year.selected){
      this.getYearDetails(year.id);
      year.selected = true;
      this.Years = this.Years.map(element => {
        if(element.id != year.id){
          element.selected = false;
        }
        return element
      })
    }
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
          field: 'title',
          minWidth: 100,
        },
        {
          headerName: 'بداية الفصل',
          field: 'starts_at',
          minWidth: 120
        },
        {
          headerName: 'نهاية الفصل',
          field: 'ends_at',
          minWidth: 150
        },
        {
          headerName: 'الإجراءات',
          cellRenderer: 'agSetPresent',
          cellClass: 'action-cell',
          cellRendererParams: {
            getAction: this.rowActions.bind(this),
          },
          minWidth: 200
        }
      ];
    }
  }


  rowActions(evt): void {
    if (evt.data?.is_current == 'no') {
      this._studyYears.setAsCurrent(this.selectedYear.id,evt.data.id).subscribe(res => {
        this.getData();        
      })
    }
  }

  deleteStudyYear(){
    this._studyYears.deleteStudyYears(this.selectedYear.id).subscribe(res => {
      if(res.code == 115){
        Object.keys(res.errors).forEach(e => {
          this._messages.showErrorMessage(res.errors[e])
        })
      } else {
        this.getData();
      }
    })
  }

  editStudyYear(){
    this.router.navigate(['settings/general-ledger/semsters/add-year'],{queryParams:{id:this.selectedYear.id}} )
  }


  // pagination function
  pageEvent(event) {
    this.currentPage = event;
    // this.getSemesters();
  }


}
