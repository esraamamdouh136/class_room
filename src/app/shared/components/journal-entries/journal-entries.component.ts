import {ChangeDetectorRef, Component, Inject, OnDestroy, OnInit, ViewChild,} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {ToastrService} from 'ngx-toastr';
import {forkJoin, Subscription} from 'rxjs';
import {Column, GuideTree, JournalEntries} from '../../model/global';
import {TaxesService} from '../../../modules/financial-setting/services/taxes/taxes.service';
import {finalize} from 'rxjs/operators';
import {JournalEntriesService} from '../../services/journal-entries.service';
import {MatTableDataSource} from '@angular/material/table';
import {SpecialDiscountsService} from 'src/app/modules/financial-setting/services/special-discounts/special-discounts.service';
import {SharedService} from '../../services/shared.service';
import {AgGridComponent} from '../ag-grid/ag-grid.component';
import {AgActionBtnComponent} from '../ag-grid/cell-renderers/ag-action-btn/ag-action-btn.component';
import {AgAutocompleteComponent} from '../ag-grid/cell-renderers/ag-autocomplete/ag-autocomplete';
import {PaymentService} from 'src/app/modules/financial-setting/services/paymentServices/payment.service';
import { ListsService } from "../../services/list_Service/lists.service";

interface JournalParameters {
  name?: string;
  id?: number;
}

@Component({
  selector: "app-journal-entries",
  templateUrl: "./journal-entries.component.html",
  styleUrls: ["./journal-entries.component.scss"],
})
export class JournalEntriesComponent implements OnInit, OnDestroy {
  // ================= Start AG GRID Variables ==================== //
  columnDefs = [];
  rowData = [];
  frameworkComponents: any;
  defaultColDef = {
    resizable: true,
  };
  agSelectedRow;
  @ViewChild("agGrid") agGrid: AgGridComponent;
  isEditing = true;
  errorsArr = [];

  // ================= End AG GRID Variables ==================== //
  subscription: Subscription = new Subscription();
  guideTree: GuideTree[] = [];
  journalModules = [];
  filteredTree: GuideTree[] = [];
  DropDownData = [];
  formErrors;
  dataLoaded = false;
  addLoading = false;
  selectedDropDownItem: number;
  journal_module_id: number;
  selectedMotherCompanyNumber: number;
  selectedConstCenterNumber: number;
  entries: JournalEntries[] = [];

  dataSource: MatTableDataSource<JournalEntries>;
  journalParameters: JournalParameters[] = [];

  // Angular material table
  columns: Column[] = [];
  displayedColumns: string[];

  constructor(
    private listsService: ListsService,
    private changeDetectorRefs: ChangeDetectorRef,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private taxesService: TaxesService,
    private toaster: ToastrService,
    private journalEntriesService: JournalEntriesService,
    private dialog: MatDialogRef<JournalEntriesComponent>,
    private specialDiscount: SpecialDiscountsService,
    private paymentService: PaymentService,
    private _sharedService: SharedService
  ) {
    this.frameworkComponents = {
      agAutocomplete: AgAutocompleteComponent,
      agActionBtn: AgActionBtnComponent,
    };
  }

