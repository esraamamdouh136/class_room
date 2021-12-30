import { Component, OnInit } from '@angular/core';
import { ICellRendererAngularComp } from 'ag-grid-angular';

@Component({
  selector: 'app-ag-image-formatter',
  templateUrl: './ag-image-formatter.component.html',
  styleUrls: ['./ag-image-formatter.component.scss']
})
export class AgImageFormatterComponent implements ICellRendererAngularComp {

  params;
  disabled: boolean;

  agInit(params): void {
    this.params = params; 
  }

  refresh(params?: any): boolean {
    this.disabled = params.disabled;
    return true;
  }

}
