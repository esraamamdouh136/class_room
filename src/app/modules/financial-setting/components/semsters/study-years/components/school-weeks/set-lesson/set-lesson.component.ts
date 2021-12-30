import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material/dialog";
import { Subscription } from "rxjs";
import { GlobalDropDown, Subject } from "src/app/modules/financial-setting/models/study-years/StudyYears";
import { StudyYearsService } from "src/app/modules/financial-setting/services/studeyYears/studey-years.service";

@Component({
  selector: 'app-set-lesson',
  templateUrl: './set-lesson.component.html',
  styleUrls: ['./set-lesson.component.scss']
})
export class SetLessonComponent implements OnInit {
  classes: GlobalDropDown[] = [];
  subjects: Subject[] = [];
  selectedSubject;
  selectedClass;
  formsError:any;
  subscription: Subscription = new Subscription();

  constructor(
    private _studyYears: StudyYearsService,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private dialog: MatDialogRef<SetLessonComponent>,
  ) { }

  ngOnInit(): void {
    this.getClasses();
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  getClasses() {
    this.subscription.add(
      this._studyYears.getClasses().subscribe(res => {
        this.classes = res.data[0];
        this.selectedClass = this.classes[0].id;
        console.log(this.selectedClass);
        
        this.selectClass(this.classes[0]);
      })
    )
  }

  selectClass(e) {
    this.subscription.add(
      this._studyYears.getSubjects(e).subscribe(res => {
        // this.subjects = res[1][0];
        this.subjects = [
          {
            grade: "الأول الابتدائي",
            id: 342,
            title: "add subject",
            trans_template_subject_id: 303,
          }
        ];
        this.selectedSubject = this.subjects[0].id;
        this.selectSubject(this.subjects[0]);
      })
    )
  }

  selectSubject(e) {
    this.subscription.add(
      this._studyYears.getStudyWeekByOne(this.data.data?.id, e?.id).subscribe(res => {
        // Handel lecture here 
        console.log(res);
      })
    )
    
    // this.subscription.add(
    //   this._studyYears.getStudyWeekByOne(this.data.data?.id, e?.id).subscribe(res => {
    //     console.log(res);
    //   })
    // )
  }

  onSubmit(){
    const data = {
      "id":this.data.data?.id,
      "subject_id":this.selectedSubject,
      // "lectures":[2,3,4,5,6,7,9,8] // this is not handel yet
    }
    this.subscription.add(
      this._studyYears.assignLectureToWeek(data).subscribe(res => {
        if(res[0]){
          // Handel error here
          this.formsError = res[1]
        }else {
          //  Handel success here 
          this.dialog.close(true);
        }
      })
    )
  }

}
