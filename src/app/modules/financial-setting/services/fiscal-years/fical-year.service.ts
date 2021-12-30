import {HttpClient} from '@angular/common/http';
import {Injectable} from '@angular/core';

import {Observable} from 'rxjs';
import {map} from 'rxjs/operators';

import {ApiResponse} from 'src/app/shared/model/global';
import {environment} from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class FicalYearService {

  constructor(private http: HttpClient) {
  }

  /**
   * Add fiscal year data
   * @param body (Form value)
   * @param number ()
   * @returns
   */
  addFiscalYear(body, number): Observable<any> {
    const url = `${environment.accountant_apiUrl}users/fiscal-year/${number}/store`;
    return this.http.post(url, body);
  }

  /**
   * Get fiscal year data
   * @param id (company id)
   * @param keyWord (KeyWord to search for)
   * @param page (for pagination)
   */
  getFiscalYear(id, keyWord, page?: number): Observable<ApiResponse> {
    const url = `${environment.accountant_apiUrl}users/fiscal-year?mother_company_id=${id}&search_word=${keyWord}&page=${page}`;
    return this.http.get(url).pipe(map((res: any) => {
        return {
          data: this.itemsDataMapping(res?.items),
          code: res?.code,
          message: res?.message,
        };
      })
    );
  }

  /**
   *
   * @param id (Fiscal year id)
   * @returns
   */
  deleteFiscalYear(id): Observable<any> {
    const url = `${environment.accountant_apiUrl}users/fiscal-year/${id}/delete`;
    return this.http.delete(url);
  }

  /**
   *
   * @param id (Fiscal year id)
   * @param status (2 active || 1 inactive)
   * @returns
   */
  changeStatus(id, status): Observable<any> {
    const url = `${environment.accountant_apiUrl}users/fiscal-year/${id}/status/${status}`;
    return this.http.get(url);
  }

  /**
   *
   * @param id (Fiscal year id)
   * @param isDefault (1 default 2 not default)
   * @returns
   */
  changeIsDefault(id): Observable<any> {
    const url = `${environment.accountant_apiUrl}users/fiscal-year/${id}/default/`;
    return this.http.patch(url, {});
  }

  /**
   * Map users data to show in table
   * @param items
   * @returns
   */
  itemsDataMapping(items) {
    return items.map((item) => {
      return {
        ...item,
        accountDetails: `${item.name_ar}`,
        date: `${item.start_at_show} - ${item.start_hijry_at}`,
        endYear: `${item.end_at_show} - ${item.end_hijry_at}`,
        statusView: item?.status === 1 ? 'مفعله' : 'غير مفعله',
        isDefault: item?.is_default === 1,
      };
    });
  }
}
