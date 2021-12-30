import { Component, EventEmitter, Input, OnInit, Output, SimpleChanges } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from "@angular/forms";
import { ActivatedRoute, Router } from "@angular/router";
import { TranslateService } from "@ngx-translate/core";
import * as moment from "moment";
import { SearchCountryField, CountryISO } from "ngx-intl-tel-input";
import { ToastrService } from "ngx-toastr";
import { Subscription } from "rxjs";
import { startWith, debounceTime, distinctUntilChanged, map, switchMap } from "rxjs/operators";
import { TranslationService } from "src/app/modules/i18n/translation.service";
import { ListsService } from "src/app/shared/services/list_Service/lists.service";
import { SharedService } from "src/app/shared/services/shared.service";
import { ParentsService } from "../../../parents/service/parents.service";
import { StudentsService } from "../../services/students/students.service";

@Component({
  selector: 'app-add-edit-student',
  templateUrl: './add-edit-student.component.html',
  styleUrls: ['./add-edit-student.component.scss']
})
export class AddEditStudentComponent implements OnInit {
  studentData
  parentsFiles = [];
  semsters = [];
  classRooms = [];
  relations;
  caseStudies;
  parent_file_id;
  countryName: string;
  gender = [
    {
      name: this.translateService.instant('general.male'),
      id: 'Male'
    },
    {
      name: this.translateService.instant('general.female'),
      id: 'Female'
    }
  ];
  isEdit: boolean;
  formErrors;
  form: FormGroup;
  separateDialCode = false;
  SearchCountryField = SearchCountryField;
  CountryISO = CountryISO;
  preferredCountries: CountryISO[] = [
    CountryISO.UnitedStates,
    CountryISO.UnitedKingdom
  ];
  subscription: Subscription = new Subscription();
  // Header data
  selectedFiscalYearId: any;
  selectedMotherCompanyNumber: any;
  selectedConstCenterNumber: any;

  constructor(
    private fb: FormBuilder,
    private _shredService: SharedService,
    private _listsService: ListsService,
    private studentsService: StudentsService,
    private router: Router,
    private toaster: ToastrService,
    private activateRoute: ActivatedRoute,
    private translateService: TranslateService,
  ) {
    this.setFormValuesIfEdit();
  }


  ngOnInit(): void {
    this.initForm();
    this.getInitialData();
    this.getUserCountry();
    this.filterFathersAutoCompleteOptions();

  }
  initForm() {
    this.form = this.fb.group({
      name_ar: ['', [Validators.required]],
      name_en: ['', [Validators.required]],
      classroom_id: [null],
      semster_id: [null],
      case_study_id: [null],
      gender: [null, [Validators.required]],
      phone: [''],
      phone_country: [''],
      email: [''],
      status: [''],
      relative_id: [''],
      register_date: [''],
      register_status: [''],
      parents_file_id: ['']
    })
    if (this.isEdit && this.studentData?.id) {
      this.form.patchValue(this.studentData);
      const parentFile = {
        full_name: `${this.studentData?.father?.name_ar} ${this.studentData?.father?.father_name_ar ? this.studentData?.father?.father_name_ar : ''}` ,
        id: this.studentData?.parents_file_id,
        name: this.studentData?.father?.name_ar,
      }
      this.form.get('parents_file_id').setValue(parentFile);
    }
  }


  displayFatherFn(node): string {
    return node && node.full_name ? node.full_name : '';
  }


  // Auto complete Fathers
  filterFathersAutoCompleteOptions() {
    this.subscription.add(
      this.form.get('parents_file_id').valueChanges.pipe(
        startWith(''),
        debounceTime(400),
        distinctUntilChanged(),
        map(value => {
          return typeof value === 'string' ? value : value.name
        }),
        switchMap(val => {
          return this._listsService.getParentsAutoComplete(this.selectedMotherCompanyNumber, val)
        })
      ).subscribe((res: any) => {
        this.parentsFiles = res?.items;
      })
    )
  }

  submit() {
    const body = this.prepareDataBeforePost(this.form.value);

    this.subscription.add(
      this.studentsService.addEditStudent(body)
        .subscribe(
          (res) => {
            if (res.code === 200) {
              this.router.navigate(['/financial-operations/students']);
            } 
          }
        , error => {
          if (error.status === 422) {
            this.formErrors = error?.error;
          }
        })
    )
  }


  prepareDataBeforePost(data) {
    data.register_date = data.register_date ? moment(this.form.value.register_date).format('DD/MM/YYYY') : null;

    if (!data?.phone?.number && !data?.phone) {
      data.phone_country = null;
    } else {
      data.phone_country = !data?.phone?.number ? data?.phone_country : data?.phone?.countryCode;
    }

    let body = {
      ...data,
      phone: data?.phone?.number,
      parents_file_id: data?.parents_file_id?.id ,
      id: this.studentData?.id,
      status: 1
    }

    for (const [key, value] of Object.entries(body)) {
      if (!value) {
        delete body[key];
      }
    }
    return body
  }

  setFormValuesIfEdit() {
    // if (this.activateRoute.snapshot?.params?.id) {
    //   this.form.patchValue(this.studentData);
    // }
    this.activateRoute.queryParams.subscribe(res => {
      this.isEdit = res?.edit ? true : false
      this.studentData = this.router.getCurrentNavigation()?.extras?.state;

    });
  }

  getInitialData() {
    this.subscription.add(
      this._shredService.navChanged$.subscribe(data => {
        if (data) {
          this.selectedFiscalYearId = data?.fiscalYear;
          this.selectedMotherCompanyNumber = data?.companyNum;
          this.selectedConstCenterNumber = data?.costCenter;
          this.getClassRooms();
          this.getSemsters();
          this.getCaseStudies();
        }
      })
    );
  }

  getSemsters() {
    this.subscription.add(this._listsService.getSemster(this.selectedMotherCompanyNumber, this.selectedConstCenterNumber, this.selectedFiscalYearId).subscribe((res: any) => {
      this.semsters = res.items;
    }));
  }

  getClassRooms() {
    this.subscription.add(this._listsService.getClassRoomsList(this.selectedMotherCompanyNumber, this.selectedConstCenterNumber).subscribe((res: any) => {
      this.classRooms = res.items;
    }));
  }

  getCaseStudies() {
    this.subscription.add(this._listsService.getCaseStudies(this.selectedMotherCompanyNumber, this.selectedConstCenterNumber).subscribe((res: any) => {
      this.caseStudies = res?.items;
    }));
  }

  getUserCountry() {
    this._shredService.getIPAddress().subscribe((res: any) => {
      this.countryName = res.countrycode.toLocaleLowerCase();
    });
  }


  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
}
