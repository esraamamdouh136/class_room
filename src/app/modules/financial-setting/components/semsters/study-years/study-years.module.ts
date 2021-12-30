import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { StudyYearsRoutingModule } from './study-years-routing.module';
import { StudeyYearsComponent } from "./studey-years.component";
import { AddStudyYearComponent } from './components/add-study-year/add-study-year.component';
import { TransfareStudentToStudyYearComponent } from './components/transfare-student-to-study-year/transfare-student-to-study-year.component';
import { SchoolWeeksComponent } from './components/school-weeks/school-weeks.component';
import { AddEditSchoolWeekComponent } from './components/school-weeks/add-edit-school-week/add-edit-school-week.component';
import { LessonScheduleComponent } from './components/school-weeks/lesson-schedule/lesson-schedule.component';
import { SharedModule } from "src/app/shared/shared.module";
import { ReactiveFormsModule } from '@angular/forms';
import { SetLessonComponent } from './components/school-weeks/set-lesson/set-lesson.component';


@NgModule({
  declarations: [StudeyYearsComponent, AddStudyYearComponent, TransfareStudentToStudyYearComponent, SchoolWeeksComponent, AddEditSchoolWeekComponent, LessonScheduleComponent, SetLessonComponent],
  imports: [
    CommonModule,
    StudyYearsRoutingModule,
    SharedModule,
    ReactiveFormsModule
  ]
})
export class StudyYearsModule { }
