import { Route } from '@angular/compiler/src/core';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { AgActionBtnComponent } from 'src/app/shared/components/ag-grid/cell-renderers/ag-action-btn/ag-action-btn.component';
import { AgStatusBtnComponent } from 'src/app/shared/components/ag-grid/cell-renderers/ag-status-btn/ag-status-btn.component';
import { cellActionStyle, TableActions } from 'src/app/shared/model/global';
import { SharedService } from 'src/app/shared/services/shared.service';
import { BillsService } from '../../service/bills.service';
import { saveAs } from 'file-saver';
import { Observable, Subscription } from "rxjs";
import { FormBuilder, FormGroup } from "@angular/forms";
import { TranslationService } from "src/app/modules/i18n/translation.service";
import { startWith, debounceTime, distinctUntilChanged, map, switchMap } from "rxjs/operators";
import { ContractsService } from "../../service/contracts/contracts.service";
import { ListsService } from "src/app/shared/services/list_Service/lists.service";

@Component({
  selector: 'app-bills',
  templateUrl: './bills.component.html',
  styleUrls: ['./bills.component.scss']
})
export class BillsComponent implements OnInit {
  currentPage = 1;
  message: string;
  searchInput: string = '';
  searchParams: any = {
    father_id: '',
    student_id: '',
    number: '',
  };
  searchForm: FormGroup;
  companyNumber: any;
  fatherFilteredOptions: Observable<any[]>;;
  subscription: Subscription = new Subscription();

  existData = true;
  errorMassage = true;
  searchDiv: boolean = false;

  students = [];
  fathers = [];
  columnDefs = [];
  rowData: any[] = [];


  defaultColDef = {
    filter: false,
    editable: false,
    resizable: true,
  };
  agSelectedRow;
  frameworkComponents: any;
  columnDefHeader: object = {};
  messageBoxError = {};

  tableItems = [];

  pageOptions = {
    length: 10,
    paginationSizes: [],
    defaultPageSize: 15
  };
  fetchCriteria = {
    page: 1,
  };

  constructor(
    private translate: TranslateService,
    private router: Router,
    private billsService: BillsService,
    private _sharedService: SharedService,
    private fb: FormBuilder,
    public translation: TranslationService,
    private _contract: ContractsService,
    private lists: ListsService,
  ) {
    this.frameworkComponents = {
      agActionBtn: AgActionBtnComponent,
      agStatusBtn: AgStatusBtnComponent,
    };
  }

  ngOnInit() {
    this._sharedService.navChanged$.subscribe((data) => {
      if (data) {
        this.getBills()
        this.companyNumber = data.companyNum;
        this.getStudentsList('');
        this.getFathers('');
      }
    })

    this.initeForm();
    this.filterAutoCompleteOptions()
    this.filterFathersAutoCompleteOptions()
  }

  ngOnDestroy(): void {
    //Called once, before the instance is destroyed.
    //Add 'implements OnDestroy' to the class.
    this.subscription.unsubscribe();
  }

  initeForm() {
    this.searchForm = this.fb.group({
      father_id: [null],
      student_id: [null],
      number: [null],
    })
  }

  displayFn(node): string {
    return node && node.full_name ? node.full_name : '';
  }

  displayFatherFn(node): string {
    return node && node.full_name ? node.full_name : '';
  }


  // Auto complete
  filterAutoCompleteOptions() {
    this.subscription.add(
      this.searchForm.get('student_id').valueChanges.pipe(
        startWith(''),
        debounceTime(400),
        distinctUntilChanged(),
        map(value => typeof value === 'string' ? value : value.name),
        switchMap(val => {
          return this._contract.getStudentsList(this.companyNumber, val)
        })
      ).subscribe(res => {
        this.students = res?.items;
      })
    )
  }


  // Auto complete
  filterFathersAutoCompleteOptions() {
    this.subscription.add(
      this.searchForm.get('father_id').valueChanges.pipe(
        startWith(''),
          debounceTime(400),
          distinctUntilChanged(),
          map(value => typeof value === 'string' ? value : value.name),
          switchMap(val => {
            return this.lists.getFathersListAutoComplete(this.companyNumber, val)
          })
      ).subscribe(res => {
        this.fathers = res?.items;
      })
    )
  }

  getStudentsList(word) {
    this.subscription.add(
      this.lists.getStudentsListAutoComplete(this.companyNumber, word)
        .subscribe(res => {
          this.students = res?.items;
        })
    )
  }

