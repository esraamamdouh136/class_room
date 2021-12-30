import {ChangeDetectorRef, Component, Inject, OnInit, ViewChild} from '@angular/core';
import {FormBuilder, FormGroup, NgForm, Validators} from '@angular/forms';
import {MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';


import {tap} from 'rxjs/operators';
import { Subscription } from 'rxjs';
import {ToastrService} from 'ngx-toastr';
import {CaseStudiesService} from 'src/app/modules/financial-setting/services/case-studies/case-studies.service';
import { TranslationService } from 'src/app/modules/i18n/translation.service';
import { TranslateService } from '@ngx-translate/core';

@Component({
    selector: 'app-dialog-add-and-edit',
    templateUrl: './add-edit-case-study.component.html',
    styleUrls: ['./add-edit-case-study.component.scss']
})
export class AddAndEditComponent implements OnInit {
    formErrors;
    form: FormGroup;
    subscription: Subscription = new Subscription();
    
    nameOfEnglish : boolean;
    nameofArabic : boolean;

    language:string;


    constructor(
        private caseStudiesService: CaseStudiesService,
        @Inject(MAT_DIALOG_DATA) public data,
        private dialog: MatDialogRef<AddAndEditComponent>,
        private toaster: ToastrService,
        private _FormBuilder: FormBuilder,
        public translation: TranslationService,
        private translate : TranslateService
    ) {
    }

    ngOnInit(): void {
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
    initForm() {
        this.form = this._FormBuilder.group({
            name_ar: ['', Validators.required],
            name_en: ['', Validators.required],
            status: [1],
        });
    }

    // get the status form control
    get statusValue() {
        return this.form.get('status').value;
    }


    submit() {
      if(this.form.get('name_ar').value == undefined || this.form.get('name_ar').value == ""){
        this.form.controls['name_ar'].setValue(this.form.get('name_en').value)
      }
     else if(this.form.get('name_en').value == undefined || this.form.get('name_en').value == ""){  
        this.form.controls['name_en'].setValue(this.form.get('name_ar').value)
      } 
        const body = this.prePost(this.form.value);
        this.subscription.add(
        this.caseStudiesService.editStudies(body).pipe(
            tap(() => this.dialog.close(true))
        ).subscribe((res: any) => {
                this.toaster.success(res.message);
            },
            err => {
                this.formErrors = err?.error;
            }))
    }

    prePost(formVal) {
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

    ngOnDestroy() {
        this.subscription.unsubscribe();
    }

}
