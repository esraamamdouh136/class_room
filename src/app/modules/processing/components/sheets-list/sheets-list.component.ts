import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from "@angular/router";
import { ToastrService } from "ngx-toastr";
import { sheet } from "src/app/modules/processing/models/sheet";
import { SheetsList } from "src/app/modules/processing/models/sheetsList";
import { environment } from "src/environments/environment";
import { SheetsService } from "../../services/sheets.service";

@Component({
  selector: 'app-sheets-list',
  templateUrl: './sheets-list.component.html',
  styleUrls: ['./sheets-list.component.scss']
})
export class SheetsListComponent implements OnInit {

  constructor(private sheets: SheetsService, private activeRoute: ActivatedRoute, private router: Router, private toaster: ToastrService,
  ) { }
  tableItems: sheet[] = [];
  allSheetsList: any = [];
  tokensList = [''];
  chanelId;
  message: string;
  next_token = '';


  // pagination Object
  pageOptions = {
    paginationSizes: [],
    defaultPageSize: 20,
    length: 10
  };

  tableColumns = [
    {
      name: 'prossing.sheetName',
      dataKey: 'sheetName',
      isSortable: false
    },
    {
      name: 'prossing.sheetType',
      dataKey: 'type',
      isSortable: false
    },
  ];

  ngOnInit(): void {
    this.chanelId = this.activeRoute.snapshot.queryParams?.id ? this.activeRoute.snapshot.queryParams?.id : 6;
    this.getSheets();
  }

  getSheets() {
    this.sheets.getSheets(this.chanelId, environment.GoogleDriveRedirectUrl, this.next_token).subscribe((res: SheetsList) => {
      this.tableItems = this.dataMapping(res?.files);
      this.allSheetsList = this.removeDuplicatedObjects([...this.allSheetsList, ...res?.files]);
      // Store next_token from google in an array to control pagination 
      if (res?.next_token) {
        this.tokensList.push(res?.next_token);
        this.pageOptions.length = this.allSheetsList.length + 1;
        this.next_token = res?.next_token;
      }
      this.toaster.success(res?.message);
    }, error => {
      this.message = error?.error?.message
      this.tableItems = []
      this.pageOptions.length = 0;
    })
  }

  removeDuplicatedObjects(arr) {
    const ids = arr.map(o => o.id);
    return arr.filter(({ id }, index) => !ids.includes(id, index + 1));
  }

  rowActions(evt: any): void {
    if (evt.action === 'add') {
      this.router.navigate(['processing/sheet-content'], { queryParams: { sheetId: evt?.row?.id, id: this.chanelId } })
    }
  }

  dataMapping(res: sheet[]) {
    return res.map((res) => {
      return {
        ...res,
        type: res.mime_type.includes('spreadsheet') ? 'spreadsheet' : '',
        sheetName: res.name,
      };
    });
  }

  /**
   * pagination events 
   * Update next_token to get next page
   * @param event
   */
  pageEvent(event) {
    this.next_token = this.tokensList[event - 1]
    this.getSheets()
  }



}
