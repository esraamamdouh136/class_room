import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material/dialog";
import { TranslateService } from '@ngx-translate/core';
import { Subscription } from 'rxjs';
import { TranslationService } from 'src/app/modules/i18n/translation.service';

import { AreasService } from "../../../services/areas/areas.service";
import { BranchesService } from "../../../services/branches/branches.service";

@Component({
  selector: 'app-add-edit-area',
  templateUrl: './add-edit-area.component.html',
  styleUrls: ['./add-edit-area.component.scss']
})
export class AddEditAreaComponent implements OnInit {

  constructor(
    private _FormBuilder: FormBuilder, 
    @Inject(MAT_DIALOG_DATA) public data: any, 
    private dialog: MatDialogRef<AddEditAreaComponent>,
    private _areas: AreasService,
    private branchesService: BranchesService,
    public translation: TranslationService,
    private translate : TranslateService
  ) { }
  form: FormGroup;
  subscription: Subscription = new Subscription();

  nameOfEnglish : boolean;
  nameofArabic : boolean;

  language:string;

  ngOnInit(): void {
    // init form
    this.initForm();

    if (this.data.update) {
      this.form.patchValue(this.data.data);
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

  // initialize Form
  initForm() {
    this.form = this._FormBuilder.group({
      name_ar: ['', Validators.required],
      name_en: ['', Validators.required],
      status: [1],
    });
  }

  // get the status form control
  get statusValue() {
    return this.form.get("status").value;
  }

  onSubmit() {
    if(this.form.get('name_ar').value == undefined || this.form.get('name_ar').value == ""){
      this.form.controls['name_ar'].setValue(this.form.get('name_en').value)
    }
   else if(this.form.get('name_en').value == undefined || this.form.get('name_en').value == ""){  
      this.form.controls['name_en'].setValue(this.form.get('name_ar').value)
    } 
    const body = this.prepareDataBeforePost(this.form.value)
    this.subscription.add(
    this._areas.addArea(body).subscribe(res => {
      this.dialog.close(true);
    this.form.reset();
    }))
  }

  prepareDataBeforePost(formVal) {
    const data = {
      ...formVal,
      status: this.data.update ? formVal.status ? 1 : 2 : 1,
      id: this.data.data?.id
    };

    if (!this.data.update) {
      delete data.id;
    }
    return data;
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
