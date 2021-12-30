import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from "@angular/forms";
import { StudyYearsService } from "src/app/modules/financial-setting/services/studeyYears/studey-years.service";
import { SharedService } from "src/app/shared/services/shared.service";
import * as moment from 'moment';
import * as momentHijri from 'moment-hijri';
import { Subscription } from "rxjs";
import { NgbCalendar, NgbCalendarIslamicUmalqura, NgbDatepickerI18n, NgbDateStruct } from "@ng-bootstrap/ng-bootstrap";
import { HijriDatePickerService } from "src/app/shared/services/Hijri-datePicker/hijri-date.service";
import { distinctUntilChanged } from 'rxjs/operators';
import { ActivatedRoute, Router } from "@angular/router";
import { convertArabicDigitsToEnglish } from "src/app/shared/components/ag-grid/only-english-numbers/only-english-numbers";
import { HttpErrorResponse } from "@angular/common/http";

@Component({
  selector: 'app-add-study-year',
  templateUrl: './add-study-year.component.html',
  styleUrls: ['./add-study-year.component.scss'],
  providers: [
    { provide: NgbCalendar, useClass: NgbCalendarIslamicUmalqura },
    { provide: NgbDatepickerI18n, useClass: HijriDatePickerService }
  ]
})
export class AddStudyYearComponent implements OnInit {
  form: FormGroup;
  errors = [];
  formErrors:any = {};
  subscription: Subscription = new Subscription();
  model: NgbDateStruct;
  yearId;
  hijriDateOptions = {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  };
  dateType = "ar-SA";


  constructor(
    private fb: FormBuilder,
    private _studyYears: StudyYearsService,
    private _sharedService: SharedService,
    private calendar: NgbCalendar,
    private activateRoute: ActivatedRoute,
    private router: Router,
  ) { }

  ngOnInit(): void {
    this.initForm();
    this.listenToDateChange();
    this.yearId = this.activateRoute.snapshot.queryParams?.id;
    if (this.yearId) {
      this.getYearDetails(this.yearId);
    }
  }

  initForm() {
    this.form = this.fb.group({
      title: ['', Validators.required],
      title_trans: this.fb.group({
        en: ['']
      }),
      seasons: this.fb.array([
        this.fb.group(
          {
            title: ['', Validators.required],
            title_trans: this.fb.group({
              en: ['']
            }),
            sort_order: ['', Validators.required],
            starts_at: ['', Validators.required],
            starts_at_hijri: ['', Validators.required],
            ends_at: ['', Validators.required],
            ends_at_hijri: ['', Validators.required],
          },
        ),
        this.fb.group(
          {
            title: ['', Validators.required],
            title_trans: this.fb.group({
              en: ['']
            }),
            sort_order: ['', Validators.required],
            starts_at: ['', Validators.required],
            starts_at_hijri: ['', Validators.required],
            ends_at: ['', Validators.required],
            ends_at_hijri: ['', Validators.required],
          },
        ),
        this.fb.group(
          {
            title: ['', Validators.required],
            title_trans: this.fb.group({
              en: ['']
            }),
            sort_order: ['', Validators.required],
            starts_at: ['', Validators.required],
            starts_at_hijri: ['', Validators.required],
            ends_at: ['', Validators.required],
            ends_at_hijri: ['', Validators.required],
          },
        ),
      ])
    })
  }

  /**
   * Get years details
   * @param id 
   */
  getYearDetails(id) {
    this._studyYears.getStudyYearDetails(id).subscribe(res => {
      // this.selectedYear = res.data;
      this.form.patchValue(res.data);
    })
  }

