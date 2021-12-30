import { Injectable } from '@angular/core';
import { HttpClient } from "@angular/common/http";

import { Observable } from "rxjs";
import { map } from "rxjs/operators";

import { ApiResponse } from "src/app/shared/model/global";
import { environment } from "src/environments/environment";

@Injectable({
  providedIn: 'root'
})
export class CurrenciesService {

  constructor(private http: HttpClient) { }

  /**
 * Add Currency
 * @param body (Form value)
 * @returns 
 */
  addCurrency(body): Observable<any> {
    const url = `${environment.accountant_apiUrl}users/currencies/store`;
    return this.http.post(url, body);
  }

  /**
   * Get Currencies
   * @param id (company id)
   * @param keyWord (KeyWord to search for)
   * @returns 
   */
  getCurrencies(data): Observable<ApiResponse> {
    const url = `${environment.accountant_apiUrl}users/currencies?search_word=${data.keyword}&mother_company_id=${data.companyId}&mother_company_number=${data.companyNumber}&page=${data.page}`;
    return this.http.get(url).pipe(map((res: any) => {
      return {
        data: this.itemsDataMapping(res?.items?.data),
        total: res?.items.total,
        code: res?.code,
        message: res?.message,
      }
    }));
  }

  /**
   * @param id (Currency id)
   * @returns 
   */
  deleteCurrency(id): Observable<any> {
    const url = `${environment.accountant_apiUrl}users/currencies/${id}/delete`;
    return this.http.delete(url);
  }

  /**
   * 
   * @param id (Currency id)
   * @param status (2 active || 1 inactive)
   * @returns 
   */
  changeStatus(id, status): Observable<any> {
    const url = `${environment.accountant_apiUrl}users/currencies/${id}/status/${status}`;
    return this.http.get(url);
  }

  /**
   * 
   * @param id (Currency id)
   * @param isDefault (1 default 2 not default)
   * @returns 
   */
  changeIsDefault(id): Observable<any> {
    const url = `${environment.accountant_apiUrl}users/currencies/${id}/default/`;
    return this.http.patch(url, {});
  }

  itemsDataMapping(items) {
    return items.map((item, index) => {
      return {
        ...item,
        sequence: index + 1,
        statusView: item?.status == 1 ? "مفعله" : "غير مفعله",
        isDefault: item?.is_default === 1 ? true : false,
      };
    });
  }

}
