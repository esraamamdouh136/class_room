import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';

import { ToastrService } from 'ngx-toastr';
import { forkJoin, Subscription } from 'rxjs';
import { distinctUntilChanged } from 'rxjs/operators';

import { SharedService } from 'src/app/shared/services/shared.service';
import { TopNavService } from '../../../../shared/services/top-nav.service';
import { Language,Country, DateFormate, MotherCompanies, Zones } from "src/app/shared/model/global";
import { MotherCompaniseService } from '../../services/mother-companies/mother-companise.service';
import { ListsService } from "src/app/shared/services/list_Service/lists.service";

@Component({
  selector: 'app-organization',
  templateUrl: './organization.component.html',
  styleUrls: ['./organization.component.scss']
})
export class OrganizationComponent implements OnInit,OnDestroy {

  // properties
  formErrors;
  form: FormGroup;
  selectedCompany;
  index: number = 0;
  selectedCompanyId: number;

  zones: Zones[] = [];
  showLoading = [];
  report_types = [];
  motherCompanies:MotherCompanies[] = [];
  countries:Country[] = [];
  languages:Language[] = [];
  date_formats:DateFormate[] = [];

  subscription: Subscription = new Subscription();
  public fileUploadControl = new FormControl(null);

  checked: boolean = true;
  loading: boolean = false;
  dataLoaded: boolean = false;
  enableEdit: boolean = false;
  radioChecked: boolean = true;
  radioNotChecked: boolean = false;


  constructor(
    private fb: FormBuilder,
    private toastr: ToastrService,
    private _listsService: ListsService,
    private topNavService: TopNavService,
    private _sharedService: SharedService,
    private _companiesService: MotherCompaniseService,
  ) {}

  ngOnInit(): void {
    this.getInitialData();
    // initForm
    this.initForm();
  }
  ngOnDestroy() {
    this.subscription.unsubscribe();
  }
  /**
   * Initiate update organization form
   */
  initForm() {
    const reg = '(https?://)?([\\da-z.-]+)\\.([a-z.]{2,6})[/\\w .-]*/?';

    this.form = this.fb.group({
      image: this.fileUploadControl,
      name: ['', [Validators.required]],
      country_id: ['', [Validators.required]],
      address_street: ['', [Validators.required, Validators.minLength(10)]],
      city: ['', [Validators.required]],
      phone: ['', [Validators.required]],
      mobile: ['', [Validators.required]],
      fax: ['', [Validators.required]],
      website: ['', [Validators.required, Validators.pattern(reg)]],
      tax_number: ['', [Validators.required]],
      sp_number: ['', [Validators.required]],
      report_type: ['', [Validators.required]],
      accrual_basis: ['vat_estimation_basis', [Validators.required]],
      language_id: ['', [Validators.required]],
      zone: ['', [Validators.required]],
      date_format: ['', [Validators.required]],
      status: ['', [Validators.required]],
      journal_method: ['', [Validators.required]],
    });
  }

  getInitialData(){
    this.subscription.add(
      this._sharedService.navChanged$.subscribe(data => {
        if (data && data?.role) {
          this.getData();
        }
      })
    )
  }

  getData() {
    let countries = this._listsService.countries();
    let langs = this._listsService.langs();
    let zones = this._listsService.zones();
    let date_formats = this._listsService.dateFormats();
    let motherCompanies = this._companiesService.motherCompanies();
    this.subscription.add(
      this._sharedService.selectedRoleId$.subscribe(res => {
        if (res) {
          this.subscription.add(
            forkJoin([countries, langs, zones, date_formats, motherCompanies]).subscribe(listResult => {
              if (listResult.every(d => d.code === 200)) {
                this.countries = listResult[0].items;
                this.languages = listResult[1].items;
                this.zones = listResult[2].items;
                
                this.date_formats = listResult[3].items;
                console.log(this.date_formats , 'FORMAT')
                this.motherCompanies = listResult[4].items;
                this.dataLoaded = true;
                this.topMenuCompanies();
              }
            }, error => {
              this.dataLoaded = true;
            })
          )
        }
      }
    ))
  }

  // Enable editing company
  edit() {
    this.enableEdit = true;
    this.form.enable();
  }

  // Cancel editing company
  cancelEdit() {
    this.enableEdit = false;
    this.form.disable();
  }

