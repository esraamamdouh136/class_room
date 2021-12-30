import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FatherComponent } from './taps/father/father.component';
import { MotherComponent } from './taps/mother/mother.component';
import { RelativesComponent } from './taps/relatives/relatives.component';
import { ChildrenComponent } from './taps/children/children.component';
import { ArchiveFileComponent } from './taps/archive-file/archive-file.component';
import { LiveComponent } from './taps/live/live.component';
import { ParentsComponent } from './parents.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { RouterModule, Routes } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { ConfirmDialogMassageComponent } from './taps/confirm-dialog-massage/confirm-dialog-massage.component';
import { AgmCoreModule } from '@agm/core';
import { AddEditFilesComponent } from './taps/archive-file/add-edit-files/add-edit-files.component';
import { ExportExelComponent } from './components/export-exel/export-exel.component';
import { EditExelComponent } from './components/edit-exel/edit-exel.component';
import { UpdateStudentsInformationComponent } from './components/update-students-information/update-students-information.component';
import {ClipboardModule} from '@angular/cdk/clipboard';


const routes:Routes = [
  {
    path : '',
    component : ParentsComponent,
  },
  {
    path : 'export-exel',
    component : ExportExelComponent
  },
  {
    path : 'edit-exel',
    component : EditExelComponent
  },
  {
    path : 'update-students-info',
    component : UpdateStudentsInformationComponent
  },
  
]

@NgModule({
  declarations: [
    ParentsComponent,
    FatherComponent,
    MotherComponent,
    RelativesComponent,
    ChildrenComponent,
    ArchiveFileComponent,
    LiveComponent,
    ConfirmDialogMassageComponent,
    AddEditFilesComponent,
    ExportExelComponent,
    EditExelComponent,
    UpdateStudentsInformationComponent
  ],
  imports: [
    CommonModule,
    SharedModule,
    // RouterModule,
    RouterModule.forChild(routes),
    FormsModule,
    ReactiveFormsModule,
    ClipboardModule,
    AgmCoreModule.forRoot({
      apiKey: 'AIzaSyAMds9TG7z07hx_4Qfu8-BXtdJdzAcezjU'
    }),
  ],
  // exports: [
  //   FatherComponent
  // ],
  schemas: [ CUSTOM_ELEMENTS_SCHEMA ]


})
export class ParentsModule { }
