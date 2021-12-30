import {FormBuilder, FormGroup} from '@angular/forms';
import {Component, Inject, OnDestroy, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';

import {ToastrService} from 'ngx-toastr';
import {take} from 'rxjs/operators';
import {BehaviorSubject, forkJoin, Subscription} from 'rxjs';

import {Taxes} from '../../../models/taxes/taxes';
import {TaxesService} from '../../../services/taxes/taxes.service';
import {SharedService} from 'src/app/shared/services/shared.service';
import {GuideTree, Nationality} from '../../../../../shared/model/global';
import { TranslationService } from 'src/app/modules/i18n/translation.service';
import { TranslateService } from '@ngx-translate/core';
import { ListsService } from "src/app/shared/services/list_Service/lists.service";

@Component({
    selector: 'app-add-edit-taxes',
    templateUrl: './add-edit-taxes.component.html',
    styleUrls: ['./add-edit-taxes.component.scss']
})
export class AddEditTaxesComponent implements OnInit, OnDestroy {

    subscription: Subscription = new Subscription();
    nationalities: Nationality[] = [];
    guideTree: GuideTree[] = [];
    showLoading: BehaviorSubject<any> = new BehaviorSubject(false);
    formErrors;
    form: FormGroup;
    credit = [];
    debit = [];
    feesClasses = [];
    language:string;

    nameOfEnglish : boolean;
    nameofArabic : boolean;
    selectedCompanyNumber
    constructor(
        private fb: FormBuilder,
        private toaster: ToastrService,
        private taxesService: TaxesService,
        private listsService: ListsService,
        private sharedService: SharedService,
        @Inject(MAT_DIALOG_DATA) public data: Taxes,
        private dialog: MatDialogRef<AddEditTaxesComponent>,
        public translation: TranslationService,
        private translate : TranslateService
        ) {}

    ngOnInit(): void {
        this.initForm();
        this.getData();
        setTimeout(() => {
            this.data.status_c = this.data.status === 1;
        });
        // @ts-ignore
        this.data.taxFreeNationality = this.data.countries?.map(it => it.id);
        this.data.feesClassesValues = this.data.fees_classes?.map((e: any) => e.id);

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

    ngOnDestroy(): void {
        this.subscription.unsubscribe();
    }

    initForm() {
        this.form = this.fb.group({
            status: [true],
        });
    }

    getData(){
        this.getNationalities();
        this.getFeesClasses();
    }

    get statusValue() {
        return this.form.get('status').value;
    }

    getNationalities(): void {
        this.subscription.add(this.listsService
            .countries()
            .subscribe(
                (res) => {
                    this.nationalities = res?.items;
                }
            ));
    }

    getFeesClasses() {
        this.subscription.add(
            forkJoin([this.sharedService.selectedCompanyNumber$
                .pipe(take(1)), this.sharedService.selectedConstCenterId$.pipe(take(1))]).subscribe(res => {
                this.listsService.getFeesClasses(res[0], res[1]).subscribe(res2 => {
                    this.feesClasses = res2.items;
                });
            })
        )
    }

    mapAccountGuid(items) {
        return items?.map((item) => {
            item.viewLabel = item?.title + ' - ' + item?.code;
            return item;
        });
    }

    submit(): void {
        this.prePost();
        this.subscription.add(
            this.taxesService.addEditTax(this.data)
            .subscribe(
            (res) => {
                this.dialog.close(true);
                this.toaster.success(res.message);   
            }, err => {

                this.formErrors = err?.error;
            })
        )
    }

    prePost() {
        this.data.countries = this.data.taxFreeNationality;
        this.data.status = this.data.status_c ? 1 : 2;
        this.data.fees_classes = this.data.feesClassesValues;
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
            this.nameofArabic = true

        }
      }
}