  ngOnInit(): void {
    this.dataSource = new MatTableDataSource([]);
    this.subscription.add(
      this._sharedService.selectedCompanyNumber$.subscribe((res) => {
        this.selectedMotherCompanyNumber = res;
      })
    );

    this.getTreeAndParameters();
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  /**
   * Start AG_GRID function
   */

  initializeAgGrid(): void {
    this.drawAgGrid();

    this.rowData = this.entries || [];

    if (!this.rowData?.length) {
      for (let i = 1; i <= 2; i++) {
        this.onAddRow();
      }
    }
  }

  // Add row to the table
  onAddRow(): void {
    this.rowData.push({
      debit_parameter: null,
      credit_parameter: null,
    });
    this.rowData = this.rowData.slice();
  }

  drawAgGrid(): void {
    this.columnDefs = [
      {
        headerName: "#",
        valueGetter: "node.rowIndex + 1",
        filter: true,
        rowDrag: true,
        width: 80,
      },
      {
        headerName: "الحساب",
        field: "account_guide_id",
        cellRenderer: "agAutocomplete",
        cellRendererParams: {
          setData: this.setAccGuideId.bind(this),
          selectedKey: "account_guide_id",
          values: this.guideTree,
          bindValue: "id",
          bindLabel: "viewLabel",
          disabled: !this.isEditing,
        },
        sortable: false,
        width: 300,
      },
      {
        headerName: "البيان",
        field: "statement",
        editable: this.isEditing,
      },
      {
        headerName: "النسبه",
        field: "percentage",
        editable: this.isEditing,
      },
      {
        headerName: "مدين",
        field: "debit_parameter",
        cellRenderer: "agAutocomplete",
        cellRendererParams: {
          setData: this.debitParameter.bind(this),
          selectedKey: "debit_parameter",
          values: this.journalParameters,
          bindValue: "id",
          bindLabel: "name",
          disabled: !this.isEditing,
        },
        width: 200,
        editable: false,
      },
      {
        headerName: "دائن",
        field: "credit_parameter",
        cellRenderer: "agAutocomplete",
        cellRendererParams: {
          setData: this.creditParameter.bind(this),
          selectedKey: "credit_parameter",
          values: this.journalParameters,
          bindValue: "id",
          bindLabel: "name",
          disabled: !this.isEditing,
        },
        width: 200,
        editable: false,
      },
      {
        headerName: "الإجراءات",
        cellRenderer: "agActionBtn",
        cellRendererParams: {
          actions: [
            {
              action: "delete",
              style: {
                color: "#F64E60",
                backgroundColor: "rgba(#F64E60, 0.2)",
              },
            },
          ],
          disabled: !this.isEditing,
          getAction: this.getAction.bind(this),
        },
        width: 130,
      },
    ];
  }

  setAccGuideId(e) {
    if (e) {
      e.data.account_guide_id = e.event;
    }
  }

  creditParameter(e) {
    if (e) {
      e.data.credit_parameter = e.event;
      e.data.debit_parameter = null;
      this.refreshTable();
    }
  }

  debitParameter(e) {
    if (e) {
      e.data.debit_parameter = e.event;
      e.data.credit_parameter = null;
      this.refreshTable();
    }
  }

  getAction(e) {
    if (e.action === "delete") {
      this.onDeleteRow(e.data);
    }
  }

  // remove a row from the table
  onDeleteRow(row): void {
    const itemIndex = this.rowData.indexOf(row);
    this.rowData.splice(itemIndex, 1);
    this.rowData = this.rowData.slice();
  }

  onUpdateData(event): void {
    this.rowData = event;
  }

  onRowSelectionChange(row) {
    this.agSelectedRow = row;
  }

  refreshTable(): void {
    this.agGrid.gridApi.redrawRows();
  }

  /**
   * End AG_GRID function
   */

  // get taxes
  getTaxes(): void {
    let request;
    if (this.data.type == "tax") {
      request = this.taxesService.getTaxes();
    }
    if (this.data.type == "specialdiscounts") {
      request = this.specialDiscount.getSpecialDoscounts();
    }
    if (this.data.type == "paymentMethod") {
      request = this.paymentService.getDataPaymentMethod();
    }
    this.subscription.add(
      request
        .pipe(finalize(() => (this.dataLoaded = true)))
        .subscribe((res) => {
          this.DropDownData = res.data || res.paginate.data;
          this.selectDefaultDropdownVal();
        })
    );
  }

  // Get tree
  getTreeAndParameters(): void {
    this.subscription.add(
      forkJoin([
        this.listsService.getJournalParameters(),
        this.listsService.getAccountGuideTree(this.selectedMotherCompanyNumber),
        this.listsService.getJournalModules(),
      ]).subscribe((res) => {
        this.journalParameters = res[0]?.items;
        this.journalModules = res[2]?.items;
        this.journal_module_id = res[2]?.items[0].id;
        this.guideTree = this.mapGuideTree(res[1]);
        this.getTaxes();
      })
    );
  }

  mapGuideTree(items) {
    return items.map((item) => {
      return {
        ...item,
        id: item?.id ? item?.id : "null",
      };
    });
  }

  selectDefaultDropdownVal(): void {
    let select;
    if (this.data.type == "tax") {
      select = "tax_linked_account";
    }
    if (this.data.type == "specialdiscounts") {
      select = "special_discount_linked_account";
    }
    if (this.data.type == "paymentMethod") {
      select = "payment_method_linked_account";
    }

    if (this.DropDownData?.length) {
      this.selectedDropDownItem = this.DropDownData[0]?.id;
      let data = this.DropDownData[0]?.[select].filter(
        (e) => e.journal_module_id == this.journal_module_id
      );
      if (data.length) {
        this.entries = this.mapEntries(data);
        this.dataSource = new MatTableDataSource(this.entries);
        this.rowData = this.entries;
        this.initializeAgGrid();
        // this.dataSource.sort = this.sort;
      } else {
        this.resetEntries();
        this.initializeAgGrid();
      }
    }
  }

  trackByFn(index) {
    return index;
  }

  submit(): void {
    let select;
    if (this.data.type == "tax") {
      select = "tax_linked_account";
    }
    if (this.data.type == "specialdiscounts") {
      select = "special_discount_linked_account";
    }
    if (this.data.type == "paymentMethod") {
      select = "payment_method_linked_account";
    }
    this.mapDataBeforePost();
    this.addLoading = true;
    const addTax = {
      journal_module_id: this.journal_module_id,
      tax_linked_account: [...this.rowData],
    };
    const addSpecialDiscount = {
      journal_module_id: this.journal_module_id,
      special_discount_linked_account: [...this.rowData],
    };
    const addPaymentMethod = {
      journal_module_id: this.journal_module_id,
      payment_method_linked_account: [...this.rowData],
    };
    let request;
    if (this.data.type == "tax") {
      request = this.journalEntriesService.addJournalEntry(
        this.selectedDropDownItem,
        addTax
      );
    }
    if (this.data.type == "specialdiscounts") {
      request = this.journalEntriesService.addJournalEntrySpecialAccount(
        this.selectedDropDownItem,
        addSpecialDiscount
      );
    }
    if (this.data.type == "paymentMethod") {
      request = this.journalEntriesService.addJournalEntryPaymentMethodAccount(
        this.selectedDropDownItem,
        addPaymentMethod
      );
    }
    request.pipe(finalize(() => (this.addLoading = false))).subscribe(
      (res) => {
        this.errorsArr = [];
        this.toaster.success(res.message);
        this.dialog.close();
      },
      (err) => {
        this.errorsArr = [];
        err?.error[select].forEach((el) => {
          if (typeof el == "object") {
            Object.keys(el).forEach((key) => {
              this.errorsArr.push(...el[key]);
            });
          } else {
            this.errorsArr.push(el);
          }
        });
      }
    );
  }

  // check if credit value and debit value are equal 100%
  checkCreditDebitValue(type: "Credit" | "Debit"): boolean {
    let sum = 0;
    this.dataSource.data
      .filter((e) => e.type === type)
      .forEach((i) => (sum += i.percentage));

    return sum === 100;
  }

  dropDownDataChanged(): void {
    this.errorsArr = [];
    let select;
    if (this.data.type === "tax") {
      select = "tax_linked_account";
    }
    if (this.data.type === "specialdiscounts") {
      select = "special_discount_linked_account";
    }
    if (this.data.type === "paymentMethod") {
      select = "payment_method_linked_account";
    }
    const selectedData = this.DropDownData?.find(
      (t) => t?.id === this.selectedDropDownItem
    )?.[select].filter((e) => e.journal_module_id == this.journal_module_id);
    if (selectedData?.length > 0) {
      this.entries = this.mapEntries(selectedData);
      this.rowData = this.entries;
    } else {
      this.resetEntries();
    }
  }

  changeJournalModule(): void {
    this.errorsArr = [];
    let select;
    if (this.data.type === "tax") {
      select = "tax_linked_account";
    }
    if (this.data.type === "specialdiscounts") {
      select = "special_discount_linked_account";
    }
    if (this.data.type === "paymentMethod") {
      select = "payment_method_linked_account";
    }
    let data = this.DropDownData[
      this.DropDownData.findIndex((e) => e.id == this.selectedDropDownItem)
    ]?.[select].filter((e) => e.journal_module_id == this.journal_module_id);
    if (data?.length > 0) {
      this.entries = this.mapEntries(data);
      this.rowData = this.entries;
    } else {
      this.resetEntries();
    }
  }

  mapEntries(items: JournalEntries[]) {
    return items.map((item, index) => {
      return {
        ...item,
        credit_parameter:
          item?.type === "Credit" ? item?.journal_parameter_id : null,
        debit_parameter:
          item?.type === "Debit" ? item?.journal_parameter_id : null,
        item_index: index + 1,
        account_guide_id: item?.account_guide_id
          ? item?.account_guide_id
          : "null",
      };
    });
  }

  resetEntries(): void {
    this.entries = [];
    this.rowData = this.entries;
  }

  mapDataBeforePost(): void {
    this.rowData = this.rowData.filter((d) => {
      if (
        d?.debit_parameter ||
        d?.credit_parameter ||
        d?.account_guide_id ||
        d?.statement ||
        d?.percentage
      ) {
        if (d?.account_guide_id === 'null') {
          d.account_guide_id = null;
        }
        if (d?.debit_parameter) {
          d.type = "Debit";
          d.journal_parameter_id = d.debit_parameter;
        } else if (d?.credit_parameter) {
          d.type = "Credit";
          d.journal_parameter_id = d.credit_parameter;
        }
        return d;
      }
    });
  }
}
