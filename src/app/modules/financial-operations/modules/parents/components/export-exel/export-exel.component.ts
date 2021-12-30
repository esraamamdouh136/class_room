import { Clipboard } from "@angular/cdk/clipboard";
import { Component, OnInit, ViewChild } from '@angular/core';
import { TranslateService } from "@ngx-translate/core";
import { ToastrService } from "ngx-toastr";
import { AgGridComponent } from "src/app/shared/components/ag-grid/ag-grid.component";

@Component({
  selector: 'app-export-exel',
  templateUrl: './export-exel.component.html',
  styleUrls: ['./export-exel.component.scss']
})
export class ExportExelComponent implements OnInit {
  semasters = [
    "الأول الابتدائي",
    "الثاني الابتدائي",
    "الثالث الابتدائي",
    "الرابع الابتدائي",
    "الخامس الابتدائي",
    "السادس الابتدائي",
  ]
  currentLang = '';
    // ===============[AG-RID]=====================
    @ViewChild('agGrid') agGrid: AgGridComponent;

    columnDefs = [];
    rowData: any[] = [];
    messageBoxError : {};
  
    defaultColDef = {
      filter: false,
      editable: false,
      resizable: true,
    };
    agSelectedRow;
    columnDefHeader: object = {};
    // ===============[AG-RID]=====================

  constructor(
    private clipboard: Clipboard,
    private toaster:ToastrService,
    public translate:TranslateService
  ) { }

  ngOnInit(): void {
    this.getDate();
    this.currentLang = this.translate.currentLang;
  }

  getDate(){
    this.rowData = [
      {
        identityNum : 1,
        firstName : 'Gad',
        lastName : "Mohamed",
        fatherName: 'fatherName',
        userName : "Gad1995",
        password : "123",
        phone : "01993837837",
        email : "Gad@gmail.com",
        birthdate : "19/9/664",
        birthCountry : "Egypt",
        nationality : "Egyption",
      }
    ]
    this.initializeAgGrid(this.rowData);
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
          headerName: 'parent_pages.identityNum',
          field: 'identityNum',
          minWidth: 150
        },
        {
          headerName: 'parent_pages.firstName',
          field: 'firstName',
          minWidth: 150
        },
        {
          headerName: 'parent_pages.lastName',
          field: 'lastName',
          minWidth: 150
        },
        {
          headerName: 'parent_pages.fatherName',
          field: 'fatherName',
          minWidth: 150
        },
        {
          headerName: 'parent_pages.userName',
          field: 'userName',
          minWidth: 150
        },
        {
          headerName: 'parent_pages.password',
          field: 'password',
          minWidth: 150
        },
        {
          headerName: 'parent_pages.phone',
          field: 'phone',
          minWidth: 150
        },
        {
          headerName: 'parent_pages.email',
          field: 'email',
          minWidth: 150
        },
        {
          headerName: 'parent_pages.birthdate',
          field: 'birthdate',
          minWidth: 150
        },
        {
          headerName: 'parent_pages.birthCountry',
          field: 'birthCountry',
          minWidth: 150
        },
        {
          headerName: 'parent_pages.nationality',
          field: 'nationality',
          minWidth: 150
        },
      ];
    }
  }

  // ===========[AG-GRID FUNCTION]==============

  copyContent(val) {
    this.clipboard.copy(val);
    this.toaster.success(this.translate.instant('parent_pages.successCopy'))
  }

}
