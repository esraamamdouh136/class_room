import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { MomentDateAdapter } from "@angular/material-moment-adapter";
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material/dialog";
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from "@angular/material/core";

import * as moment from 'moment';
import { Observable, Subscription } from "rxjs";
import { map, startWith } from "rxjs/operators";

import { MY_FORMATS } from "src/app/modules/datePicker";
import { Areas, Branches, CostCenter, Father, GuideTree } from "src/app/shared/model/global";
import { SharedService } from "src/app/shared/services/shared.service";
import { ledgerParamsData } from "../../../models/account-guide/global";
import { ListsService } from "src/app/shared/services/list_Service/lists.service";
import { AccountGuideService } from '../../../services/account-guide/account-guide.service';


@Component({
  selector: 'app-ledger-search',
  templateUrl: './ledger-search.component.html',
  styleUrls: ['./ledger-search.component.scss'],
  providers: [
    // `MomentDateAdapter` and `MAT_MOMENT_DATE_FORMATS` can be automatically provided by importing
    // `MatMomentDateModule` in your applications root module. We provide it at the component level
    // here, due to limitations of our example generation script.
    { provide: DateAdapter, useClass: MomentDateAdapter, deps: [MAT_DATE_LOCALE] },
    { provide: MAT_DATE_FORMATS, useValue: MY_FORMATS },
  ],

})
export class LedgerSearchComponent implements OnInit {

  form: FormGroup;
  areas:Areas[] = [];
  branches:Branches[] = [];
  fathers:Father[] = [];
  costCenters: CostCenter[] = [];
  currencies = [];
  students = [];
  selectedAreaId;
  companyNum;
  mappedTree = [];
  filteredOptions : Observable<any[]>;;
  subscription: Subscription = new Subscription();
  constructor(
    private fb: FormBuilder,
    private accountGideService: AccountGuideService,
    private listsService: ListsService,
    private shredService: SharedService,
    private dialog: MatDialogRef<LedgerSearchComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
  ) {

  }

  ngOnInit(): void {
    this.initForm();
    this.getInitialData();

    //Spread tree for auto complete
    this.filterAutoCompleteOptions();
    this.mapGuide(this.data?.list);
    if (this.data.node) {
      this.form.get('account').setValue({nodeName:this.data.node.nodeName});
    }
  }

  // Auto complete
  filterAutoCompleteOptions(){
    this.filteredOptions = this.form.get('account').valueChanges.pipe(
      startWith(''),
      map(value => typeof value === 'string' ? value : value.nodeName),
      map(name => name ? this.filterMap(name) : this.mappedTree.slice())
    );
  }

  private filterMap(name: string) {
    const filterValue = name.toLowerCase();

    return this.mappedTree.filter(option => option.nodeName.toLowerCase().includes(filterValue));
  }

  displayFn(node): string {
    return node && node.nodeName ? node.nodeName : '';
  }


  getInitialData(){
    this.subscription.add(
      this.shredService.selectedCompanyNumber$.subscribe(val => {
        if(val){
          this.companyNum = val;
          this.getCostCenters(val);
          this.getAreas(val);
          this.getAllFathers(val);
          this.getCurrencies(val);
        }
      })
    )
  }


  initForm() {
    this.form = this.fb.group({
      account: ['',Validators.required],
      costCenter: [''],
      start_at: ['',Validators.required],
      end_at: ['',Validators.required],
      tag: [''],
      father_id: [''],
      student_id: [''],
      currency_id: [''],
      cost_center_branch_id: [''],
      cost_center_region_id: [''],
    })
  }


  /**
   * Get cost center data.
   */
  getCostCenters(companyNum) {
    this.subscription.add(
      this.listsService.costCenters(companyNum).subscribe(res => {
        this.costCenters = res?.items;
      }, error => {
        this.costCenters = [];

      })
    )
  }

  /**
   * Get Areas data.
   */
  getAreas(companyNum) {
    this.subscription.add(
      this.listsService.getRegions(companyNum).subscribe(res => {
        this.areas = res?.items;
      }, error => {
        this.areas = [];
      })
    )
  }

  /**
   * Get Areas data.
   */
  getBranches(companyNum) {
    this.subscription.add(
      this.listsService.getBranches(companyNum,this.selectedAreaId).subscribe(res => {
        this.branches = res?.items;
      }, error => {
        this.branches = [];
      })
    )
  }

  /**
   * Get Areas data.
   */
  getCurrencies(companyNum) {
    this.subscription.add(
      this.listsService.getCurrencies(companyNum,1).subscribe(res => {
        this.currencies = res?.items;
      }, error => {
        this.currencies = [];
      })
    )
  }

  getAllFathers(companyNum) {
    this.subscription.add(
      this.listsService.getAllFathers(companyNum).subscribe(res => {
        this.fathers = res?.items;
      }, error => {
        this.fathers = [];
      })
    )
  }

  selectFather(e){
    this.getStudents(this.companyNum,e.id);
  }

  getStudents(companyNum,fatherId) {
    this.subscription.add(
      this.listsService.getAllStudents(companyNum,fatherId).subscribe(res => {
        this.students = res?.items;
      }, error => {
        this.students = [];
      })
    )
  }

  onSubmit() {
    const data = this.prepareDataBeforePost();
    this.accountGideService.getLedgerData(data).subscribe(res => {
      let headerData = {
        date_from: data.date_from,
        date_to: data.date_to,
        account: this.form.get('account').value.nodeName,
      }
      this.dialog.close({ data: res, headerData: headerData, close: true });
    })
  }

  prepareDataBeforePost() {
    const formValue = this.form.value;
    const data: ledgerParamsData = {
      cost_center_id: formValue.costCenter,
      date_from: moment(formValue.start_at).format('DD/MM/YYYY'),
      date_to: moment(formValue.end_at).format('DD/MM/YYYY'),
      account_guide_id: this.data?.node?.id,
      journal_module_id: '',
      cost_center_branch_id: formValue.cost_center_branch_id,
      cost_center_region_id: formValue.cost_center_region_id,
      father_id: formValue.father_id,
      statement: '',
      status: 'Active',
      student_id: formValue.student_id,
      tag: formValue.tag,
      currency_id : formValue.currency_id,
      account : this.form.get('account').value.nodeName,
    }
    return data;
  }

  // =========[Work on search]============
  mapGuide(tree: GuideTree[]) {
    for (const node of tree) {
      if (node?.all_children?.length) {
        const currentNode = JSON.parse(JSON.stringify(node));
        delete currentNode.all_children;
        this.mappedTree.push(currentNode);
        this.mapGuide(node.all_children);
      } else {
        this.mappedTree.push(node);
      }
    }
  }

  onSelectArea(e){
    this.selectedAreaId = e.id;
    this.getBranches(this.companyNum);
  }
}
