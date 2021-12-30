import { HttpClient } from "@angular/common/http";
import { Injectable } from '@angular/core';
import { Observable } from "rxjs";
import { map } from "rxjs/operators";
import { ApiResponse } from "src/app/shared/model/global";
import { environment } from "src/environments/environment";

@Injectable({
  providedIn: 'root'
})
export class CostCenterService {

  constructor(private http: HttpClient) { }

  /**
 * Get cost center
 * @param id (company id)
 * @param keyWord (KeyWord to search for)
 * @returns 
 */
  getCostCenters(page, keyWord): Observable<ApiResponse> {
    const url = `${environment.accountant_apiUrl}users/cost-centers?name=${keyWord}&page=${page}`;
    return this.http.get(url).pipe(map((res: any) => {
      return {
        data: this.itemsDataMapping(res.paginate.data),
        total: res.paginate.total,
        code: res.code,
        message: res.message
      }
    }));
  }

  /**
 * Add cost center
 * @param body (Form value)
 * @returns 
 */
  addCostCenters(body): Observable<any> {
    const url = `${environment.accountant_apiUrl}users/cost-centers/store`;
    return this.http.post(url, body);
  }

  /**
   * 
   * @param id (Costcenter id)
   * @param status (1 active || 2 in active )
   * @returns 
   */
  changeStatus(id, body): Observable<any> {
    const url = `${environment.accountant_apiUrl}users/cost-centers/status/${id}`;
    return this.http.patch(url, body);
  }

  /**
 * Map CostCenters data to show in table
 * @param items
 * @returns
 */
  itemsDataMapping(items) {
    return items?.map((item) => {
      return {
        ...item,
        areaName: item.cost_center_region?.name,
        branchName: item.cost_center_branch?.name,
        statusView: item?.status === 1 ? 'مفعله' : 'غير مفعله',
        add: item?.system_id ? 'إفتراضي' : 'يدوي'
      };
    });
  }

}
