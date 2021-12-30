import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MomentDateAdapter } from '@angular/material-moment-adapter';
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material/core';
import { ActivatedRoute } from "@angular/router";
import * as moment from "moment";
import { CountryISO, SearchCountryField } from 'ngx-intl-tel-input';
import { ToastrService } from 'ngx-toastr';
import { Subscription } from "rxjs";
import { map, switchMap } from "rxjs/operators";
import { MY_FORMATS } from 'src/app/modules/datePicker';
import { TranslationService } from 'src/app/modules/i18n/translation.service';
import { ParentsService } from '../../service/parents.service';

@Component({
  selector: 'app-mother',
  templateUrl: './mother.component.html',
  styleUrls: ['./mother.component.scss'],
  providers: [
    { provide: DateAdapter, useClass: MomentDateAdapter, deps: [MAT_DATE_LOCALE] },
    { provide: MAT_DATE_FORMATS, useValue: MY_FORMATS },
  ],
})
export class MotherComponent implements OnInit {
  @Input() dataParents;
  @Input() countries;
  @Input() parent_file_id;
  @Input() isUserAdd
  @Input() formErrors
  @Input() countryName: string;
  @Input() set markAsParentSelected(val: any) {
    this.markAsParent = val;
  }
  @Output() changeData = new EventEmitter();
  @Output() nextTab = new EventEmitter();

  isUserEdit: boolean;
  userAdd: boolean;
  editFather: boolean;
  markAsParent: any;
  form: FormGroup;
  disableInput: boolean = false;
  separateDialCode = false;
  SearchCountryField = SearchCountryField;
  CountryISO = CountryISO;
  preferredCountries: CountryISO[] = [
    CountryISO.UnitedStates,
    CountryISO.UnitedKingdom
  ];
  labelPosition;
  subscription: Subscription = new Subscription();


  constructor
    (
      private fb: FormBuilder,
      private parentsServices: ParentsService,
      public lang: TranslationService,
      private toaster: ToastrService,
      private router: ActivatedRoute

    ) { }

  ngOnChanges() {
    this.patchValue()
  }
  ngOnInit(): void {
    this.labelPosition = this.lang.getSelectedLanguage() == 'ar' ? 'before' : 'after'
    this.initForm()
    this.checkIsEdit();
    this.subscription.add(
      this.form.valueChanges.subscribe(res => {
        this.changeData.emit({ data: this.prepareDataBeforePost(this.form.value), type: 'mother', isFirstAdd: false })
      })
    )
  }

  patchValue() {
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
      id: ['', [Validators.required]],
      identification_number: ['', [Validators.required]],
      mark_as_parent: [false, { updateOn: 'change' }],
      is_dead: ['', { updateOn: 'change' }],
      name_ar: ['', [Validators.required]],
      name_en: ['', [Validators.required]],
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
    this.form.disable();

  }

  get checkIfDeaded() {
    return this.form.get('is_dead').value
  }

  get isParent() {
    return this.form.get('mark_as_parent').value
  }


  Submit() {
    const body = this.prepareDataBeforePost(this.form.value);
    body.parents_file_id = this.parent_file_id;

    // body.identity_date = this.form.value.identity_date ? moment(this.form.value.identity_date).format('DD/MM/YYYY') : null; For now

    this.subscription.add(
      this.parentsServices.updateParents(this.removeNullValues(body)).subscribe((res: any) => {
        this.toaster.success(res?.message);
        this.dataParents = res?.items
        this.changeData.emit({ data: this.dataParents, type: 'mother' })
        this.formErrors = {}
      }, error => {
        this.formErrors = error?.error;
      }
      )
    )
  }

  checkIfUserEditOrAdd() {
    this.disableInput = this.userAdd || this.isUserEdit ? true : false;
    if (!this.isUserEdit && !this.userAdd) {
      this.form.disable();
    } else {
      this.form.enable();
    }
  }

  prepareDataBeforePost(data) {
    data.identity_date = data.identity_date ? moment(this.form.value.identity_date).format('YYYY-MM-DD') : null;
    this.checkIfCountryCodeSelected(data);
    // Delete identity_date for now 
    delete data.identity_date

    const mother = {
      ...data,
      gender: 'Female',
      home_phone: !data?.home_phone?.number ? data?.home_phone : data?.home_phone?.number,
      mobile: !data?.mobile?.number ? data?.mobile : data?.mobile?.number,
      work_phone: !data?.work_phone?.number ? data?.work_phone : data?.work_phone?.number,
      status: 1,
    }

    return this.removeNullValues(mother);
  }

  // If country code selected choose countryFlag if not use countryCode of ipAddress endpoint result  
  checkIfCountryCodeSelected(data) {
    if (!data?.home_phone?.number && !data?.home_phone) {
      data.home_phone_country = null;
    } else {
      data.home_phone_country = !data?.home_phone?.number ? data?.home_phone_country : data?.home_phone?.countryCode;
    }

    if (!data?.mobile?.number && !data?.mobile) {
      data.mobile_country = null;
    } else {
      data.mobile_country = !data?.mobile?.number ? data?.mobile_country : data?.mobile?.countryCode;
    }

    if (!data?.work_phone?.number && !data?.work_phone) {
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

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
}
