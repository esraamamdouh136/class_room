import { NgForm } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { AfterViewInit, ChangeDetectorRef, Component, Inject, OnInit, ViewChild } from '@angular/core';

import { BehaviorSubject, Subscription } from 'rxjs';
import { ToastrService } from 'ngx-toastr';
import { finalize, tap } from 'rxjs/operators';

import { RelativeRelation } from '../../../models/relative-relation/relative-relation';
import { RelativeRelationService } from '../../../services/relative-relation/relative-relation.service';
import { TranslationService } from 'src/app/modules/i18n/translation.service';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-add-edit-relation',
  templateUrl: './add-edit-relation.component.html',
  styleUrls: ['./add-edit-relation.component.scss']
})
export class AddEditRelationComponent implements OnInit, AfterViewInit {

  formErrors;
  addLoading = false;
  @ViewChild('form') form: NgForm;
  showLoading: BehaviorSubject<any> = new BehaviorSubject(false);
  subscription: Subscription = new Subscription();

  nameOfEnglish : boolean;
  nameofArabic : boolean;

  language:string;
  constructor(
    private toaster: ToastrService,
    private cdr: ChangeDetectorRef,
    @Inject(MAT_DIALOG_DATA) public data: RelativeRelation,
    private dialog: MatDialogRef<AddEditRelationComponent>,
    private relativeRelationService: RelativeRelationService,
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
    this.addLoading = true;
    this.editObj();
    this.subscription.add(
      this.relativeRelationService.addEditRelation(this.data)
      .pipe(
        tap(() => this.dialog.close(true)),
        finalize(() => this.addLoading = false)
      ).subscribe(
        (res) => {
          this.toaster.success(res.message);
        }, err => {

          this.formErrors = err?.error;
        })
    );
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
  
  editObj() {
    this.data.status = this.data.status_c ? 1 : 2;
  }
}
