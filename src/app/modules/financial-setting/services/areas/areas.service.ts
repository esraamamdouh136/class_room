import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Injectable } from '@angular/core';
import { TranslateService } from "@ngx-translate/core";
import { Observable } from "rxjs";
import { distinctUntilChanged, map } from "rxjs/operators";
import { SharedService } from "src/app/shared/services/shared.service";
import { environment } from "src/environments/environment";
import { END_POINTS_INTERFACE } from "../../models/endPoints/endPoints";

@Injectable({
  providedIn: 'root'
})
export class AreasService {

  constructor(
    private http: HttpClient,
    private _sharedService: SharedService,
    private translation: TranslateService,

    ) {
    this._sharedService.selectedCompany$.pipe(distinctUntilChanged()).subscribe(val => {
    this.selectedCompanyNumber = val?.number;
    })
  }
  selectedCompanyNumber;


  /**
   * Get all areas data
   * @param searchWord
   * @returns 
   */
  getAllAreas(searchWord, page): Observable<any> {
    return this.http.get(`${environment.accountant_apiUrl}users/cost-center-regions?name=${searchWord}&page=${page}`).pipe(map((res : END_POINTS_INTERFACE) => {
      return {
        code : res.code,
        message : res.message,
        data : this.itemsDataMapping( res?.paginate.data),
        total: res?.paginate?.total
      }
     
    }))
  }

  /**
   * Add new area 
   * @param body
   * @returns 
   */
  addArea(body): Observable<any> {
    const url = `${environment.accountant_apiUrl}users/cost-center-regions/store`;
    return this.http.post(url, body);
  }

  /**
   * Change status
   * @param body
   * @returns 
   */
  changeStatus(id, status): Observable<any> {
    const url = `${environment.accountant_apiUrl}users/cost-center-regions/status/${id}`;
    return this.http.patch(url, { status: status });
  }

  itemsDataMapping(items) {
    return items.map((item) => {
      return {
        ...item,
        branches: item?.cost_center_branches?.map(it => it?.id),
        statusView: item?.status == 1 ? this.translation.instant('general.active') : this.translation.instant('general.inactive'),
      };
    });
  }
}
