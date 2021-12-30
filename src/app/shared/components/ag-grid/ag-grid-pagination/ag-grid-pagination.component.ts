import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-ag-grid-pagination',
  templateUrl: './ag-grid-pagination.component.html',
  styleUrls: ['./ag-grid-pagination.component.scss']
})
export class AgGridPaginationComponent implements OnInit {
  @Input() isPageable = false;
  @Input() pageOptions = {
    paginationSizes: [5, 10, 15],
    defaultPageSize: 5,
    length: 10
  };

  @Output() pageEvent: EventEmitter<any> = new EventEmitter<any>();


  constructor() { }

  ngOnInit(): void {
  }

}
