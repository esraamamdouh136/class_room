import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {TranslateService} from '@ngx-translate/core';

import {GridApi} from 'ag-grid-community';
import {GlobalAgTableColumns} from '../../model/global';
import {LicenseManager} from 'ag-grid-enterprise';
import {TranslationService} from 'src/app/modules/i18n/translation.service';

LicenseManager.setLicenseKey('CompanyName=viewclass.com,LicensedApplication=viewclass.com,LicenseType=SingleApplication,LicensedConcurrentDeveloperCount=1,LicensedProductionInstancesCount=0,AssetReference=AG-018150,ExpiryDate=19_August_2022_[v2]_MTY2MDg2MzYwMDAwMA==7c207f1bd25c85068cc50703ee09b870');

@Component({
  selector: 'app-ag-grid',
  templateUrl: './ag-grid.component.html',
  styleUrls: ['./ag-grid.component.scss']
})
export class AgGridComponent implements OnInit {

  @Input() pageOptions;
  @Input() disableSelectOnClick = false;
  @Input() height: any;
  @Input() rowData: any[];
  @Input() columnDefs: any[];
  @Input() defaultColDef: any;
  @Input() frameworkComponents: any;
  @Input() domLayout: any = 'normal';
  @Input() GlobalTable: boolean = false;
  @Input() pagination: boolean = false;
  @Input() rowColors: { even: string, odd: string };


  @Input() sideBar;
  @Input() rowGroupPanelShow;
  @Input() pivotPanelShow;



  @Output() updateData: EventEmitter<any[]> = new EventEmitter<any[]>();
  @Output() selectedRows: EventEmitter<any[]> = new EventEmitter<any[]>();
  @Output() pageEvent: EventEmitter<any> = new EventEmitter<any>();

  @Output() tableStateChange: EventEmitter<any> = new EventEmitter<any>();
  @Output() columnApi: EventEmitter<any> = new EventEmitter<any>();

  rowStyle: any;
  rowClass: any;
  gridApi: GridApi;
  gridColumnApi: any;
  rowClassRules;

  constructor(
    private translateService: TranslateService,
    public translation: TranslationService
  ) {
  }

  ngOnInit(): void {
    if (this.GlobalTable) {
      this.columnDefs = this.mapColumnDefs(this.columnDefs);
    }
    this.setRowColors();
  }

  setRowColors(): void {
    this.rowStyle = params => {
      if (params.node.rowIndex % 2 === 0) {
        return {background: this.rowColors?.even};
      } else {
        return {background: this.rowColors?.odd};
      }
    };

    this.rowClassRules = {
      'bg-red': function(params) {
        return params.data.status === 2;
      },
    };
  }

  onGridReady(params) {
    this.gridApi = params.api;
    this.gridColumnApi = params.columnApi;
    this.columnApi.emit(this.gridColumnApi);
    this.gridApi.sizeColumnsToFit();
  }

  onSelectionChanged(evt) {
    const selectedRows = this.gridApi.getSelectedRows();
    // this.gridApi.redrawRows();
    this.selectedRows.emit(this.disableSelectOnClick ? selectedRows : selectedRows[0] || null);
  }

  onSelectedRowChanged(evt) {
    const selectedRows = this.gridApi.getSelectedRows();
    this.selectedRows.emit(this.disableSelectOnClick ? selectedRows : selectedRows[0] || null);
  }

  onDragEnd(evt) {
    const itemsToUpdate = [];

    this.gridApi.forEachNodeAfterFilterAndSort((rowNode) => {
      itemsToUpdate.push(rowNode.data);
    });

    this.rowData = itemsToUpdate;
    this.updateData.emit(this.rowData);
  }

  // pagination
  paginationEvent(event) {
    this.pageEvent.emit(event);
  }

  onColumnVisibleChange(e){
    this.tableStateChange.emit(true)
  }

  mapColumnDefs(columns: GlobalAgTableColumns[]) {
    return columns.map(col => {
      return {
        ...col,
        headerName: this.translateService.instant(col.headerName)
      };
    });
  }

}
