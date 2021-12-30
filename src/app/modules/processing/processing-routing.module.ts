import {NgModule} from '@angular/core';
import {Routes, RouterModule} from '@angular/router';
import {ActiveLoadingComponent} from './components/active-loading/active-loading.component';
import {DeclarationComponent} from './components/declaration/declaration.component';
import {SheetContentComponent} from './components/sheet-content/sheet-content.component';
import {SheetsListComponent} from './components/sheets-list/sheets-list.component';
import {ProcessingComponent} from './processing.component';
import {SchoolStudentUploadComponent} from './components/sheet-content/tabs/school-student-upload/school-student-upload.component';
import {CheckStudentLoginComponent} from './components/sheet-content/tabs/check-student-login/check-student-login.component';


const routes: Routes = [
  {
    path: '',
    component: ProcessingComponent,
    children: [
      {
        path: '',
        redirectTo: 'connect',
        pathMatch: 'full',
      },
      {
        path: 'connect',
        component: DeclarationComponent,
      },
      {
        path: 'sheets-list',
        component: SheetsListComponent,
      },
      {
        path: 'sheet-content',
        component: SheetContentComponent,
        children: [
          {
            path: 'school-student-upload',
            component: SchoolStudentUploadComponent
          },
          {
            path: 'check-student-login',
            component: CheckStudentLoginComponent
          },
          {
            path: '',
            redirectTo: 'school-student-upload',
            pathMatch: 'full'
          }
        ]
      },
    ]
  },
  {
    path: 'active-google-drive-email',
    component: ActiveLoadingComponent,
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ProcessingRoutingModule {
}
