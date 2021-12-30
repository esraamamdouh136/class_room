import { Component, Inject, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { TranslateService } from '@ngx-translate/core';
import { Subscription } from 'rxjs';
import { Student } from 'src/app/modules/financial-operations/models/collection-from-parents/collection-from-parents';
import { CollectionFromParentsService } from 'src/app/modules/financial-operations/services/collection-from-parents/collection-from-parents.service';
import { TranslationService } from 'src/app/modules/i18n/translation.service';
import { SharedService } from 'src/app/shared/services/shared.service';
import { ServiceService } from '../../../service/service.service';

@Component({
  selector: 'app-contract-download-dialog',
  templateUrl: './contract-download-dialog.component.html',
  styleUrls: ['./contract-download-dialog.component.scss']
})
export class ContractDownloadDialogComponent implements OnInit {
  form : FormGroup;
  student : any;
  selectedCompany : number;
  students: Student[] = [];
  subscription: Subscription = new Subscription();
  constructor(
    @Inject(MAT_DIALOG_DATA) public data,
    private dialog: MatDialogRef<ContractDownloadDialogComponent>,
    public translation: TranslationService,
    private contractService: CollectionFromParentsService,
    private _sharedService: SharedService,

  ) { }

  ngOnInit(): void {
    this.subscription.add(
      this._sharedService.navChanged$.subscribe(data => {
        if (data) {
          this.selectedCompany = data.companyNum;
          this.getStudents()
        }}))
  }
  getStudents(): void {
    this.subscription.add(
      this.contractService.getStudents(this.selectedCompany)
        .subscribe(
          (res) => {
            this.students = res;
          }
        ));
  }
  onSubmit(){

  }
}
