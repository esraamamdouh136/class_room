import {AfterViewInit, ChangeDetectorRef, Component, Inject, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {ToastrService} from 'ngx-toastr';
import {TypesOfFeesService} from '../../../services/types-of-fees/types-of-fees.service';
import {TypesOfFees} from '../../../models/types-of-fees/types-of-fees';
import {BehaviorSubject, Subscription} from 'rxjs';
import {finalize, tap} from 'rxjs/operators';
import {NgForm} from '@angular/forms';
import { TranslationService } from 'src/app/modules/i18n/translation.service';
import { TranslateService } from '@ngx-translate/core';

@Component({
    selector: 'app-add-edit-fees',
    templateUrl: './add-edit-fees.component.html',
    styleUrls: ['./add-edit-fees.component.scss']
})
export class AddEditFeesComponent implements OnInit, AfterViewInit, OnDestroy {

    @ViewChild('form') form: NgForm;
    subscription: Subscription = new Subscription();
    formErrors: any;
    language:string;
    guidTree = [];

    nameOfEnglish : boolean;
    nameofArabic : boolean;

    constructor(
        private cdr: ChangeDetectorRef,
        @Inject(MAT_DIALOG_DATA) public data: TypesOfFees,
        private typesOfFeesService: TypesOfFeesService,
        private toaster: ToastrService,
        private dialog: MatDialogRef<AddEditFeesComponent>,
        public translation: TranslationService,
        private translate : TranslateService
        ) {
    }

    ngOnInit(): void {
        setTimeout(() => {
            this.data.status_c = this.data.status === 1;
        });
        this.defualtLanguageInputs();
    }
  
    defualtLanguageInputs(){
      console.log(this.translation.getSelectedLanguage())
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

    mapAccountGuid(items) {
        return items.map((item) => {
            item.viewLabel = item?.title + ' - ' + item?.code;
            return item;
        });
    }

    onSubmit(): void {
        this.prePost();
        this.subscription.add(this.typesOfFeesService.addEditTypesOfFees(this.data)
            .pipe(
                tap(() => this.dialog.close(true)),
            ).subscribe(
            (res) => {
                this.toaster.success(res.message);
            }, err => {

                this.formErrors = err?.error;
            }));
    }

    prePost() {
        this.data.status = this.data.status_c ? 1 : 2;
        if(this.data.name_ar == undefined){
            this.data.name_ar = this.data.name_en
          }
         else if(this.data.name_en == undefined){  
            this.data.name_en = this.data.name_ar
          }  
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
