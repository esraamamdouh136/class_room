import { Component } from '@angular/core';
import { ICellRendererAngularComp } from 'ag-grid-angular';


@Component({
  selector: 'app-ag-status-btn',
  templateUrl: './ag-status-btn.component.html',
  styleUrls: ['./ag-status-btn.component.scss']
})
export class AgStatusBtnComponent implements ICellRendererAngularComp {
  params;
  status: any;
  is_connected: any;
  statusView: string;

  constructor() { }


  agInit(params): void {
    this.params = params;
    this.status = params?.data?.status;
    this.is_connected = params?.data?.is_connected;
    this.statusView = params?.data?.statusView;
  }

  refresh(params?: any): boolean {
    return true;
  }

  onClick(action) {
    const params = {
      action: action,
      status: this.status,
      data: this.params.node.data
      // ...something
    };
    this.params.getAction(params);
  }

}
