import { HttpClient } from "@angular/common/http";
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { NavChange } from '../model/global';

@Injectable({
  providedIn: 'root'
})
export class SharedService {

  navData: BehaviorSubject<any> = new BehaviorSubject(null);
  navData$ = this.navData.asObservable();

  fiscalYears: BehaviorSubject<any> = new BehaviorSubject(null);
  fiscalYears$ = this.fiscalYears.asObservable();

  selectedCompanyId: BehaviorSubject<any> = new BehaviorSubject(null);
  selectedCompanyId$ = this.selectedCompanyId.asObservable();

  selectedCompany: BehaviorSubject<any> = new BehaviorSubject(null);
  selectedCompany$ = this.selectedCompany.asObservable();

  selectedCompanyNumber: BehaviorSubject<any> = new BehaviorSubject(null);
  selectedCompanyNumber$ = this.selectedCompanyNumber.asObservable();

  selectedRoleId: BehaviorSubject<any> = new BehaviorSubject(null);
  selectedRoleId$ = this.selectedRoleId.asObservable();

  selectedConstCenterId: BehaviorSubject<any> = new BehaviorSubject(null);
  selectedConstCenterId$ = this.selectedConstCenterId.asObservable();

  selectedFiscalYearId: BehaviorSubject<any> = new BehaviorSubject(null);
  selectedFiscalYearId$ = this.selectedFiscalYearId.asObservable();

  costCenterChanged: BehaviorSubject<any> = new BehaviorSubject(null);
  costCenterChanged$ = this.selectedFiscalYearId.asObservable();

  userImagePath: BehaviorSubject<any> = new BehaviorSubject(null);
  userImagePath$ = this.userImagePath.asObservable();
  // Top nav change
  navChanged: BehaviorSubject<any> = new BehaviorSubject(null);
  navChanged$: Observable<NavChange> = this.navChanged.asObservable();

  // General setting menu
  generalLedgerMenu: BehaviorSubject<any> = new BehaviorSubject([]);
  generalLedgerMenu$ = this.generalLedgerMenu.asObservable();


  serverErrors: BehaviorSubject<any> = new BehaviorSubject({});
  serverErrors$ = this.serverErrors.asObservable();

  scrollToTop: BehaviorSubject<any> = new BehaviorSubject(false);
  scrollToTop$ = this.scrollToTop.asObservable();

  toggleHeaderMenu: BehaviorSubject<boolean> = new BehaviorSubject(false);
  toggleMenu = this.toggleHeaderMenu.asObservable();

  constructor(
    private http: HttpClient
  ) {
  }

  /**
   * To convert arabic date to english date
   * @param date (arabic date)
   * @returns (English date)
   */
  convertToEnglishDate(date) {
    return date.replace(/[\u0660-\u0669]/g,
      d => d.charCodeAt() - 1632);
  }

  removeNullValues(obj) {
    Object.keys(obj).forEach(key => {
      if (!obj[key]) {
        delete obj[key];
      }
    });
    return obj;
  }

  // get user country form ip address
  getIPAddress() {
    return this.http.get("https://iplist.cc/api");
  }
}
