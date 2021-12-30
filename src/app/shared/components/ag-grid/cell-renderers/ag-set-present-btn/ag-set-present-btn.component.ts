import { Component, OnInit } from '@angular/core';
import { ICellRendererAngularComp } from "ag-grid-angular";

@Component({
  selector: 'app-ag-set-present-btn',
  templateUrl: './ag-set-present-btn.component.html',
  styleUrls: ['./ag-set-present-btn.component.scss']
})
export class AgSetPresentBtnComponent implements ICellRendererAngularComp {

  params;
  isCurrent:boolean;

  agInit(params) {
      this.params = params;
      console.log(params);
      this.isCurrent = this.params?.data?.is_current ? true : false;
  }


  refresh(params?: any): boolean {
      return true;
  }

  handleAction(): void {
      this.params.getAction({
          data: this.params.data,
      });
  }

}
