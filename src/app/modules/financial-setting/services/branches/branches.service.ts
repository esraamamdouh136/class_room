import { HttpClient } from "@angular/common/http";
import { Injectable } from '@angular/core';
import { Observable } from "rxjs";
import { SharedService } from "src/app/shared/services/shared.service";
import { environment } from "src/environments/environment";

@Injectable({
  providedIn: 'root'
})
export class BranchesService {

  constructor(private http: HttpClient) { }
  selectedCompanyNumber;


  /**
   * Get all branches data
   * @param searchWord
   * @param page
   * @returns
   */
  getAllBranches(searchWord, page?): Observable<any> {
    const url = `${environment.accountant_apiUrl}users/cost-center-branches?name=${searchWord}&page=${page}`;
    return this.http.get(url);
  }

  /**
   * Add new area
   * @param body
   * @returns
   */
  addBranch(body): Observable<any> {
    const url = `${environment.accountant_apiUrl}users/cost-center-branches/store`;
    return this.http.post(url, body);
  }

  /**
   * Change status
   * @param body
   * @returns
   */
  changeStatus(id, status): Observable<any> {
    const url = `${environment.accountant_apiUrl}users/cost-center-branches/status/${id}`
    return this.http.patch(url, { status: status });
  }
}
