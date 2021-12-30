import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MomentDateAdapter } from '@angular/material-moment-adapter';
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute } from "@angular/router";
import * as moment from "moment";
import {
  CountryISO,
  SearchCountryField,
} from "ngx-intl-tel-input";
import { ToastrService } from 'ngx-toastr';
import { Subscription } from "rxjs";
import { MY_FORMATS } from 'src/app/modules/datePicker';
import { TranslationService } from 'src/app/modules/i18n/translation.service';
import { Parent } from "../../models/father/parent";
import { ParentsService } from '../../service/parents.service';
import { ConfirmDialogMassageComponent } from '../confirm-dialog-massage/confirm-dialog-massage.component';
@Component({
  selector: 'app-father',
  templateUrl: './father.component.html',
  styleUrls: ['./father.component.scss'],
  providers: [
    { provide: DateAdapter, useClass: MomentDateAdapter, deps: [MAT_DATE_LOCALE] },
    { provide: MAT_DATE_FORMATS, useValue: MY_FORMATS },
  ],
})
export class FatherComponent implements OnInit {
  @Input() dataParents: Parent;
  @Input() parent_file_id;
  @Input() countries
  @Input() isUserAdd
  @Input() formErrors
  @Input() countryName: string;
  @Input() set markAsParentSelected(val: any) {
    this.markAsParent = val;
  }
  @Output() familyFileId = new EventEmitter();
  @Output() nextTab = new EventEmitter();
  @Output() changeData = new EventEmitter();
  isUserEdit: boolean;
  userAdd: boolean;
  editFather: boolean;
  markAsParent: any;
  // formErrors;
  disableInput: boolean = true;
  form: FormGroup;
  is_dead: boolean;
  separateDialCode = false;
  SearchCountryField = SearchCountryField;
  CountryISO = CountryISO;
  labelPosition;
  subscription : Subscription = new Subscription();
  constructor
    (
      private fb: FormBuilder,
      private parentsServices: ParentsService,
      private toaster: ToastrService,
      public lang: TranslationService,
      private matDialog: MatDialog,
      private router: ActivatedRoute
    ) { }

  ngOnChanges(e) {
    this.patchValues();
  }
  ngOnInit(): void {
    this.labelPosition = this.lang.getSelectedLanguage() == 'ar' ? 'before' : 'after'
    this.initForm();
    this.createFamilyFile();
    this.checkIsEdit();
    this.subscription.add(
      this.form.valueChanges.subscribe(res => {
        this.changeData.emit({ data: this.prepareDataBeforePost(this.form.value), type: 'father', isFirstAdd: false })
      })
    )
  }

  patchValues() {
    setTimeout(() => {
      if (this.dataParents) {
        this.form.patchValue({
          ...this.dataParents,
          mark_as_parent: (this.dataParents?.mark_as_parent) ? true : false,
          is_dead: (this.dataParents?.is_dead) ? true : false,
          status: (this.dataParents?.status == 1) ? true : false,
          in_black_list: (this.dataParents?.in_black_list) ? true : false,
          stop_dealing: (this.dataParents?.stop_dealing) ? true : false,
          is_affiliates: (this.dataParents?.is_affiliates) ? true : false
        }, { emitEvent: false, onlySelf: true })
      } else {
        this.form.reset();
      }
    });
  }

  initForm() {
    this.form = this.fb.group({
      id: [0, [Validators.required]],
      identification_number: ['', [Validators.required]],
      mark_as_parent: [false, { validators: [Validators.required], updateOn: 'change' }],
      is_dead: ['', { updateOn: 'change' }],
      name_ar: ['', [Validators.required]],
      name_en: ['',[Validators.required]],
      father_name_ar: [''],
      father_name_en: [''],
      grandfather_name_ar: [''],
      grandfather_name_en: [''],
      family_name_ar: [''],
      family_name_en: [''],
      is_affiliates: [''],
      country_id: [''],
      // is_affiliates :  ['' ],
      employer_ar: [''],
      employer_en: [''],
      job_title_ar: [''],
      job_title_en: [''],
      address_ar: [''],
      address_en: [''],
      p_o_box: [''],
      postal_code: [''],
      home_phone: [''],
      home_phone_country: [''],
      work_phone: [''],
      work_phone_country: [''],
      mobile: [''],
      mobile_country: [''],
      email: [''],
      status: [''],
      in_black_list: [''],
      stop_dealing: [''],
      note_ar: [''],
      note_en: [''],
      nationality_id: ['', [Validators.required]],
      parents_file_id: [''],
      identity_date: [''],
      identity_source: ['']
    }, { updateOn: 'blur' })
    // this.form.disable();

  }

  get checkIfDeaded() {
    return this.form.get('is_dead').value
  }

