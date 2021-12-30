import {Injectable} from '@angular/core';
import {BehaviorSubject} from 'rxjs';
import {AuthService} from 'src/app/modules/auth';
import { ListsService } from "./list_Service/lists.service";
import {SharedService} from './shared.service';

@Injectable({
  providedIn: 'root'
})
export class TopNavService {

  private dataLoadded = new BehaviorSubject(false);
  dataLoadded$ = this.dataLoadded.asObservable();
  // ======[Get Selected Data From LocalStorage]=======
  selectedFiscalYearId = localStorage.getItem('selectedFiscalYearId');
  selectedCostCenterId = localStorage.getItem('selectedCostCenterId');
  selectedRoleId = localStorage.getItem('selectedRoleId');
  companyNumber = localStorage.getItem('selectedComNumber');

  selectedRole;


  constructor(private authService: AuthService,
              private _lists: ListsService,
              private _sharedService: SharedService,
  ) {
  }

  getTopNavData() {
    const token = this.authService.getToken();
    if (token) {
      this._lists.getNavLists().subscribe(res => {
        this._sharedService.navData.next(res);
        const roles = res.data;
        // ======[Update selected ROLE globally]=======
        let role = roles.find(el => el.id == +this.selectedRoleId);
        this.selectedRole = role ? role : roles[0];
        this.selectedRoleId = (this.selectedRoleId && role) ? +this.selectedRoleId : this.selectedRole['id'];
        this._sharedService.selectedRoleId.next(this.selectedRoleId ? +this.selectedRoleId : roles[0]['id']);
        this.updateSelectedCompany();
      });
    } else {
      this.dataLoadded.next(true);
    }
  }

  updateSelectedCompany() {
    let companies = this.selectedRole.companies.length ? this.selectedRole.companies : [this.selectedRole.companies[1]];
    if (companies.length && companies[0]) {
      let company = companies.find(e => e.number == +this.companyNumber);
      let selectedCompany = company ? company : companies[0];
      let costCenters = selectedCompany?.cost_centers.length ? selectedCompany?.cost_centers : [selectedCompany?.cost_centers[1]];
      this._sharedService.selectedCompanyNumber.next(selectedCompany['number']);
      this._sharedService.selectedCompanyId.next(selectedCompany['id']);
      this.getFiscalYears(selectedCompany['number']);
      this.updateSelectedCostCenter(costCenters);
    } else {
      this._sharedService.selectedCompanyNumber.next(null);
      this.dataLoadded.next(true);
    }
  }

  private updateSelectedCostCenter(costCenterList) {
    if (costCenterList?.length && costCenterList[0]) {
      let costCenter = costCenterList.find((el: any) => el.id == +this.selectedCostCenterId);
      let selectedCostCenter = costCenter ? costCenter : costCenterList[0];
      this.selectedCostCenterId = (this.selectedCostCenterId && costCenter) ? +this.selectedCostCenterId : selectedCostCenter['id'];
      this._sharedService.selectedConstCenterId.next(this.selectedCostCenterId);
    } else {
      this._sharedService.selectedConstCenterId.next(null);
      this.dataLoadded.next(true);
    }
  }

  /**
   * Get fiscal year
   * After country to send id of selected country
   */
  private getFiscalYears(number) {
    this._lists.getFiscalYear(number).subscribe(res => {
      const fiscalYears = res.items;
      this._sharedService.fiscalYears.next({data: fiscalYears, type: 'first'});

      if (fiscalYears.length) {
        const defaultYear = fiscalYears.find(year => year.is_default == 1);
        let year = fiscalYears.some((e: any) => e.id == +this.selectedFiscalYearId);
        if (defaultYear) {
          this.selectedFiscalYearId = (this.selectedFiscalYearId && year) ? +this.selectedFiscalYearId : defaultYear?.id;
          this._sharedService.selectedFiscalYearId.next(this.selectedFiscalYearId);
        } else {
          this.selectedFiscalYearId = (this.selectedFiscalYearId && year) ? +this.selectedFiscalYearId : fiscalYears[0].id;
          this._sharedService.selectedFiscalYearId.next(this.selectedFiscalYearId);
        }
      } else {
        this._sharedService.selectedFiscalYearId.next(null);
      }
      this.dataLoadded.next(true);
    }, error => {
      this.dataLoadded.next(true);
    });
  }

}
