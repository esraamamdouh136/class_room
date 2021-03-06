import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA } from "@angular/material/dialog";

import { Subscription } from "rxjs";
import { TranslateService } from "@ngx-translate/core";

import { SharedService } from "src/app/shared/services/shared.service";
import { ListsService } from "src/app/shared/services/list_Service/lists.service";

@Component({
    selector: 'app-ledger-details',
    templateUrl: './ledger-details.component.html',
    styleUrls: ['./ledger-details.component.scss']
})
export class LedgerDetailsComponent implements OnInit {
    // ================= Start AG GRID Variables ==================== //
    columnDefs = [];
    secondColumnDefs = [];
    currencies = [];
    currency;
    rowData = [];
    secondRowData = [];
    frameworkComponents: any;
    defaultColDef = {
        resizable: true,
        editable: false
    };
    agSelectedRow: any;
    balanceForEveryMove = 0;

    // ================= End AG GRID Variables ==================== //

    subscription : Subscription = new Subscription();

    constructor(
        private listsService:ListsService,
        private translate: TranslateService,
        private sharedService:SharedService,
        @Inject(MAT_DIALOG_DATA) public data: any,
    ) { }

    ngOnInit(): void {
        this.currency = 3;
        this.calculateFinaleResult();
        this.initializeTableData();

        this.initializeAgGrid();

        this.subscription.add(
            this.sharedService.navChanged$.subscribe(data => {
                this.getCurrencies(data.companyNum,data.fiscalYear);
            })
        )
    }

    ngOnDestroy(): void {
        this.subscription.unsubscribe();
    }

    initializeTableData() {
        const previousBalance = {
            debit: this.data?.tableData?.prev?.debit,
            credit: this.data?.tableData?.prev?.credit,
            statement: '',
            journal_entry_id: this.translate.instant('setting.previousBalance'),
            date: '',
            balanceForEveryMove: '',
        }
        this.data.tableData.items = this.data.tableData.items.map(el => {
            if (el.credit) {
                this.balanceForEveryMove += el.credit;
            } else if (el.debit) {
                this.balanceForEveryMove -= el.debit;
            }
            el.balanceForEveryMove = this.balanceForEveryMove;
            return el;
        })
        this.data.tableData.items.unshift(previousBalance);
    }

    calculateFinaleResult() {
        let credit = this.data.tableData.total_credit;
        let debit = this.data.tableData.total_debit;
        let balance = 0;
        balance = credit - debit;

        ['', '??????????????', '???????????? ??????????????'].forEach(e => {
            this.secondRowData.push({
                text: e,
                credit: credit,
                debit: debit,
                balance: balance,
            })
        })

    }

    initializeAgGrid(): void {
        this.drawAgGrid();
        this.rowData = this.data?.tableData.items || [];
        this.secondRowData = this.secondRowData || [];
    }

    drawAgGrid(): void {
        this.columnDefs = [
            {
                headerName: '??????',
                field: 'journal_entry_id',
                width: 120
            },
            {
                headerName: this.translate.instant('general.statement'),
                field: 'statement',
            },
            {
                headerName: this.translate.instant('general.debit'),
                field: 'credit',
                valueFormatter: `Math.floor(value).toString().replace(/(\\d)(?=(\\d{3})+(?!\\d))/g, "$1,")`,
                valueParser: 'Number(newValue)',
                // width: 100
            },
            {
                headerName: this.translate.instant('general.credit'),
                field: 'debit',
                valueFormatter: `Math.floor(value).toString().replace(/(\\d)(?=(\\d{3})+(?!\\d))/g, "$1,")`,
                valueParser: 'Number(newValue)',
                // width: 100
            },
            {
                headerName: this.translate.instant('general.Balanceforeachmove'),
                field: 'balanceForEveryMove',
                valueFormatter: `Math.floor(value).toString().replace(/(\\d)(?=(\\d{3})+(?!\\d))/g, "$1,")`,
                valueParser: 'Number(newValue)',
            },
            {
                headerName: this.translate.instant('general.date'),
                field: 'date',
                // width: 100
            },
        ];
        this.secondColumnDefs = [
            {
                headerName: '',
                field: 'text',
                width: 250
            },
            {
                headerName: this.translate.instant('general.debit'),
                field: 'credit',
                valueFormatter: `Math.floor(value).toString().replace(/(\\d)(?=(\\d{3})+(?!\\d))/g, "$1,")`,
                valueParser: 'Number(newValue)',
                width: 250
            },
            {
                headerName: this.translate.instant('general.credit'),
                field: 'debit',
                valueFormatter: `Math.floor(value).toString().replace(/(\\d)(?=(\\d{3})+(?!\\d))/g, "$1,")`,
                valueParser: 'Number(newValue)',
                width: 250
            },
            {
                headerName: this.translate.instant('general.balance'),
                field: 'balance',
                valueFormatter: `Math.floor(value).toString().replace(/(\\d)(?=(\\d{3})+(?!\\d))/g, "$1,")`,
                valueParser: 'Number(newValue)',
                width: 250
            },
        ];
    }

    onSearchChange(e) {
        console.log(e.target.value);

    }

    /**
 * Get Areas data.
 */
    getCurrencies(companyNum,fiscalYear) {
        this.subscription.add(
            this.listsService.getCurrencies(companyNum, fiscalYear).subscribe(res => {
                this.currencies = res?.items;
            }, error => {
                this.currencies = [];
            })
        )
    }


}