  /**
   * When user change company fill new company data to form
   */
  onChangeMotherCompany(event) {
    this._sharedService.selectedCompanyId.next(event.id);
    this.enableEdit = false;
    this.selectedCompany = this.motherCompanies.filter(el => el.id == event.id)[0];
    this.fillData(this.selectedCompany);
  }


  /**
   * Fill form data
   * @param obj (company data)
   */
  fillData(obj) {
    let data = obj;
    data['status'] = data.status == 1 ? true : false;
    data['report_type'] = data.report_type?.toString();
    data['image'] = null;
    this.form.patchValue(data);
    this.form.disable();
  }


  /**
   * Update company data
   */
  updateCompanyData() {
    this.loading = true;

    const body = this.prepareDataBeforePost();
    this.subscription.add(
      this._companiesService.updateCompanyData(this.selectedCompany.number, body).subscribe(res => {
        if (res.code === 200) {
          this.formErrors = {};
          this.loading = false;
          this.toastr.success(res.message);
          this.enableEdit = false;
          this.selectedCompany = res.mother_company;
          this.GetCompaniesData();
          this.form.disable();
          this.topNavService.getTopNavData();
        }
      }, error => {
        if (error.status == 422) {
          this.formErrors = error?.error;
        }
        this.loading = false;
      })
    )
  }


  /**
   * Get companies data after update each company
   */
  GetCompaniesData() {
    this.subscription.add(
      this._companiesService.motherCompanies().subscribe(res => {
        this.motherCompanies = res.items;
      })
    )
  }

  /**
   * Remove logo
   */
  removeLogo() {
    if (this.enableEdit) {
      this.subscription.add(
        this._companiesService.deleteLogo(this.selectedCompany.number).subscribe(res => {
          this.toastr.success(res.message);
          this.motherCompanies = this.motherCompanies.map(el => {
            el.has_image = el.id === this.selectedCompanyId ? false : el.has_image;
            return el;
          });
        })
      );
    }
  }


  selectNext() {
    if (this.motherCompanies.findIndex(el => el.id == this.selectedCompanyId) < this.motherCompanies.length - 1) {
      this.enableEdit = false;
      let index = this.motherCompanies.findIndex(e => e.id == this.selectedCompany.id);
      this.selectedCompanyId = this.motherCompanies[index + 1].id;
      this.selectedCompany = this.motherCompanies.filter(el => el.id == this.selectedCompanyId)[0];
      this.fillData(this.selectedCompany);
      this.formErrors = {};
    }
  }

  selectPrevious() {
    if (this.motherCompanies.findIndex(el => el.id == this.selectedCompanyId) !== 0) {
      this.enableEdit = false;
      let index = this.motherCompanies.findIndex(e => e.id == this.selectedCompany.id);
      this.selectedCompanyId = this.motherCompanies[index - 1].id;
      this.selectedCompany = this.motherCompanies.filter(el => el.id == this.selectedCompanyId)[0];
      this.fillData(this.selectedCompany);
      this.formErrors = {};
    }
  }

  /**
   * Subscribe to changes in top menu companies dropdown and change selected company depend on it
   */
  topMenuCompanies() {
    this.subscription.add(
      this._sharedService.selectedCompanyId$.pipe(distinctUntilChanged()).subscribe(val => {
        if (this.dataLoaded && val) { // Add and val check => because at the first time (val==null)
          this.selectedCompanyId = val;
          this.onChangeMotherCompany({ id: val });
        } else {
          // If there aren't companies in top nav select the first one.
          this.selectedCompanyId = this.motherCompanies[0]?.id;
          this.onChangeMotherCompany({ id: this.selectedCompanyId });
        }
      })
    );
  }

  // get the status form control
  get statusFormControl() {
    return this.form.get('status');
  }

  // get the accrual_basis form control
  get accrualBasisFormControl() {
    return this.form.get('accrual_basis');
  }

  // get the accrual_basis form control
  get accrualJournalMethodFormControl() {
    return this.form.get('journal_method');
  }

  prepareDataBeforePost() {
    const formData = new FormData();
    for (const key in this.form.value) {
      if (key == 'status') {
        formData.append(key, this.form.value[key] == true ? '1' : '2');
      } else if (key === 'image' && this.form.value.image) {
        this.form.value.image.forEach(el => {
          formData.append('image', el);
        });
      } else {
        if (this.form.get(key).value) {
          formData.append(key, this.form.get(key).value);
        }
      }
    }
    if (this.selectedCompany.has_image || !this.form.value.image) {
      formData.delete('image');
    }

    return formData;
  }
}





