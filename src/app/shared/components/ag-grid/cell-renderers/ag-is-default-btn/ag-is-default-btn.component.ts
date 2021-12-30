import { Component } from '@angular/core';
import { ICellRendererAngularComp } from "ag-grid-angular";

@Component({
  selector: 'app-ag-is-default-btn',
  templateUrl: './ag-is-default-btn.component.html',
  styleUrls: ['./ag-is-default-btn.component.scss']
})
export class AgIsDefaultBtnComponent implements ICellRendererAngularComp {

  params;
  isDefault: any;

  constructor() { }


  agInit(params): void {
    this.params = params;
    this.isDefault = params?.data?.isDefault;
  }

  refresh(params?: any): boolean {
    return true;
  }

  onClick(action) {
    const params = {
      action: action,
      isDefault: this.isDefault,
      data: this.params.node.data
      // ...something
    };
    this.params.getAction(params);
  }

}
