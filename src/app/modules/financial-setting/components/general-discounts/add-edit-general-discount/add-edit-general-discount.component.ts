import { ChangeDetectorRef, Component, Inject, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, NgForm, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';


import { Subscription } from 'rxjs';
import { tap } from 'rxjs/operators';
import { ToastrService } from 'ngx-toastr';
import { SharedService } from 'src/app/shared/services/shared.service';
import { GeneralDiscountsService } from 'src/app/modules/financial-setting/services/general-discounts/general-discounts.service';
import { TranslationService } from 'src/app/modules/i18n/translation.service';
import { TranslateService } from '@ngx-translate/core';
import { ListsService } from "src/app/shared/services/list_Service/lists.service";

@Component({
    selector: 'app-general-discounts-form',
    templateUrl: './add-edit-general-discount.component.html',
    styleUrls: ['./add-edit-general-discount.component.scss']
})
export class GeneralDiscountsFormComponent implements OnInit {
    listClassRooms: any;
    class_rooms;
    formErrors;
    discount_value: boolean = true;
    subscription: Subscription = new Subscription();
    selectedMotherCompanyNumber;
    selectedConstCenterNumber;
    form: FormGroup;
    classrooms;

    nameOfEnglish: boolean;
    nameofArabic: boolean;

    language: string;

    constructor
        (
            private generalDiscountsService: GeneralDiscountsService,
            @Inject(MAT_DIALOG_DATA) public data,
            private dialog: MatDialogRef<GeneralDiscountsFormComponent>,
            private toaster: ToastrService,
            private listsService: ListsService,
            private _shredService: SharedService,
            private _FormBuilder: FormBuilder,
            public translation: TranslationService,
            private translate: TranslateService
        ) {
    }

    ngOnInit(): void {
        // init form
        this.initForm();
        this.getFormData();
        if (this.data?.update) {
            this.classrooms = this.data?.data?.classrooms
            this.form.patchValue(this.data?.data);
        }
        this.defualtLanguageInputs();
    }

    defualtLanguageInputs() {
        if (this.translation.getSelectedLanguage() == 'ar') {
            this.language = this.translate.instant('MENU.en_language')
            this.nameOfEnglish = false;
            this.nameofArabic = true;
        }
        else if (this.translation.getSelectedLanguage() == 'en') {
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
            discount_percentage: [''],
            discount_value: [''],
            status: [1],
        });
    }

    // get the status form control
    get statusValue() {
        return this.form.get('status').value;
    }

    changeDiscountValue() {
        return this.form.get('discount_value').setValue('');
    }

    changeDiscountPercentage() {
        return this.form.get('discount_percentage').setValue('');
    }


    getFormData() {
        this.subscription.add(
            this._shredService.navChanged$.subscribe(data => {
                if (data) {
                    this.selectedMotherCompanyNumber = data?.companyNum;
                    this.selectedConstCenterNumber = data?.costCenter;
                    this.getListClassRooms();
                }
            })
        )
    }


    getListClassRooms() {
        this.subscription.add(
            this.listsService.getClassRoomsList(this.selectedMotherCompanyNumber, this.selectedConstCenterNumber)
                .subscribe(
                    (res: any) => {
                        this.listClassRooms = res?.items;
                    }
                ))
    }

    compareFn(item, selected) {
        return item.id === selected.id;
    }


    submit() {
        const body = this.prepareDataBeforePost(this.form.value);
        this.generalDiscountsService.editGeneralDoscounts(body).pipe(
            tap(() => this.dialog.close(true))
        ).subscribe((res: any) => {
            this.toaster.success(res.message);
        },
            err => {

                this.formErrors = err?.error;
            });
    }

    prepareDataBeforePost(formVal) {
        if (this.form.get('name_ar').value == undefined || this.form.get('name_ar').value == "") {
            this.form.controls['name_ar'].setValue(this.form.get('name_en').value)
        }
        else if (this.form.get('name_en').value == undefined || this.form.get('name_en').value == "") {
            this.form.controls['name_en'].setValue(this.form.get('name_ar').value)
        }
        const data = {
            ...formVal,
            status: this.data.update ? formVal.status ? 1 : 2 : 1,
            id: this.data.data?.id,
            classrooms: this.classrooms.map(e => e.id ? e.id : e)
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
