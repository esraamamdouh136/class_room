import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from "@angular/material/dialog";

import { Subscription } from "rxjs";

import { Currency } from "../../../models/currencies/currency";
import { CurrenciesService } from "../../../services/currencies/currencies.service";
import { AddEditAreaComponent } from "../../areas/add-edit-area/add-edit-area.component";
import { TranslationService } from "src/app/modules/i18n/translation.service";
import { TranslateService } from "@ngx-translate/core";

interface DialogData {
  data: Currency,
  update: boolean
}


@Component({
  selector: 'app-add-edit-currency',
  templateUrl: './add-edit-currency.component.html',
  styleUrls: ['./add-edit-currency.component.scss']
})
export class AddEditCurrencyComponent implements OnInit, OnDestroy {
  nameOfEnglish : boolean;
  nameofArabic : boolean;

  language:string;

  constructor(
    private _FormBuilder: FormBuilder,
    private currencies: CurrenciesService,
    @Inject(MAT_DIALOG_DATA) public data: DialogData,
    private dialog: MatDialogRef<AddEditAreaComponent>,
    public translation: TranslationService,
    private translate : TranslateService
  ) { }

  formErrors;
  form: FormGroup;
  addLoading = false;
  currenciesSymbols = [];
  subscription: Subscription = new Subscription();



  ngOnInit(): void {
    this.initForm();
    if (this.data.update) {
      this.form.patchValue(this.data.data);
      this.data.data.is_default = this.data.data.is_default == 0 ? 2 : this.data.data.is_default;
    }
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

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  // initialize Form
  initForm() {
    this.form = this._FormBuilder.group({
      name_ar: ['', Validators.required],
      name_en: ['', Validators.required],
      currency_symbol_ar: ['',Validators.required],
      currency_symbol_en: ['',Validators.required],
      rate: ['', Validators.required],
      status: [1],
      is_default: [2, [Validators.required]],
    })

  }


  // get the status form control
  get statusValue() {
    return this.form.get("status").value;
  }

  get isDefaultValue() {
    return this.form.get("is_default").value;
  }

  onSubmit() {
    if(this.form.get('name_ar').value == "" || this.form.get('currency_symbol_ar').value == ""){
      this.form.controls['name_ar'].setValue(this.form.get('name_en').value)
      this.form.controls['currency_symbol_ar'].setValue(this.form.get('currency_symbol_en').value)
    }
   else if(this.form.get('name_en').value == "" || this.form.get('currency_symbol_en').value == ""){  
      this.form.controls['name_en'].setValue(this.form.get('name_ar').value)
      this.form.controls['currency_symbol_en'].setValue(this.form.get('currency_symbol_ar').value)
    } 
    this.addLoading = true;
    let body = this.mapDataBeforeRequest();

    this.subscription.add(
      this.currencies.addCurrency(body).subscribe(res => {
        this.addLoading = false;
        this.formErrors = {};
        this.dialog.close(true);
      }, error => {
        if (error.status == 422) {
          this.formErrors = error?.error;
        }
        this.addLoading = false;
      })
    )
  }

  mapDataBeforeRequest() {
    let formVal = this.form.value;
    const body = {
      ...formVal,
      status: this.data.update ? formVal.status ? 1 : 2 : 1,
      id: this.data.data?.id,
      is_default: this.data.update ? this.data.data.is_default : 2
    }

    if (!this.data.update) {
      delete body.id
    }

    return body
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
        this.nameofArabic = true
      }
  }
}
