import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import { AddEditStudentComponent } from "./components/add-edit-student/add-edit-student.component";
import {AddEditformComponent} from './components/add-editform/add-editform.component';
import {ExcelComponent} from './components/excel/excel.component';
import {ImportUsersComponent} from './components/import-users/import-users.component';
import {NotAttachedParentsComponent} from './components/not-attached-parents/not-attached-parents.component';
import {ProfilePictureComponent} from './components/profile-picture/profile-picture.component';
import {StudentCountComponent} from './components/student-count/student-count.component';
import {StudentPreparationTableComponent} from './components/student-preparation-table/student-preparation-table.component';
import {StudentSearchComponent} from './components/student-search/student-search.component';

import {StudentsComponent} from './students.component';

const routes: Routes = [
  { path: '', component: StudentsComponent},
  {path : 'add_new_student' , component : AddEditStudentComponent},
  // {path : 'add_new_student' , component : AddEditformComponent},
  {path : 'excel' , component : ExcelComponent},
  {path : 'image_import' , component :ProfilePictureComponent },
  {path : 'import_users' , component :ImportUsersComponent },
  {path : 'student_table' , component :StudentPreparationTableComponent },
  {path : 'student_count' , component :StudentCountComponent },
  {path : 'not_attached'   , component : NotAttachedParentsComponent},
  {path : 'search'   , component : StudentSearchComponent}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class StudentsRoutingModule { }
