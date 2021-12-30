import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from "@angular/router";
import { Subscription } from 'rxjs';
import { AgGridComponent } from 'src/app/shared/components/ag-grid/ag-grid.component';
import { environment } from "src/environments/environment";
import { SheetsService } from "../../services/sheets.service";


@Component({
  selector: 'app-sheet-content',
  templateUrl: './sheet-content.component.html',
  styleUrls: ['./sheet-content.component.scss']
})
export class SheetContentComponent implements OnInit, OnDestroy {

  @ViewChild('agGrid') agGrid: AgGridComponent;


  sheetId;
  chanelId;
  from = '0';
  to = '1000'
  changeFromData = false;

  // Begin AG Grid Variables //
  columnDefs = [];
  columnDefHeader: object = {};
  rowData: any[] = [];
  frameworkComponents: any;
  defaultColDef = {
    resizable: true,
    editable: false,
  };
  agSelectedRow;
  // End AG Grid Variables //

  subscription: Subscription = new Subscription();


  constructor(
    private sheets: SheetsService,
    private activeRoute: ActivatedRoute,
  ) {

    // Get params from the route
    this.sheetId = this.activeRoute.snapshot.queryParams?.sheetId;
    this.chanelId = this.activeRoute.snapshot.queryParams?.id;


  }

  ngOnInit(): void {

    this.getData(); // Call getData Function
  }


  /**
   * @description A function that gets all Data
   */
  getData(): void {
    this.getSheetContent(); // Call getSheetContent Function
  }


  /**
   * @description A function that gets AG Sheet Content
   */
  getSheetContent() {

    const data = {
      uri: environment.GoogleDriveRedirectUrl,
      chanelId: this.chanelId,
      from: this.from,
      to: this.to,
      sheetId: this.sheetId
    }

    this.subscription.add(this.sheets.getSheetContent(data).subscribe((res: any) => {
      this.columnDefHeader = this.changeFromData ? this.columnDefHeader : res?.items[0];
      this.initializeAgGrid(res?.items.filter((e, index) => index != 0));
      this.changeFromData = false;
    }))
  }


  /**
   * @description A function that initializes AG Grid
   */
  initializeAgGrid(data: any): void {
    this.drawAgGrid(); // call drawAgGrid Function
    this.rowData = data || [];
  }


  /**
   * @description A function that draws AG Grid
   */
  drawAgGrid(): void {

    this.columnDefs = [
      {
        headerName: '#',
        valueGetter: 'node.rowIndex + 1',
        filter: true,
        width: 80
      },
    ];

    for (const [key, value] of Object.entries(this.columnDefHeader)) {
      let obj = {
        headerName: value,
        field: key,
        width: 110,
      }
      this.columnDefs.push(obj)
    }
  }

  // When change (from and to) to get custom data
  getCustomData() {
    // To check if user change (from and to) values to configure ag-table header
    this.changeFromData = true
    this.getSheetContent();
  }


  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

}
