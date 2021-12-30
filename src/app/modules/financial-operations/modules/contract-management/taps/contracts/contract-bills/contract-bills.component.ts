import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material/dialog";
import { TranslateService } from '@ngx-translate/core';
import { Subscription } from 'rxjs';
import { TABLE_COLUMNS } from 'src/app/modules/financial-setting/components/areas/areas.component';
import { TranslationService } from 'src/app/modules/i18n/translation.service';
import { ContractsService } from "../../../service/contracts/contracts.service";

@Component({
  selector: 'app-contract-bills',
  templateUrl: './contract-bills.component.html',
  styleUrls: ['./contract-bills.component.scss']
})
export class ContractBillsComponent implements OnInit {
  Subscription: Subscription = new Subscription()
  premiums: any;

  messageBoxError: {};
  tableItems: any;
  columnDefs = [];
  defaultColDef = {
    filter: false,
    editable: false,
    resizable: true,
  };
  frameworkComponents: any;
  tableColumns = TABLE_COLUMNS;
  // pagination Object
  pageOptions = {
    length: 10,
    paginationSizes: [],
    defaultPageSize: 15,
  };
  search_word: string = ''
  constructor(
    public translation: TranslationService,
    private translate: TranslateService,
    private _contract: ContractsService,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private dialog: MatDialogRef<ContractBillsComponent>,
  ) {

  }

  ngOnInit(): void {
    this.getPremiums()
  }
  getPremiums() {
    this.tableItems = this.data?.premiums
    this.initializeAgGrid()
  }


  initializeAgGrid(): void {
    this.drawAgGrid(); // call drawAgGrid Function
  }

  drawAgGrid(): void {
    if (!this.columnDefs.length) {
      this.columnDefs = [
        {
          headerName: this.translate.instant('contracts.invoice_number'),
          field: 'invoice_id',
          minWidth: 150
        },
        {
          headerName: this.translate.instant('contracts.due_date'),
          field: 'due_date_show',
          minWidth: 150,
        },
        {
          headerName: this.translate.instant('general.name'),
          field: 'name',
          minWidth: 200,
        },
        {
          headerName: this.translate.instant('general.class_room'),
          field: 'fees_class',
          minWidth: 200,
        },
        {
          headerName: this.translate.instant('setting.typesoffees'),
          field: 'fees_type',
          minWidth: 200,
        },
        {
          headerName: this.translate.instant('general.amount'),
          field: 'premium_value',
          minWidth: 150,
        },
        {
          headerName: this.translate.instant('general.status'),
          field: 'status',
          minWidth: 150,
        },
        // {
        //   headerName: 'الإجراءات',
        //   cellRenderer: 'agActionBtn',
        //   cellClass: 'action-cell',
        //   cellRendererParams: {
        //     actions: [
        //       {
        //         action: 'edit',
        //         style: cellActionStyle
        //       },
        //       {
        //         action: 'delete',
        //         style: DeleteActionStyle
        //       },
        //     ],
        //     getAction: this.rowActions.bind(this),
        //   },
        //   minWidth: 150
        // }
      ];
    }
  }


}