  getFathers(word) {
    this.subscription.add(
      this.lists.getFathersListAutoComplete(this.companyNumber,word).subscribe(res => {
        this.fathers = res?.items;
      })
    )
  }


  getBills() {
  this.subscription.add(
    this.billsService.getBillsTable(this.searchParams, this.fetchCriteria.page)
    .subscribe((res: any) => {
      this.tableItems = res.data;
      this.pageOptions.length = res.total;
      this.initializeAgGrid()
      this.existData = true;
      this.errorMassage = true;
    },
      error => {
        this.messageBoxError = error.error;
        this.tableItems = [];
        this.initializeAgGrid();
        if (error.error.code === 4000) {
          this.errorMassage = false;
        } else {
          this.errorMassage = true;
          this.existData = false;
        }
      })
  )
  }

  resetForm(){
    this.searchForm.reset();
  }


  initializeAgGrid(): void {
    this.drawAgGrid(); // call drawAgGrid Function
  }


  /**
   * @description A function that draws AG Grid
   */
  drawAgGrid(): void {
    if (!this.columnDefs.length) {
      this.columnDefs = [
        {
          headerName: '#',
          valueGetter: 'node.rowIndex + 1',
          filter: false,
          minWidth: 140
        },
        {
          headerName: this.translate.instant('contracts.invoice_number'),
          field: 'number',
          minWidth: 150
        },
        {
          headerName: this.translate.instant('contracts.studentName'),
          field: 'student_name',
          minWidth: 150
        },
        {
          headerName: this.translate.instant('contracts.fatherName'),
          field: 'parent_name',
          minWidth: 150
        },
        {
          headerName: this.translate.instant('contracts.invoice_amount'),
          field: 'value',
          minWidth: 150
        },
        {
          headerName: this.translate.instant('contracts.payment_status_amont'),
          field: 'paid',
          minWidth: 150,
        },
        {
          headerName: this.translate.instant('contracts.payment_status_rest'),
          field: 'rest',
          minWidth: 150,
        },
        {
          headerName: this.translate.instant('contracts.invoice_status'),
          cellRenderer: 'agStatusBtn',
          cellRendererParams: {
            getAction: this.rowActions.bind(this),
          },
          minWidth: 150
        },
        {
          headerName: this.translate.instant('contracts.due_date'),
          field: 'due_date_show',
          minWidth: 150,
        },
        {
          headerName: 'الإجراءات',
          cellRenderer: 'agActionBtn',
          cellClass: 'action-cell',
          cellRendererParams: {
            actions: [
              {
                action: 'visibility',
                style: cellActionStyle
              },
              {
                action: 'delete',
                style: cellActionStyle
              },
              {
                action: 'download',
                style: cellActionStyle
              },

            ],
            getAction: this.rowActions.bind(this),
          },
          minWidth: 250
        }
      ];
    }
  }

  onSearch() {
    this.searchParams = {
      father_id: this.searchForm?.value?.father_id?.id ? this.searchForm.value.father_id.id: '',
      student_id: this.searchForm?.value?.student_id?.id ? this.searchForm.value.student_id.id: '',
      number: this.searchForm?.value?.number ? this.searchForm.value.number: '',
    }
    this.fetchCriteria.page = 1;
    this.tableItems = [];
    this.getBills();
  }

  toggleSearch() {
    this.searchDiv = !this.searchDiv;
  }

  openAddEditBills() {
    this.router.navigateByUrl('financial-operations/contracts-management/new_bill')

  }
  changeStatus(data?) {

  }

  rowActions(data: any): void {

    if (data.action === TableActions.show) {
      this.router.navigate(['financial-operations/contracts-management/view_bill'], { queryParams: { id: data.data.id } })
    }
    else if (data?.action === TableActions.changeStatus) {
      this.changeStatus(data?.data);
    } else if (data?.action === TableActions.download) {
      this.downLoadBill(data?.data);
    }
  }

  downLoadBill(data) {
    this.subscription.add(
      this.billsService.downloadBill(data.id).subscribe(res => {
        saveAs(res);
      })
    )
  }

  pageEvent(event) {
    if (typeof event == "object") {
      this.fetchCriteria.page = event.pageIndex + 1;
    } else {
      this.fetchCriteria.page = event;
    }
    this.getBills();
  }

}
