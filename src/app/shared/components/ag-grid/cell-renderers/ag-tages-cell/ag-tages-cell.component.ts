import { Component, OnInit } from '@angular/core';
import { ICellRendererAngularComp } from "ag-grid-angular";

@Component({
  selector: 'app-ag-tages-cell',
  templateUrl: './ag-tages-cell.component.html',
  styleUrls: ['./ag-tages-cell.component.scss']
})
export class AgTagesCellComponent implements ICellRendererAngularComp {
  params;
  status: any;
  tags: string;

  constructor() { }


  agInit(params): void {
    this.params = params;
    this.status = params?.data?.status;
    this.tags = params?.data?.fees_types;
  }

  refresh(params?: any): boolean {
    return true;
  }
}
