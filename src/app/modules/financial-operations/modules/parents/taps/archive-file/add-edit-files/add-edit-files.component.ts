import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from "@angular/forms";
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material/dialog";
import { FileUploadValidators } from "@iplab/ngx-file-upload";
import { TranslateService } from "@ngx-translate/core";
import { Subscription } from "rxjs";
import { TranslationService } from "src/app/modules/i18n/translation.service";
import { ParentsService } from "../../../service/parents.service";

@Component({
  selector: 'app-add-edit-files',
  templateUrl: './add-edit-files.component.html',
  styleUrls: ['./add-edit-files.component.scss']
})
export class AddEditFilesComponent implements OnInit {
  form: FormGroup;
  subscription: Subscription = new Subscription();
  nameOfEnglish: boolean;
  nameofArabic: boolean;
  formErrors;
  language: string;
  public fileUploadControl = new FormControl(null);

  constructor(
    private _FormBuilder: FormBuilder,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private dialog: MatDialogRef<AddEditFilesComponent>,
    public translation: TranslationService,
    private translate: TranslateService,
    private parents: ParentsService,
  ) { }

  ngOnInit(): void {
    this.initForm();

    if (this.data.update) {
      this.form.patchValue(this.data.data);
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
      title_ar: ['', Validators.required],
      title_en: ['', Validators.required],
      file: this.fileUploadControl,
    });
  }


  onSubmit() {
    if (this.form.get('title_ar').value == undefined || this.form.get('title_ar').value == "") {
      this.form.controls['title_ar'].setValue(this.form.get('title_en').value)
    }
    else if (this.form.get('title_en').value == undefined || this.form.get('title_en').value == "") {
      this.form.controls['title_en'].setValue(this.form.get('title_ar').value)
    }
    const body = this.prepareDataBeforePost(this.form.value)
    this.subscription.add(
      this.parents.uploadParentsFileAttashment(this.data.parent_file_id, body).subscribe(res => {
        this.dialog.close(true);
        this.form.reset();
      },error => {
        if(error.status == 422){
          this.formErrors = error.error
        }
      })
    )
  }

  prepareDataBeforePost(formVal) {
    const data = {
      ...formVal,
    };

    if (!this.data.update) {
      delete data.key;
    }

    if(!data.file){
      delete data.file;
    }

    const formData = new FormData();

    for (const key in data) {
      if (key === 'file' && this.form.value.file) {
        this.form.value.file.forEach(el => {
          formData.append('path', el)
        });
      }
      else {
        formData.append(key, this.form.value[key])
      }
    }
    if(this.data.update){
      formData.append('key',this.data.data?.key)
    }

    return formData;
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
      this.nameofArabic = true
    }
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

}
