import { AfterViewInit, ChangeDetectorRef, Component, Inject, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';


import { tap } from 'rxjs/operators';
import { Subscription } from 'rxjs';
import { ToastrService } from 'ngx-toastr';
import { SharedService } from 'src/app/shared/services/shared.service';
import { SpecialDiscountsComponent } from '../special-discounts.component';
import { SpecialDiscountsService } from 'src/app/modules/financial-setting/services/special-discounts/special-discounts.service';
import { TranslationService } from 'src/app/modules/i18n/translation.service';
import { TranslateService } from '@ngx-translate/core';
import { ListsService } from "src/app/shared/services/list_Service/lists.service";

@Component({
    selector: 'app-special-dialog',
    templateUrl: './add-edit-special-discount.component.html',
    styleUrls: ['./add-edit-special-discount.component.scss']
})
export class SpecialDialogComponent implements OnInit, AfterViewInit {
    listClassRooms: any;
    classRooms;
    formErrors;
    @ViewChild('form') form: NgForm;
    subscription: Subscription = new Subscription();
    selectedMotherCompanyNumber;
    selectedCostCenterNumber;
    newData;

    nameOfEnglish : boolean;
    nameofArabic : boolean;

    language:string;


    constructor(
        private specialDiscountsService: SpecialDiscountsService,
        @Inject(MAT_DIALOG_DATA) public data,
        private dialog: MatDialogRef<SpecialDiscountsComponent>,
        private toaster: ToastrService,
        private cdr: ChangeDetectorRef,
        private listsService: ListsService,
        private _shredService: SharedService,
        public translation: TranslationService,
        private translate : TranslateService
    ) {
    }

    ngOnInit(): void {
        setTimeout(() => {
            this.data.status_c = this.data?.status === 1;
            this.newData = JSON.parse(JSON.stringify(this.data));
        });

        this.getFormData();
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

    getFormData() {
        this.subscription.add(
            this._shredService.navChanged$.subscribe(data => {
                if (data) {
                    this.selectedMotherCompanyNumber = data?.companyNum;
                    this.selectedCostCenterNumber = data?.costCenter;
                    this.getListClassRooms();
                }
            })
        )
    }

    getListClassRooms() {
        this.subscription.add(
            this.listsService.getClassRoomsList(this.selectedMotherCompanyNumber, this.selectedCostCenterNumber).subscribe((res: any) => {
                this.listClassRooms = res?.items;
                this.classRooms = this.newData?.classrooms
                    ?.map(item => {
                        return {
                            id: item.id,
                            name: item.name
                        };
                    });
            }
            ))
    }

    compareFn(item, selected) {
        return item.id === selected.id;
    }

    submit() {
        if (this.newData.discount_percentage !== '') {
            this.newData.discount_value = '';
        }
        this.prePost();
        this.subscription.add(
            this.specialDiscountsService.editSpecialDoscounts(this.newData).subscribe((res: any) => {
                this.toaster.success(res?.message);
                this.dialog.close(true);
            },
                err => {
                    this.formErrors = err?.error;
                }))
    }

    prePost() {
        this.newData =
        {
            ...this.newData,
            classrooms: this.classRooms.map(e => e.id ? e.id : e),
            status: this.newData.status_c ? 1 : 2
        };
        if(this.newData.name_ar == undefined || this.newData.name_ar == ''){
            this.newData.name_ar = this.newData.name_en
          }
         else if(this.newData.name_en == undefined || this.newData.name_en == ''){  
            this.newData.name_en = this.newData.name_ar
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