  listenToDateChange() {
    const seasons = this.form.get('seasons') as FormArray;
    momentHijri.locale('en');

    seasons.controls[0].get('starts_at').valueChanges.subscribe(val => {
      const date = momentHijri(val);
      const hijriData =  {
        "year": date.iYear(),
        "month": date.iMonth(),
        "day": date.iDate()
      }
      
      seasons.controls[0].get('starts_at_hijri').setValue(hijriData);
    })

    seasons.controls[0].get('ends_at').valueChanges.subscribe(val => {
      const date = momentHijri(val);
      const hijriData =  {
        "year": date.iYear(),
        "month": date.iMonth(),
        "day": date.iDate()
      }
      
      seasons.controls[0].get('ends_at_hijri').setValue(hijriData);
    })
    // ----------------
    seasons.controls[1].get('starts_at').valueChanges.subscribe(val => {
      const date = momentHijri(val);
      const hijriData =  {
        "year": date.iYear(),
        "month": date.iMonth(),
        "day": date.iDate()
      }
      seasons.controls[1].get('starts_at_hijri').setValue(hijriData);
    })

    seasons.controls[1].get('ends_at').valueChanges.subscribe(val => {
        const date = momentHijri(val);
      const hijriData =  {
        "year": date.iYear(),
        "month": date.iMonth(),
        "day": date.iDate()
      }
      seasons.controls[1].get('ends_at_hijri').setValue(hijriData);
    })
    // -----------------

    // ----------------
    seasons.controls[2].get('starts_at').valueChanges.subscribe(val => {
        const date = momentHijri(val);
      const hijriData =  {
        "year": date.iYear(),
        "month": date.iMonth(),
        "day": date.iDate()
      }
      seasons.controls[2].get('starts_at_hijri').setValue(hijriData);
    })

    seasons.controls[2].get('ends_at').valueChanges.subscribe(val => {
        const date = momentHijri(val);
      const hijriData =  {
        "year": date.iYear(),
        "month": date.iMonth(),
        "day": date.iDate()
      }
      seasons.controls[2].get('ends_at_hijri').setValue(hijriData);
    })
    // -----------------
  }

  onSubmit() {
    this.prepareDataBeforePost();
    if (this.yearId) {
      this.editYear();
    } else {
      this.addYear();
    }
  }

  editYear() {
    const body = { ...this.form.value, yearId: +this.yearId }
    this.subscription.add(
      this._studyYears.updateStudyYear(body, this.yearId).subscribe(res => {
        this.errors = [];
        this.form.reset();
        this.router.navigate(['settings/general-ledger/semsters'])
      })
    )
  }

  addYear() {
    this.subscription.add(
      this._studyYears.addEditStudent(this.form.value).subscribe(res => {
        // console.log(res);
      
        if (res?.errors) {
          if(res.code == 115){
            this.errors = Object.keys(res?.errors).map(e => {
              // Scroll to top of parent component to show errors
              this._sharedService.scrollToTop.next(true);
              this.formErrors = {};
              return res?.errors[e];
            });
          } else if(res.code == 422){
            this.errors = [];
            this.formErrors = res.errors; 
          }
        } else {
          this.errors = [];
          this.form.reset();
          this.router.navigate(['settings/general-ledger/semsters'])
        }
      }, (error:HttpErrorResponse) => {
        if(error.status == 400){
          this.errors = [error.error.message];
          this.formErrors = {}; 
          this._sharedService.scrollToTop.next(true);
        }
      })
    )
  }

  // To map study years date to valid date 
  prepareDataBeforePost() {
    var arrayControl = this.form.get('seasons') as FormArray;
    // console.log(arrayControl);
    arrayControl.value.map((ele, index) => {
      ele.ends_at = ele.ends_at ? moment(ele.ends_at).format('YYYY-MM-DD') : '';
      ele.starts_at = ele.starts_at ? moment(ele.starts_at).format('YYYY-MM-DD') : '';
      ele.sort_order = `${index + 1}`;
      // Object.keys(ele).forEach(key => {
      //   if(!ele[key]){
      //     delete ele[key] 
      //   }
      // })
    });
    this.form.value.seasons = [this.form.value.seasons]
  }

  closeError() {
    this.errors = [];
  }

  // Hijri date 
  selectToday() {
    this.model = this.calendar.getToday();
  }

  getHijriDate() {
    const date = new Date();
    if (date.toDateString() !== "Invalid Date") {
      // date.toLocaleDateString(this.dateType, this.hijriDateOptions);
      // console.log(date.toLocaleDateString(this.dateType, this.hijriDateOptions));
    }
  }
}
