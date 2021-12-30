import { HttpClient } from "@angular/common/http";
import { Injectable } from '@angular/core';
import { Observable } from "rxjs";
import { environment } from "src/environments/environment";

@Injectable({
  providedIn: 'root'
})
export class MotherCompaniseService {

  constructor(private http: HttpClient) { }

  /**
  * Get companies lists
  */
  motherCompanies(): Observable<any> {
    const url = `${environment.accountant_apiUrl}users/mother-companies?take=5000`
    return this.http.get(url)
  }

  updateCompanyData(number, data): Observable<any> {
    const url = `${environment.accountant_apiUrl}users/mother-companies/${number}/update`;
    return this.http.post(url, data);
  }

  /**
   * Delete company logo 
   * @param number (Company Id)
   * @returns 
   */
  deleteLogo(number): Observable<any> {
    const url = `${environment.accountant_apiUrl}users/mother-companies/${number}/delete-image`;
    return this.http.delete(url);
  }
}
