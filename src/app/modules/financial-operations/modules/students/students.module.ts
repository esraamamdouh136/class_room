import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';

import {StudentsRoutingModule} from './students-routing.module';
import {StudentsComponent} from './students.component';
import {SharedModule} from 'src/app/shared/shared.module';
import {AddEditformComponent} from './components/add-editform/add-editform.component';
import {ExcelComponent} from './components/excel/excel.component';
import {ProfilePictureComponent} from './components/profile-picture/profile-picture.component';
import {ImportUsersComponent} from './components/import-users/import-users.component';
import {StudentPreparationTableComponent} from './components/student-preparation-table/student-preparation-table.component';
import {StudentCountComponent} from './components/student-count/student-count.component';
import {NotAttachedParentsComponent} from './components/not-attached-parents/not-attached-parents.component';
import {StudentSearchComponent} from './components/student-search/student-search.component';
import { AddEditStudentComponent } from './components/add-edit-student/add-edit-student.component';


@NgModule({
  declarations: [StudentsComponent, AddEditformComponent, ExcelComponent, ProfilePictureComponent, ImportUsersComponent, StudentPreparationTableComponent, StudentCountComponent, NotAttachedParentsComponent, StudentSearchComponent, AddEditStudentComponent],
  imports: [
    CommonModule,
    StudentsRoutingModule,
    SharedModule,
  ]
})
export class StudentsModule { }
