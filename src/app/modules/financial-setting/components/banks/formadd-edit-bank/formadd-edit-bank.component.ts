import { Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';


import { ToastrService } from 'ngx-toastr';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { BankServiceService } from '../../../services/bank/bank-service.service';
import { Subscription } from 'rxjs';
import { TranslationService } from 'src/app/modules/i18n/translation.service';
import { TranslateService } from '@ngx-translate/core';
import { SharedService } from "src/app/shared/services/shared.service";
import { ListsService } from 'src/app/shared/services/list_Service/lists.service';
import { GuideTree } from 'src/app/shared/model/global';


@Component({
    selector: 'app-formadd-edit-bank',
    templateUrl: './formadd-edit-bank.component.html',
    styleUrls: ['./formadd-edit-bank.component.scss']
})
export class FormaddEditBankComponent implements OnInit, OnDestroy {

    formErrors;
    form: FormGroup;
    subscription: Subscription = new Subscription();
    nameOfEnglish: boolean;
    nameofArabic: boolean;
    language: string;
    guideTree: GuideTree[] = [];
    accountGuide: any;


    constructor(
        private bankService: BankServiceService,
        @Inject(MAT_DIALOG_DATA) public data,
        private dialog: MatDialogRef<FormaddEditBankComponent>,
        private toaster: ToastrService,
        private _FormBuilder: FormBuilder,
        public translateService: TranslationService,
        private translate: TranslateService,
        private lists: ListsService,
        private _sharedService: SharedService
    ) {
    }

    ngOnInit(): void {
        this.initForm();
        if (this.data.update) {
            this.form.patchValue(this.data.data);
        }

        this.subscription.add(
            this._sharedService.navChanged$.subscribe(data => {
                if (data) {
                    this.getAccontGuideTree(data.companyNum);
                }
            })
        );
        this.defualtLanguageInputs();
    }

    defualtLanguageInputs() {
        if (this.translateService.getSelectedLanguage() == 'ar') {
            this.language = this.translate.instant('MENU.en_language')
            this.nameOfEnglish = false;
            this.nameofArabic = true;
        }
        else {
            this.language = this.translate.instant('MENU.ar_language')
            this.nameOfEnglish = true;
            this.nameofArabic = false;
        }
    }

    getAccontGuideTree(company) {
        this.subscription.add(
            this.lists.getAccountGuideTree(company)
                .subscribe(
                    (res) => {
                        this.guideTree = res;
                        this.guideTree.splice(0, 1); // remove حسب الاختيار
                    }
                )
        );
    }


    initForm() {
        this.form = this._FormBuilder.group({
            name_ar: ['', Validators.required],
            name_en: ['', Validators.required],
            bank_fees_percentage: ['', Validators.required],
            bank_fees_tax_percentage: ['', Validators.required],
            account_guide_id: ['', Validators.required],
            status: [1],
        });
    }

    // get the status form control
    get statusValue() {
        return this.form.get('status').value;
    }


    submit() {
        const body = this.prePost(this.form.value);
        this.subscription.add(
            this.bankService.createNewBank(body).subscribe((res: any) => {
                this.dialog.close(true)
                this.toaster.success(res.message);
            },
                err => {
                    this.formErrors = err?.error;
                }))
    }

    prePost(formVal) {
        if(formVal.name_ar == '' || formVal.name_ar == undefined ){
           formVal.name_ar = formVal.name_en
          }
         else if(formVal.name_en == '' || formVal.name_en == undefined){  
            formVal.name_en = formVal.name_ar
        }  
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

    toggleLanguage() {
        if (this.nameofArabic == true) {
            this.language = this.translate.instant('MENU.ar_language')
            this.nameOfEnglish = true;
            this.nameofArabic = false;
        }
        else if (this.nameOfEnglish == true) {
            this.language = this.translate.instant('MENU.en_language')
            this.nameOfEnglish = false;
            this.nameofArabic = true;
        }
    }

    ngOnDestroy() {
        this.subscription.unsubscribe();
    }

}