  get isParent() {
    return this.form.get('mark_as_parent').value
  }

  createFamilyFile() {
    if (!this.parent_file_id) {
      const body = {
        "id": 0,
        "father_id": null,
        "mother_id": null,
        "relative_id": null,
        "relative_relation_id": null,
        "parent_id": null,
        "lat": null,
        "lng": null,
        "status": 1
      }
      this.subscription.add(
        this.parentsServices.createFamilyFile(body).subscribe((res: any) => {
          this.form.get('parents_file_id').setValue(res?.items.id);
          this.toaster.success('عملية ناجحة');
          this.familyFileId.emit(res?.items.id);
          this.userAdd = true;
        })
      )
      
    }
  }

  Submit() {
    this.updateFatherData();
  }

  matchingIdNumber(value) {
    this.parentsServices.getDataById(value).subscribe((res: any) => {
      if (res.code == 200) {
        const dialogRef = this.matDialog.open(ConfirmDialogMassageComponent, {
          width: '500px',
          data: {
            message: 'common.changeStatusMessage',
            updateStatus: true,
          }
        })
        this.subscription.add(
          dialogRef.afterClosed().subscribe(result => {
            if (result) {
              this.form.patchValue({
                ...res?.item,
                mark_as_parent: (res?.item.mark_as_parent == 1) ? true : false,
                is_dead: (res?.item.is_dead == 1) ? true : false,
                status: (res?.item.status == 1) ? true : false,
                in_black_list: (res?.item.in_black_list == 1) ? true : false,
                stop_dealing: (res?.item.stop_dealing == 1) ? true : false,
                is_affiliates: (res?.item.is_affiliates == 1) ? true : false
              })
            }
          })
        )
      }
    })
  }

  updateFatherData() {
    const body = this.prepareDataBeforePost(this.form.value);    
    body.parents_file_id = this.parent_file_id;
    // body.identity_date = this.form.value.identity_date ? moment(this.form.value.identity_date).format('DD/MM/YYYY') : null; For now 
    

    this.subscription.add(
      this.parentsServices.updateParents(this.removeNullValues(body)).subscribe((res: any) => {
        this.toaster.success(res?.message);
        this.formErrors = {};
        this.dataParents = res?.items
        this.changeData.emit({ data: this.dataParents, type: 'father', isFirstAdd: this.userAdd })
      }, error => {
        this.formErrors = error?.error;
      }
      )
    )
  }

  prepareDataBeforePost(data) {
    data.identity_date = data.identity_date ? moment(this.form.value.identity_date).format('YYYY-MM-DD') : null;
    this.checkIfCountryCodeSelected(data);
    // Delete identity_date for now 
    delete data.identity_date
    
    const father = {
      ...data,
      gender: 'Male',
      home_phone: !data?.home_phone?.number ? data?.home_phone : data?.home_phone?.number,
      mobile: !data?.mobile?.number ? data?.mobile : data?.mobile?.number,
      work_phone: !data?.work_phone?.number ? data?.work_phone : data?.work_phone?.number,
      // country_id: 1,
      status: 1,
    }

    return this.removeNullValues(father);
  }

  // If country code selected choose countryFlag if not use countryCode of ipAddress endpoint result  
  checkIfCountryCodeSelected(data){
    if(!data?.home_phone?.number && !data?.home_phone){
      data.home_phone_country = null;
    } else {
      data.home_phone_country = !data?.home_phone?.number ? data?.home_phone_country : data?.home_phone?.countryCode;
    }

    if(!data?.mobile?.number && !data?.mobile){
      data.mobile_country = null;
    } else {
      data.mobile_country = !data?.mobile?.number ? data?.mobile_country : data?.mobile?.countryCode;
    }

    if(!data?.work_phone?.number && !data?.work_phone){
      data.work_phone_country = null;
    } else {
      data.work_phone_country = !data?.work_phone?.number ? data?.work_phone_country : data?.work_phone?.countryCode;
    }
  }

  removeNullValues(obj) {
    Object.keys(obj).forEach(key => {
        if (!obj[key] && key != 'mark_as_parent') {
            delete obj[key];
        }
    });
    return obj;
}

  checkIsEdit(edit?) {
    if (this.router.snapshot.queryParams?.edit) {
      this.isUserEdit = this.router.snapshot.queryParams?.edit == 'true' || edit ? true : false;
    } else {
      this.userAdd = true;
    }
    this.checkIfUserEditOrAdd();
  }

  checkIfUserEditOrAdd() {
    this.disableInput = this.userAdd || this.isUserEdit ? true : false;
    if (!this.isUserEdit && !this.userAdd) {
      this.form.disable();
    } else {
      this.form.enable();
    }
  }

  next(){
    this.nextTab.emit('mother');
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

}
