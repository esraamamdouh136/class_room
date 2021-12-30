import { Location } from '@angular/common';
import { Component, OnInit } from '@angular/core';

import { Subscription } from "rxjs";
import { distinctUntilChanged } from 'rxjs/operators';

import { LayoutService } from '../../../../../_metronic/core';
import { SharedService } from 'src/app/shared/services/shared.service';
import { ListsService } from "src/app/shared/services/list_Service/lists.service";

function getCurrentURL(location) {
  return location.split(/[?#]/)[0];
}

@Component({
  selector: 'app-header-menu',
  templateUrl: './header-menu.component.html',
  styleUrls: ['./header-menu.component.scss'],
})
export class HeaderMenuComponent implements OnInit {
  location: Location;
  ulCSSClasses: string;
  rootArrowEnabled: boolean;
  headerMenuDesktopToggle: string;

  // Properties
  companies = [];
  costCenters = [];
  fiscalYears: any[];
  subscription:Subscription = new Subscription();

  jobs;
  selectedRole;
  companyNumber;
  selectedRoleId;
  selectedCompany;
  selectedCompanyId;
  selectedCostCenter;
  selectedCostCenterId;
  selectedFiscalYearId;

  constructor(
    private loc: Location, 
    private _lists: ListsService, 
    private layout: LayoutService, 
    private _sharedService: SharedService, 
  ) {
    this.location = this.loc;
  }

  ngOnInit(): void {
    this.ulCSSClasses = this.layout.getStringCSSClasses('header_menu_nav');
    this.rootArrowEnabled = this.layout.getProp('header.menu.self.rootArrow');
    this.headerMenuDesktopToggle = this.layout.getProp(
      'header.menu.desktop.toggle'
    );

    this.getLocalHeaderMenuData();
    
    this.subscription.add(
      this._sharedService.selectedCompanyId$.pipe(distinctUntilChanged()).subscribe(val => {
        if (this.companies.length) {
          this.selectedCompanyId = val;
        }
      })
    )
    
    

    this.GetNavList();
  }

  getLocalHeaderMenuData(){
    // ======[Get Selected Data From LocalStorage]=======
    this.selectedFiscalYearId = localStorage.getItem("selectedFiscalYearId");
    this.selectedCostCenterId = localStorage.getItem("selectedCostCenterId");
    this.selectedRoleId = localStorage.getItem("selectedRoleId");
    this.companyNumber = localStorage.getItem("selectedComNumber");
  }

  getMenuItemActive(url) {
    return this.checkIsActive(url) ? 'menu-item-active' : '';
  }

  checkIsActive(url) {
    const location = this.location.path();
    const current = getCurrentURL(location);
    if (!current || !url) {
      return false;
    }

    if (current === url) {
      return true;
    }

    if (current.indexOf(url) > -1) {
      return true;
    }

    return false;
  }

  /**
   * If user change company
   * Change selected cost center
   * Change selected company in organization page
   */
  onChangeCompany(item) {
    this._sharedService.selectedCompanyId.next(item.id);
    //this.selectedCompany = this.companies.find(el => el.id == e.id);
    this.selectedCompany = item;
    this.selectedCompanyId = item.id;
    this._sharedService.selectedCompanyNumber.next(item.number);
    // this._sharedService.navChanged.next({ text: 'companyNum', id: item.number });
    localStorage.setItem('selectedComNumber', `${item.number}`);
    this.getFiscalYears();
  }

  /**
   * If user change Job
   * Change selected company
   * change company in organization page
   */
  onChangeJob(e) {
    this.selectedRole = this.jobs.find(el => el.id == e.id);
    this.selectedRoleId = this.selectedRole['id'];
    this._sharedService.selectedRoleId.next(e.id);
    // this._sharedService.navChanged.next({ text: 'job', id: e.id });
    localStorage.setItem('selectedRoleId', `${this.selectedRoleId}`);
    this.ChangeCompaniesData();
  }

  /**
   * When user change selected costCenter
   * Change global selected costCenter to change the headers
   */
  onChangeCostCenter(e) {
    this._sharedService.selectedConstCenterId.next(e.id);
    this._sharedService.navChanged.next(
      { 
        text: 'change', 
        costCenter: this.selectedCostCenterId, 
        fiscalYear: this.selectedFiscalYearId, 
        companyId: this.selectedCompanyId, 
        role: this.selectedRoleId, 
        companyNum: this.selectedCompany?.number,
        selectedCompany : this.selectedCompany,
        system_id : this.costCenters.filter(i => i.id == this.selectedCostCenterId)[0]?.system_id
      }
    ); 
    localStorage.setItem('selectedCostCenterId', `${e.id}`);
  }

  /**
   * When user change selected fiscalYear
   * Change global selected fiscalYear to change the headers
   */
  onChangeFiscalYear(e) {
    this._sharedService.selectedFiscalYearId.next(e.id);
    localStorage.setItem('selectedFiscalYearId', `${e.id}`);
    this._sharedService.navChanged.next(
      { 
        text: 'change', 
        costCenter: this.selectedCostCenterId, 
        fiscalYear: this.selectedFiscalYearId, 
        companyId: this.selectedCompanyId, 
        role: this.selectedRoleId, 
        selectedCompany : this.selectedCompany,
        companyNum: this.selectedCompany?.number,
        system_id : this.costCenters.filter(i => i.id == this.selectedCostCenterId)[0]?.system_id

      }
    ); 
  }


  /**
   * Get user nav and at the first time select default value
   */
  GetNavList() {
    this.subscription.add(
      this._sharedService.navData$.subscribe(res => {
        if (res) {
          this.jobs = res.data;
          let role = this.jobs.find(el => el.id == +this.selectedRoleId);
          this.selectedRole = role ? role : this.jobs[0];
          this.selectedRoleId = (this.selectedRoleId && role) ? +this.selectedRoleId : this.selectedRole['id'];
          localStorage.setItem('selectedRoleId', `${this.selectedRoleId}`);
          this.ChangeCompaniesData();
        }
      })
    )
  }

  /**
   * Get fiscal year
   * After country to send id of selected country
   */
  getFiscalYears() {
    this.subscription.add(
      this._lists.getFiscalYear(this.selectedCompany?.number).subscribe(res => {
        this.fiscalYears = res.items;

        if (this.fiscalYears.length) {
          const defaultYear = this.fiscalYears.find(year => year.is_default == 1);
          let year = this.fiscalYears.some((e: any) => e.id == +this.selectedFiscalYearId);
          if (defaultYear) {
            this.selectedFiscalYearId = (this.selectedFiscalYearId && year) ? +this.selectedFiscalYearId : defaultYear?.id;
            this._sharedService.selectedFiscalYearId.next(this.selectedFiscalYearId);
          } else {
            this.selectedFiscalYearId = (this.selectedFiscalYearId && year) ? +this.selectedFiscalYearId : this.fiscalYears[0].id;
            this._sharedService.selectedFiscalYearId.next(this.selectedFiscalYearId);
          }
        } else {
          this.fiscalYears = [];
          this._sharedService.selectedFiscalYearId.next(null);
          this.selectedFiscalYearId = null;
        }
        localStorage.setItem('selectedFiscalYearId', `${this.selectedFiscalYearId}`);
        this.changeCostCenterData();
        
        this._sharedService.fiscalYears.next({data:this.fiscalYears,type:'first'});
        this.getLocalFiscalYear();
      })
    )
  }

  getLocalFiscalYear(){
    this.subscription.add(
      this._sharedService.fiscalYears$.subscribe(res => {
        this.fiscalYears = res?.data.map(year => {
          year.name = res?.type == 'first' ? year?.name :  year?.name_ar;
          return year
        });
      })
    )
  }

  /**
   * When user change role
   * Change selected company
   * Change selected cost center
   */
  ChangeCompaniesData() {
    this.companies = this.selectedRole.companies.length ? this.selectedRole.companies : [this.selectedRole.companies[1]];
    if (this.companies.length && this.companies[0]) {
      let company = this.companies.find(e => e.number == +this.companyNumber);
      this.selectedCompany = company ? company : this.companies[0];
      this.selectedCompanyId = this.selectedCompany['id'];
      this._sharedService.selectedCompanyId.next(this.selectedCompanyId);
      this._sharedService.selectedCompanyNumber.next(this.selectedCompany['number']);
      this._sharedService.selectedCompany.next(this.selectedCompany);
      localStorage.setItem('selectedComNumber', `${this.selectedCompany['number']}`);
      this.getFiscalYears();
    } else {
      this.companies = [];
      this._sharedService.selectedCompanyId.next(null);
      this._sharedService.selectedCompanyNumber.next(null);
    }
  }

  /**
   * Change selected cost center
   */
  changeCostCenterData() {
    this.costCenters = this.selectedCompany?.cost_centers.length ? this.selectedCompany?.cost_centers : [this.selectedCompany?.cost_centers[1]];
    if (this.costCenters?.length && this.costCenters[0]) {
      let costCenter = this.costCenters.find((el: any) => el.id == +this.selectedCostCenterId);
      this.selectedCostCenter = costCenter ? costCenter : this.costCenters[0];
      this.selectedCostCenterId = (this.selectedCostCenterId && costCenter) ? +this.selectedCostCenterId : this.selectedCostCenter['id'];
      this._sharedService.selectedConstCenterId.next(this.selectedCostCenterId);
    } else {
      this.selectedCostCenterId = null;
      this.costCenters = [];
      this._sharedService.selectedConstCenterId.next(null);
    }
    localStorage.setItem('selectedCostCenterId', `${this.selectedCostCenterId}`);
    this._sharedService.navChanged.next(
      { 
        text: 'costCenter', 
        costCenter: this.selectedCostCenterId, 
        fiscalYear: this.selectedFiscalYearId, 
        companyId: this.selectedCompanyId, 
        role: this.selectedRoleId, 
        selectedCompany : this.selectedCompany,
        companyNum: this.selectedCompany?.number,
        system_id : this.costCenters.filter(i => i.id == this.selectedCostCenterId)[0]?.system_id

      });
  }

}
