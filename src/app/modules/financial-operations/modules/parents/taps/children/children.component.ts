import { Component, EventEmitter, Input, OnInit, Output, SimpleChanges } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MomentDateAdapter } from '@angular/material-moment-adapter';
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material/core';
import { ActivatedRoute } from "@angular/router";
import { CountryISO, SearchCountryField } from 'ngx-intl-tel-input';
import { ToastrService } from "ngx-toastr";
import { Subscription } from 'rxjs';
import { MY_FORMATS } from 'src/app/modules/datePicker';
import { TranslationService } from 'src/app/modules/i18n/translation.service';
import { ParentsService } from '../../service/parents.service';
import * as moment from 'moment';

@Component({
  selector: 'app-children',
  templateUrl: './children.component.html',
  styleUrls: ['./children.component.scss'],
  providers: [
    { provide: DateAdapter, useClass: MomentDateAdapter, deps: [MAT_DATE_LOCALE] },
    { provide: MAT_DATE_FORMATS, useValue: MY_FORMATS },
  ],
})
export class ChildrenComponent implements OnInit {
  @Input() dataParents = []; // Students array
  @Input() semsters;
  @Input() classRooms;
  @Input() relations;
  @Input() parent_file_id;
  @Input() caseStudies;
  @Input() isUserAdd
  @Input() countryName: string;
  @Output() changeData = new EventEmitter();
  gender = [{ text: 'Male' }, { text: 'Female' }]
  isUserEdit: boolean;
  showAddChildren: boolean = true;
  userAdd: boolean;
  page: number = 1;
  total: number;
  selectedStudentId;
  formErrors;
  students
  form: FormGroup;
  currentUser: number = 1;
  separateDialCode = false;
  SearchCountryField = SearchCountryField;
  CountryISO = CountryISO;
  preferredCountries: CountryISO[] = [
    CountryISO.UnitedStates,
    CountryISO.UnitedKingdom
  ];
  subscription: Subscription = new Subscription();
  labelPosition;
  constructor(
    public lang: TranslationService,
    private parentsService: ParentsService,
    private fb: FormBuilder,
    private router: ActivatedRoute,
    private toaster: ToastrService,
  ) { }


  ngOnChanges(changes: SimpleChanges) {
    if(this.dataParents){
      this.patchFormValue(this.dataParents[0]);
    } else {
      this.dataParents = [];
    }
    this.currentUser = 1;
  }

  ngOnInit(): void {
    this.labelPosition = this.lang.getSelectedLanguage() == 'ar' ? 'before' : 'after'
    this.initForm();
    if (this.dataParents && this.dataParents.length) {
      this.patchFormValue(this.dataParents[0]);
    }
    this.checkIsEdit();
  }
  initForm() {
    this.form = this.fb.group({
      name_ar: ['', [Validators.required]],
      name_en: ['', [Validators.required]],
      classroom_id: [''],
      semster_id: [''],
      case_study_id: [''],
      gender: ['',[Validators.required]],
      phone: [''],
      phone_country: [''],
      email: [''],
      status: [''],
      relative_id: [''],
      register_date: [''],
      register_status: ['']
    })
  }

  patchFormValue(data) {
    if (this.dataParents?.length) {
      this.total = this.dataParents.length;
      this.selectedStudentId = data?.id;
      setTimeout(() => {
        this.form.patchValue(
          {
            ...data,
            status: (data?.status == 1) ? true : false,
            // register_date: moment(data?.register_date, 'DD.MM.YYYY').toDate()
          })
      });
    } else {
      this.initForm();
      this.form.reset();
    }
  }


  Submit() {
    const body = this.prepareDataBeforePost(this.form.value);
    this.subscription.add(
      this.parentsService.updateStudent(body).subscribe((res: any) => {
        this.toaster.success(res?.message);
        this.dataParents = this.dataParents ? this.dataParents : []
        if (!this.dataParents?.find(el => el.id == res?.items.id)) {
          this.dataParents.push(res?.items);
        } else {
          let index = this.dataParents.findIndex(el => el.id == res?.items.id);
          this.dataParents[index] = res?.items;
        }
        this.changeData.emit({ data: this.dataParents, type: 'child' })
        this.formErrors = {};
        this.selectedStudentId = res?.items?.id;
        this.showAddChildren = true;
        this.total = this.dataParents.length
      }, error => {
        this.formErrors = error?.error;
      })
    )
  }

  addChild() {
    this.showAddChildren = false;
    this.form.reset();
    this.selectedStudentId = undefined;
    this.currentUser = this.dataParents.length + 1;
    this.total++;
  }

  cancelAddChild() {
    this.showAddChildren = true;
    this.currentUser = 1;
    this.formErrors = {};
    this.patchFormValue(this.dataParents[0])
  }

  prepareDataBeforePost(data) {
    if (this.isUserEdit || this.selectedStudentId) {
      data.id = this.selectedStudentId
    }
    data.register_date = data.register_date ? moment(this.form.value.register_date).format('DD/MM/YYYY') : null;

    if(!data?.phone?.number && !data?.phone){
      data.phone_country = null;
    } else {
      data.phone_country = !data?.phone?.number ? data?.phone_country : data?.phone?.countryCode;
    }

    let body = {
      ...data,
      phone: data?.phone?.number,
      parents_file_id: this.parent_file_id,
      status: 1
    }

    for (const [key, value] of Object.entries(body)) {
      if(!value){
        delete body[key];
      }
    }

    return body
  }

  checkIfUserEditOrAdd() {
    if (!this.isUserEdit && !this.userAdd) {
      this.form.disable();
    } else {
      this.form.enable();
    }
  }

  checkIsEdit(edit?) {
    if (this.router.snapshot.queryParams?.edit) {
      this.isUserEdit = this.router.snapshot.queryParams?.edit == 'true' || edit ? true : false;
    } else {
      this.userAdd = true;
    }
    this.checkIfUserEditOrAdd();
  }

  next(): void {
    if (this.dataParents.findIndex(el => el.id == this.selectedStudentId) < this.dataParents.length - 1) {
      this.currentUser++
      let index = this.dataParents.findIndex(e => e.id == this.selectedStudentId);
      this.selectedStudentId = this.dataParents[index + 1]?.id;
      let data = this.dataParents.filter(el => el.id == this.selectedStudentId)[0];
      this.patchFormValue(data);
    }
  }

  previous(): void {
    if (this.dataParents.findIndex(el => el.id == this.selectedStudentId) !== 0) {
      this.currentUser--
      let index = this.dataParents.findIndex(e => e.id == this.selectedStudentId);
      this.selectedStudentId = this.dataParents[index - 1]?.id;
      let data = this.dataParents.filter(el => el.id == this.selectedStudentId)[0];
      this.patchFormValue(data);
    }
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
}
