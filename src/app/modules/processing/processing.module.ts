import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';

import {ProcessingRoutingModule} from './processing-routing.module';
import {SharedModule} from 'src/app/shared/shared.module';
import {ActiveLoadingComponent} from 'src/app/modules/processing/components/active-loading/active-loading.component';
import {DeclarationComponent} from 'src/app/modules/processing/components/declaration/declaration.component';
import {FormDeclarationComponent} from 'src/app/modules/processing/components/declaration/form-declaration/form-declaration.component';
import {SheetContentComponent} from 'src/app/modules/processing/components/sheet-content/sheet-content.component';
import {CheckStudentLoginComponent} from 'src/app/modules/processing/components/sheet-content/tabs/check-student-login/check-student-login.component';
import {SchoolStudentUploadComponent} from 'src/app/modules/processing/components/sheet-content/tabs/school-student-upload/school-student-upload.component';
import {SheetsListComponent} from 'src/app/modules/processing/components/sheets-list/sheets-list.component';
import {ProcessingComponent} from 'src/app/modules/processing/processing.component';


@NgModule({
  declarations: [
    ProcessingComponent,
    DeclarationComponent,
    FormDeclarationComponent,
    SheetsListComponent,
    SheetContentComponent,
    ActiveLoadingComponent,
    SchoolStudentUploadComponent,
    CheckStudentLoginComponent,
  ],
  imports: [
    SharedModule,
    CommonModule,
    ProcessingRoutingModule,
  ]
})
export class ProcessingModule {
}
