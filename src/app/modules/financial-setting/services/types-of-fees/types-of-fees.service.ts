import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../../environments/environment';
import { map } from 'rxjs/operators';
import { TypesOfFees } from '../../models/types-of-fees/types-of-fees';
import {TranslateService} from '@ngx-translate/core';

@Injectable({
  providedIn: 'root'
})
export class TypesOfFeesService {

  constructor(private http: HttpClient, private translation: TranslateService) {
  }

  getTypesOfFees(searchQuery: string, page: number): Observable<any> {
    return this.http
      .get<{ paginate?: any }>(`${environment.accountant_apiUrl}users/fees_classes?name=${searchQuery}&page=${page}`).pipe(
        map(it => {
          return {
            data: this.mapTypesOfFees(it?.paginate?.data),
            total: it.paginate?.total
          };
        })
      );
    ;
  }

  addEditTypesOfFees(body): Observable<any> {
    return this.http
      .post(`${environment.accountant_apiUrl}users/fees_classes/store`, body);
  }

  changeStatus(id: string, status: { status: number }): Observable<any> {
    return this.http
      .patch(`${environment.accountant_apiUrl}users/fees_classes/status/${id}`, status);
  }

  mapTypesOfFees(items) {
    return items?.map((item) => {
      return {
        ...item,
        cost_center_name: item?.cost_center.name,
        statusView: item?.status === 1 ? this.translation.instant('general.active') : this.translation.instant('general.inactive'),
        status_c: item?.status === 1,
        date: item?.updated_at
      };
    });
  }

}
