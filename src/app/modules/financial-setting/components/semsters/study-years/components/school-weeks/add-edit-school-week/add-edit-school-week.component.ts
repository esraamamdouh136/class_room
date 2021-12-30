import * as moment from 'moment';
import {Subscription} from 'rxjs';
import { Component, Inject, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from "@angular/forms";
import { StudyYearsService } from "src/app/modules/financial-setting/services/studeyYears/studey-years.service";
import { Seasons } from "src/app/modules/financial-setting/models/study-years/StudyYears";
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material/dialog";
import { SharedService } from "src/app/shared/services/shared.service";

@Component({
  selector: 'app-add-edit-school-week',
  templateUrl: './add-edit-school-week.component.html',
  styleUrls: ['./add-edit-school-week.component.scss']
})
export class AddEditSchoolWeekComponent implements OnInit {
  weeks: FormArray;
  form: FormGroup;
  seasons:Seasons[] = [];
  scools;
  formErrors = []; // To show global errors
  formControlsErrors:any; // To show control's errors
  subscription: Subscription = new Subscription();
  constructor(
    private formBuilder: FormBuilder,
    private _studyYears: StudyYearsService,
    private shared : SharedService,
    @Inject(MAT_DIALOG_DATA) public data: any, 
    private dialog: MatDialogRef<AddEditSchoolWeekComponent>,
  ) { }

  ngOnInit(): void {
    this.getData();
    this.form = this.formBuilder.group({
      weeks: this.formBuilder.array([
        this.createItem()
      ])
    });
    this.fillData();
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  getData() {
    const body = {
      "require": [
        "seasons"
      ]
    }
    this.subscription.add(
      this._studyYears.getSeasons(body).subscribe(res => {
        this.seasons = res?.data[0];
      })
    )
  }

  createItem(): FormGroup {
    return this.formBuilder.group(
      {
        title: ['', Validators.required],
        season_id: [null, Validators.required],
        starts_at: ['', Validators.required],
        ends_at: ['', Validators.required],
      },
    );
  }

  addItem(): void {
    this.weeks = this.form.get('weeks') as FormArray;
    this.weeks.push(this.createItem());
  }

  remove(index) {
    this.weeks = this.form.get('weeks') as FormArray;
    this.weeks.removeAt(index);
  }

  fillData() {
    if (this.data.data) {
      const week = {
        title : this.data.data.title,
        season_id : this.data.data.season_id,
        starts_at : moment(this.data.data.starts_at, 'YYYY-MM-DD').toDate(),
        ends_at : moment(this.data.data.ends_at, 'YYYY-MM-DD').toDate(),
      }
      this.form.get('weeks').setValue([week]);
    }
  }

  onsubmit() {
    if(this.data.data?.id){
      const updateBody = this.prepareDataBeforeUpdate();
      this.updateStudyWeeks(updateBody);
    } else {
      const addBody = this.prepareDataBeforePost();
      this.addStudyWeeks(addBody);
    }
    
  }

  addStudyWeeks(body){
    this.subscription.add(
      this._studyYears.saveStudyWeeks(body).subscribe(res => {
        if(!res?.errors){
          this.formErrors = [];
          this.formControlsErrors = {};
          this.dialog.close(true);
          this.form.reset();
        } else {
          if(res.code == 422){
            this.formControlsErrors = res?.errors;
          } else {
            this.formErrors = res?.errors; 
          }
        }
      })
    )
    
  }

  updateStudyWeeks(body){
    this.subscription.add(
      this._studyYears.updateStudyWeeks(body).subscribe(res => {
        if(!res?.errors){
          this.formErrors = [];
          this.formControlsErrors = {};
          this.dialog.close(true);
          this.form.reset();
        } else {
          if(res.code == 422){
            this.formControlsErrors = res?.errors;
          } else {
            this.formErrors = res?.errors; 
          }
        }
      })
    )
  }

  // To map study years date to valid date 
  prepareDataBeforePost() {
    var arrayControl = this.form.get('weeks') as FormArray;
    arrayControl.value.map((ele, index) => {
      ele.ends_at = ele.ends_at ? moment(ele.ends_at).format('YYYY-MM-DD') : null;
      ele.starts_at = ele.starts_at ? moment(ele.starts_at).format('YYYY-MM-DD') : null;
    });
    this.form.value.weeks = this.form.value.weeks.map(week => {
      const weekData = this.shared.removeNullValues(week);
      return weekData
    })
    const data = {
      ...this.form.value,
    };
    return data
  }

  prepareDataBeforeUpdate(){
    var arrayControl = this.form.get('weeks') as FormArray;
    arrayControl.value.map((ele, index) => {
      ele.ends_at = ele.ends_at ? moment(ele.ends_at).format('YYYY-MM-DD') : null;
      ele.starts_at = ele.starts_at ? moment(ele.starts_at).format('YYYY-MM-DD') : null;
    });
    this.form.value.weeks = this.form.value.weeks[0];

    const weekData = this.shared.removeNullValues(this.form.value.weeks);
    
    const data = {
      ...weekData,
      id: this.data.data?.id
    };

    return data
  }



}
