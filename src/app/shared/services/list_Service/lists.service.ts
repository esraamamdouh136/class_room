import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { map } from "rxjs/operators";
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class ListsService {
  constructor(private http: HttpClient) {
  }

  /**
   * Get countries lists
   */
  countries(): Observable<any> {
    const url = `${environment.accountant_apiUrl}users/lists/countries`;
    return this.http.get(url);
  }

  /**
   * Get languages lists
   */
  langs(): Observable<any> {
    const url = `${environment.accountant_apiUrl}users/lists/languages`;
    return this.http.get(url);
  }

  /**
   * Get Zone lists
   */
  zones(): Observable<any> {
    const url = `${environment.accountant_apiUrl}users/lists/zones`;
    return this.http.get(url).pipe(map((res: any) => {
      return {
        items: this.mapZones(res.items),
        code: res.code,
      };
    }));
  }

  /**
   * Get DateFormate lists
   */
  dateFormats(): Observable<any> {
    const url = `${environment.accountant_apiUrl}users/lists/date_formats`;
    return this.http.get(url);
  }

  /**
   * Get companies lists
   */
  motherCompanies(): Observable<any> {
    const url = `${environment.accountant_apiUrl}users/lists/mother-companies`;
    return this.http.get(url);
  }

  /**
   * Get CostCenters
   */
  costCenters(motherCompanyNum, showRegion?: 1 | 0): Observable<any> {
    const baseUrl = `${environment.accountant_apiUrl}users/lists/${motherCompanyNum}/cost-centers`;
    const url = showRegion ? `${baseUrl}?show-regions=${showRegion}` : baseUrl;
    return this.http.get(url);
  }

  /**
   * Get users roles
   */
  usersRoles(): Observable<any> {
    const url = `${environment.auth_apiUrl}users/admin-management/list-roles`;
    return this.http.get(url);
  }


  /**
   * Get fiscal-year
   * @param number (Company number)
   * @param id (costCenter number)
   * @returns
   */
  getFiscalYear(number): Observable<any> {
    const url = `${environment.accountant_apiUrl}users/lists/${number}/fiscal-years`;
    // const url = `${environment.accountant_apiUrl}users/lists/${number}/fiscal-years?cost_center_id=${id}`
    return this.http.get(url);
  }

  /**
   * Get nav lists
   */
  getNavLists(): Observable<any> {
    const url = `${environment.accountant_apiUrl}users/lists/nav`;
    return this.http.get(url);
  }

  /**
   * Get areas
   */
  getAreas(companyNum): Observable<any> {
    const url = `${environment.accountant_apiUrl}users/lists/${companyNum}/cost-centers-regions`;
    return this.http.get(url);
  }


  getRegions(motherCompanyNumber: number): Observable<any> {
    return this.http
      .get(`${environment.accountant_apiUrl}users/lists/${motherCompanyNumber}/cost-centers-regions`);
  }

  /**
   * Get branches
   */
  getBranches(companyNum, costCenter?): Observable<any> {
    const url = `${environment.accountant_apiUrl}users/lists/${companyNum}/cost-centers-branches?cost_center_region_id=${costCenter}`;
    return this.http.get(url);
  }

  getClassRoomsList(companyNum, costCenter?) {
    return this.http.get(
      `${environment.accountant_apiUrl}users/lists/${companyNum}/classrooms?cost_center_id=${costCenter}`
    );
  }

  getTaxes(companyNum, costCenter?) {
    return this.http.get(
      `${environment.accountant_apiUrl}users/lists/${companyNum}/taxes?cost_center_id=${costCenter}`
    );
  }


  getSemster(companyNum, costCenter?, fiscal_year_id?) {
    return this.http.get(
      `${environment.accountant_apiUrl}users/lists/${companyNum}/semsters?cost_center_id=${costCenter}&fiscal_year_id=${fiscal_year_id}`
    );
  }

  getBank(companyNum, costCenter) {
    return this.http.get(
      `${environment.accountant_apiUrl}users/lists/${companyNum}/banks?cost_center_id=${costCenter}`
    );
  }


  getJournalParameters(): Observable<any> {
    return this.http
      .get(`${environment.accountant_apiUrl}users/lists/journal_parameters`);
  }

  getJournalModules(): Observable<any> {
    return this.http
      .get(`${environment.accountant_apiUrl}users/lists/journal_modules`);
  }

  getCurrencies(companyNum: number, fiscalYearId: number): Observable<any> {
    return this.http
      .get(`${environment.accountant_apiUrl}users/lists/${companyNum}/currencies?fiscal_year_id=${fiscalYearId}`);
  }

  getFeesClasses(companyNum: number, costCenterId: number): Observable<any> {
    return this.http
      .get(`${environment.accountant_apiUrl}users/lists/${companyNum}/fees_classes?cost_center_id=${costCenterId}`);
  }

  getCaseStudies(companyNum: number, costCenterId: number): Observable<any> {
    return this.http
      .get(`${environment.accountant_apiUrl}users/lists/${companyNum}/case-studies?cost_center_id=${costCenterId}`);
  }

  getAllFathers(companyNumber): Observable<any> {
    return this.http
      .get(`${environment.accountant_apiUrl}users/lists/${companyNumber}/fathers`);
  }

  getAllStudents(companyNumber, fatherId): Observable<any> {
    return this.http
      .get(`${environment.accountant_apiUrl}users/lists/${companyNumber}/students?father_id=${fatherId}`);
  }

  /**
   * Get account guide tree latest
   */

  getAccountGuideTree(companyNumber: number): Observable<any> {
    return this.http.get(
      `${environment.accountant_apiUrl}users/lists/${companyNumber}/account-guide-tree-latest?show-according-selection=1`
    ).pipe(
      map(items => this.mapAccountGuid(items))
    );
  }

  getStudentsListAutoComplete(companyNum, word): Observable<any> {
    return this.http.get(`${environment.accountant_apiUrl}users/lists/${companyNum}/students-autocomplete?search_word=${word}`)
  }

  getFathersListAutoComplete(companyNum, word): Observable<any> {
    return this.http.get(`${environment.accountant_apiUrl}users/lists/${companyNum}/fathers-autocomplete?search_word=${word}`)
  }

  getParentsAutoComplete(companyNum, word): Observable<any> {
    return this.http.get(`${environment.accountant_apiUrl}users/lists/${companyNum}/parents-file-autocomplete?search_word=${word}`).pipe(
      map((res:any) => {
        return {
          items: this.mapParentsFile(res.items),
          code: res.code,
        }
      })
    )
  }

  getGeneralDiscount(companyNum: number, costCenterId: number, classId: number): Observable<any> {
    return this.http
      .get(`${environment.accountant_apiUrl}users/lists/${companyNum}/general_discounts?cost_center_id=${costCenterId}&classroom_id=${classId}`);
  }

  getSpecialDiscount(companyNum: number, costCenterId: number, classId: number): Observable<any> {
    return this.http
      .get(`${environment.accountant_apiUrl}users/lists/${companyNum}/special_discounts?cost_center_id=${costCenterId}&classroom_id=${classId}`);
  }

  // mapping the account guide to show it like this (title - code)
  mapAccountGuid(items) {
    return items?.map((item) => {
      item.viewLabel = item?.code ? item?.title + ' - ' + item?.code : item?.title;
      return item;
    });
  }

  mapZones(zones: Array<any>) {
    const ZonesArr = [];
    for (const [key, value] of Object.entries(zones)) {
      ZonesArr.push({
        key,
        value
      });
    }
    return ZonesArr;
  }

  mapParentsFile(parentsFiles: any[]) {
    return parentsFiles.map(file => {
      file.full_name = `${file?.father?.full_name}/${file?.mother?.name}`
      return file
    })
  }


}

// 296703 27
