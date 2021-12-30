import { FormControl } from '@angular/forms';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material/core';

import * as moment from 'moment';
import { ToastrService } from 'ngx-toastr';
import { BehaviorSubject, Subscription } from 'rxjs';
import { TranslateService } from "@ngx-translate/core";
import {MomentDateAdapter } from '@angular/material-moment-adapter';

import { MY_FORMATS } from 'src/app/modules/datePicker';
import { SharedService } from "src/app/shared/services/shared.service";
import { FicalYearService } from "../../../services/fiscal-years/fical-year.service";
import { TranslationService } from 'src/app/modules/i18n/translation.service';
import { flatten } from '@angular/compiler';
import { ListsService } from "src/app/shared/services/list_Service/lists.service";

@Component({
  selector: 'app-fiscal-year-form',
  templateUrl: './add-edit-fiscal-year.component.html',
  styleUrls: ['./add-edit-fiscal-year.component.scss'],
  providers: [
    { provide: DateAdapter, useClass: MomentDateAdapter, deps: [MAT_DATE_LOCALE] },
    { provide: MAT_DATE_FORMATS, useValue: MY_FORMATS },
  ],
})
export class FiscalYearFormComponent implements OnInit,OnDestroy {

  // Datepicker takes `Moment` objects instead of `Date` objects.
  addLoading = false;
  alive: boolean = true;
  nameOfEnglish : boolean;
  nameofArabic : boolean;
  
  form: FormGroup;
  number: number;
  motherCompanyId;
  fiscalYears: any[]
  motherCompanies: any[]
  date = new FormControl(moment([2017, 0, 1]));
  subscription: Subscription = new Subscription();
  errors: BehaviorSubject<any> = new BehaviorSubject({});
  showLoading: BehaviorSubject<any> = new BehaviorSubject(false);

  language:string;


  constructor(
    // private api: ApiService,
    private fb: FormBuilder,
    private _lists: ListsService,
    private toastr: ToastrService,
    private shared: SharedService,
    private _fiscalYear: FicalYearService,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private dialog: MatDialogRef<FiscalYearFormComponent>,
    public translation: TranslationService,
    private translate : TranslateService
    ) {
  }

  ngOnInit() {
    this.getData();
    this.defualtLanguageInputs();
  }

  defualtLanguageInputs(){
    if(this.translation.getSelectedLanguage() == 'ar'){
      this.language = this.translate.instant('MENU.en_language')
      this.nameOfEnglish = false;
      this.nameofArabic = true;
    }
    else if(this.translation.getSelectedLanguage() == 'en'){
      this.language = this.translate.instant('MENU.ar_language')
      this.nameOfEnglish = true;
      this.nameofArabic = false;
    }
  }

  getData(){
    this.initForm();
    this.getMotherCompanies();
    this.fillData();

    this.subscription.add(
      this.dialog.afterClosed().subscribe(res => {
        this.errors.next({});
        this.serverErrors({});
      })
    )

    this.subscription.add(
      this.shared.selectedCompanyId$.subscribe(val => {
        this.motherCompanyId = val;
      })
    )
  }

  getMotherCompanies() {
    this.showLoading.next(true)
    this.subscription.add(
      this._lists.motherCompanies().subscribe(res => {
        this.motherCompanies = [...res.items];
        this.motherCompanies.forEach(motherC => {
          if (motherC.id == this.motherCompanyId) {
            this.number = motherC.number;
          }
        });
        this.showLoading.next(false)
      }, err => {
        this.showLoading.next(false)
      }
      )
    )

  }

  fillData() {
    if (this.data.row) {
      let row = JSON.parse(JSON.stringify(this.data.row))
      row.start_at = moment(this.data.row.start_at, 'DD.MM.YYYY').toDate()
      row.end_at = moment(this.data.row.end_at, 'DD.MM.YYYY').toDate();
      row.status = row.status == 1 ? true : false;
      this.form.patchValue(row)
    }
  }

  initForm() {
    this.form = this.fb.group({
      status: [1],
      name_ar: ['', Validators.required],
      name_en: ['', Validators.required],
      start_at: ['', Validators.required],
      journal_sequence: ['', Validators.required],
      end_at: [''],
    })
  }

  // get the status form control
  get statusValue() {
    return this.form.get("status").value;
  }

  get journalSequenceValue() {
    return this.form.get("journal_sequence");
  }



  onSubmit() {
    this.addLoading = true;
    let form  = this.prepareDataBeforePost();
   
    this._fiscalYear.addFiscalYear(form, this.number).subscribe(res => {
      if (res.code === 200) {
        this.dialog.close(true)
        this.toastr.success(res.message)
        this.addLoading = false;
        this.errors.next({});
      }

    },
      err => {
        this.addLoading = false;
        this.serverErrors(err.error)
      })

  }
  serverErrors(errors) {
    let errObj = {}
    for (const key in errors) {
      if (key) {
        errObj[key] = true
        errObj[key + '_error'] = errors[key][0]
      }

    }
    this.shared.serverErrors.next(errObj)
    this.errors.next(errObj)
  }

  prepareDataBeforePost(){ 
    let form = JSON.parse(JSON.stringify(this.form.value))
    form.id = this.data.id || 0;
    form.status = form.status ? 1 : 2
    if(form.name_ar == undefined || form.name_ar == ""){
      form.name_ar = form.name_en
    }
   else if(form.name_en == undefined || form.name_en == ""){
    form.name_en = form.name_ar
  }
    form.start_at = moment(this.form.value.start_at).format('DD/MM/YYYY');
    if (form.end_at) {
      form.end_at = moment(this.form.value.end_at).format('DD/MM/YYYY')
    }
    form.end_at = form.end_at ? form.end_at :
      moment(this.form.value.start_at).add(1, 'y').format('DD/MM/YYYY')

    return form
  }

  ngOnDestroy() {
    this.shared.serverErrors.next({})
    this.subscription.unsubscribe();
  }


  /**
   * Calender arabic if user use arabic language
   */
  checkLocal() {
  }

  toggleLanguage(){
    if(this.nameofArabic == true){
      this.language = this.translate.instant('MENU.ar_language')
        this.nameOfEnglish = true;
        this.nameofArabic = false;
    }
    else if(this.nameOfEnglish == true){
      this.language = this.translate.instant('MENU.en_language')
        this.nameOfEnglish = false;
        this.nameofArabic = true;
    }
  }
}
