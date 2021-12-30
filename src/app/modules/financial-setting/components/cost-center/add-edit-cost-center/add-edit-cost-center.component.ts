import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { MAT_DIALOG_DATA, MatDialogRef } from "@angular/material/dialog";

import { forkJoin, Subscription } from "rxjs";
import { take } from "rxjs/operators";

import { SharedService } from "src/app/shared/services/shared.service";
import { TopNavService } from "src/app/shared/services/top-nav.service";
import { CostCenterService } from "../../../services/cost-centers/cost-center.service";
import { AddEditAreaComponent } from "../../areas/add-edit-area/add-edit-area.component";
import { TranslationService } from 'src/app/modules/i18n/translation.service';
import { TranslateService } from '@ngx-translate/core';
import { ListsService } from "src/app/shared/services/list_Service/lists.service";

@Component({
  selector: 'app-add-edit-cost-center',
  templateUrl: './add-edit-cost-center.component.html',
  styleUrls: ['./add-edit-cost-center.component.scss']
})
export class AddEditCostCenterComponent implements OnInit {
 
    
  nameOfEnglish : boolean;
  nameofArabic : boolean;

  language:string;
  constructor(
    private _FormBuilder: FormBuilder, 
    @Inject(MAT_DIALOG_DATA) public data: any,
    private dialog: MatDialogRef<AddEditAreaComponent>,
    private _Lists: ListsService,
    private _shredService: SharedService,
    private _costCenter: CostCenterService,
    private topNavService: TopNavService,
    public translation: TranslationService,
    private translate : TranslateService
  ) { }
  form: FormGroup;
  
  CostCenterBranches = [];
  CostCenterAraes = [];

  selectedMotherCompanyId;
  selectedMotherCompanyNumber;
  subscription: Subscription = new Subscription();





  ngOnInit(): void {
    // init form
    this.initForm();
    // Get Selected company  numbers
    this.getCompanyNumber()
    this.defualtLanguageInputs();
  }

  defualtLanguageInputs(){
    if(this.translation.getSelectedLanguage() == 'ar'){
      this.language = this.translate.instant('MENU.en_language')
      this.nameOfEnglish = false;
      this.nameofArabic = true;
    }
    else if(this.translation.getSelectedLanguage() == 'en'){
      this.language = this.translate.instant('MENU.ar_language')
      this.nameOfEnglish = true;
      this.nameofArabic = false;
    }
  }
  getCompanyNumber() {
    this.subscription.add(
      this._shredService.navChanged$.subscribe(data => {
        if (data) {
          this.selectedMotherCompanyNumber = data?.companyNum;
          this.getFormData();
        }
      })
    )

    if (this.data.update) {
      this.form.patchValue(this.data.data);
      if (this.data.data.cost_center_region) {
        this.selectArea(this.data.data.cost_center_region);
      }
    }
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  // initialize Form
  initForm() {
    this.form = this._FormBuilder.group({
      name_ar: ['', Validators.required],
      name_en: ['', Validators.required],
      cost_center_region_id: ['', Validators.required],
      cost_center_branch_id: ['', Validators.required],
      status: [1],
    });
  }

  // get the status form control
  get statusValue() {
    return this.form.get('status').value;
  }

  /**
 * Get cost center form data
 * Areas and selected company id and branches in the next step.
 * Add loading until get form value.
 */
  getFormData() {
    let motherCompanyId = this._shredService.selectedCompanyId$.pipe(take(1));
    let areas = this._Lists.getAreas(this.selectedMotherCompanyNumber);
    forkJoin([motherCompanyId, areas]).subscribe(listResult => {
      this.selectedMotherCompanyId = listResult[0];
      this.CostCenterAraes = listResult[1].items;
    });
  }

  /**
   * When user choose an area to add costCenter get branches of this areas.
   * @param {boolean} changeInDropDown If user change area change Branches.
   */
  selectArea(value,changeInDropDown?) {
    if(changeInDropDown){
      this.form.get('cost_center_branch_id').setValue('');
    }
    this.subscription.add(
    this._Lists.getBranches(this.selectedMotherCompanyNumber, value.id).subscribe(res => {
      this.CostCenterBranches = res.items;
    }))
  }

  /**
* Add Cost Centers
*/
  onSubmit() {
    if(this.form.get('name_ar').value == undefined || this.form.get('name_ar').value == ""){
      this.form.controls['name_ar'].setValue(this.form.get('name_en').value)
    }
    else if(this.form.get('name_en').value == undefined || this.form.get('name_en').value == ""){  
      this.form.controls['name_en'].setValue(this.form.get('name_ar').value)
    } 
    const body = this.prepareDataBeforePost(this.form.value);

    this._costCenter.addCostCenters(body).subscribe(res => {
      this.dialog.close(true);
      // inform the header of the change
      this.topNavService.getTopNavData();
    }
    );
  }

  prepareDataBeforePost(formVal) {
    const data = {
      ...formVal,
      mother_company_id: this.selectedMotherCompanyId,
      status: this.data.update ? formVal.status ? 1 : 2 : 1,
      id: this.data?.data?.id,
      cost_center_branch_id: Number(formVal.cost_center_branch_id) ? formVal.cost_center_branch_id : null,
      cost_center_region_id: Number(formVal.cost_center_region_id) ? formVal.cost_center_region_id : null
    };
    if (!this.data.update) {
      delete data.id;
    }
    return data;
  }
  
  toggleLanguage(){
    if(this.nameofArabic == true){
      this.language = this.translate.instant('MENU.ar_language')
        this.nameOfEnglish = true;
        this.nameofArabic = false;
      }
    else if(this.nameOfEnglish == true){
      this.language = this.translate.instant('MENU.en_language')
        this.nameOfEnglish = false;
        this.nameofArabic = true
      }
  }
}
