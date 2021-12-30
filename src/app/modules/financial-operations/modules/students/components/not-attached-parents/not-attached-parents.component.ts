import { Component, OnInit, ViewChild } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { TranslationService } from 'src/app/modules/i18n/translation.service';
import { AgGridComponent } from 'src/app/shared/components/ag-grid/ag-grid.component';
import { AgActionBtnComponent } from 'src/app/shared/components/ag-grid/cell-renderers/ag-action-btn/ag-action-btn.component';
import { AgStatusBtnComponent } from 'src/app/shared/components/ag-grid/cell-renderers/ag-status-btn/ag-status-btn.component';
import { TableActions } from 'src/app/shared/model/global';

@Component({
  selector: 'app-not-attached-parents',
  templateUrl: './not-attached-parents.component.html',
  styleUrls: ['./not-attached-parents.component.scss']
})
export class NotAttachedParentsComponent implements OnInit {
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
  messageBoxError = {};
  tableItems = [];
  pageOptions = {
    length: 10,
    paginationSizes: [],
    defaultPageSize: 15
  };
  fetchCriteria = {
    page: 1,
  };
  // rowActions: any;
  constructor(
    private translate : TranslateService,
    public translation: TranslationService,
  ) {
    this.frameworkComponents = {
      agActionBtn: AgActionBtnComponent,
      agStatusBtn: AgStatusBtnComponent,
    };
   }

  ngOnInit(): void {
    this.getStudents();
  }


  getStudents(){
    const data =  [
      {
        name_ar : 'Yasser',
         numAcademy: 1,
        class : 'الاول',
        classٌRoom : 'رسوم دراسيه - خدمه',
        type : 'الفصل الاول',
        updated_at : '5000',
      },
      {
        name_ar : 'Gad',
        numAcademy : 2,
        class : 'الاول',
        classٌRoom : 'رسوم دراسيه - خدمه',
        type : 'الفصل الاول',
        updated_at : '5000',
      },
      {
        name_ar : 'zayed',
        numAcademy : 2,
        class : 'الاول',
        classٌRoom : 'رسوم دراسيه - خدمه',
        type : 'الفصل الاول',
        updated_at : '5000',
      }
    ]
    this.tableItems = data;
    this.initializeAgGrid(data);
  }

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
          headerName: this.translate.instant('general.name_student'),
          field: (this.translation.getSelectedLanguage()== 'ar') ? 'name_ar' : 'name_en',
          minWidth: 110,
        },
        {
          headerName: this.translate.instant('general.numOfParents'),
          field: 'studentCount',
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
      ];
    }
  }

  // ===========[AG-GRID FUNCTION]==============

  oppenDialog(){

  }

  rowActions(evt: any): void {
    if (evt.action === TableActions.show) {
      // this.add(evt.data);
    } else if (evt.action === TableActions.changeStatus) {
      // this.changeStatus(evt.data);
    } else {
      // this.editRow(evt.data);
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
  }



}
