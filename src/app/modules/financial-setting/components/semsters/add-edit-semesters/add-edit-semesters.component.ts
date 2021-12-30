import {NgForm} from '@angular/forms';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {AfterViewInit, ChangeDetectorRef, Component, Inject, OnDestroy, OnInit, ViewChild} from '@angular/core';

import {Subscription} from 'rxjs';
import {ToastrService} from 'ngx-toastr';
import {tap} from 'rxjs/operators';
import {SemestersService} from '../../../services/semesters/semesters.service';
import { Semesters } from '../../../models/semester/semesters';
import { TranslationService } from 'src/app/modules/i18n/translation.service';
import { TranslateService } from '@ngx-translate/core';

@Component({
    selector: 'app-add-edit-semesters',
    templateUrl: './add-edit-semesters.component.html',
    styleUrls: ['./add-edit-semesters.component.scss']
})
export class AddEditSemestersComponent implements OnInit, AfterViewInit,OnDestroy {

    formErrors;
    @ViewChild('form') form: NgForm;
    subscription : Subscription = new Subscription();

    nameOfEnglish : boolean;
    nameofArabic : boolean;

    language:string;
    constructor(
        private cdr: ChangeDetectorRef,
        private toaster: ToastrService,
        private semestersService: SemestersService,
        @Inject(MAT_DIALOG_DATA) public data: Semesters,
        private dialog: MatDialogRef<AddEditSemestersComponent>,
        public translation: TranslationService,
        private translate : TranslateService
    ) {
    }

    ngOnInit(): void {
        setTimeout(() => {
            this.data.status_c = this.data.status === 1;
            this.data.start_at = new Date(this.data.start_at).toISOString();
            this.data.end_at = new Date(this.data.end_at).toISOString();
        });
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

    ngAfterViewInit(): void {
        this.cdr.detectChanges();
    }

    submit(): void {
        if(this.data.name_ar == undefined){
            this.data.name_ar = this.data.name_en
          }
         else if(this.data.name_en == undefined){  
            this.data.name_en = this.data.name_ar
          }  
        this.subscription.add(
            this.semestersService.addOrEditSemester(this.editObj())
            .pipe(
                tap(() => this.dialog.close(true)),
            ).subscribe(
            (res) => {
                this.toaster.success(res.message);
            }, err => {

                this.formErrors = err?.error;
            })
        );
    }

    editObj() {
        return {
            ...this.data,
            status: this.data.status_c ? 1 : 2,
            start_at: new Date(this.data.start_at).toLocaleDateString('en-GB'),
            end_at: new Date(this.data.end_at).toLocaleDateString('en-GB')
        };
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
