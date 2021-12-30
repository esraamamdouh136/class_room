import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AddStudyYearComponent } from "./components/add-study-year/add-study-year.component";
import { LessonScheduleComponent } from "./components/school-weeks/lesson-schedule/lesson-schedule.component";
import { SchoolWeeksComponent } from "./components/school-weeks/school-weeks.component";
import { TransfareStudentToStudyYearComponent } from "./components/transfare-student-to-study-year/transfare-student-to-study-year.component";
import { StudeyYearsComponent } from "./studey-years.component";

const routes: Routes = [
  {
    path: "",
    component : StudeyYearsComponent,
  },
  {
    path : "add-year",
    component : AddStudyYearComponent
  },
  {
    path : "transfer-student",
    component : TransfareStudentToStudyYearComponent
  },
  {
    path : "study-weeks",
    component : SchoolWeeksComponent
  },
  {
    path : "studyweeks-lesson-schadule",
    component : LessonScheduleComponent
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class StudyYearsRoutingModule { }
