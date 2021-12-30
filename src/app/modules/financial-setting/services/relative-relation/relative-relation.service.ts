import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../../environments/environment';
import { RelativeRelation } from '../../models/relative-relation/relative-relation';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class RelativeRelationService {

  constructor(private http: HttpClient) {
  }

  getRelativeRelationData(searchQuery: string = '', page?: number): Observable<any> {
    return this.http
      .get<{ paginate?: any, message: string }>(`${environment.accountant_apiUrl}users/relative-relations?name=${searchQuery}&page=${page}`
      )
      .pipe(
        map(it => {
          return {
            data: this.itemsDataMapping(it.paginate?.data),
            total: it.paginate?.total,
            message: it?.message
          };
        })
      );
  }

  addEditRelation(relation: RelativeRelation): Observable<any> {
    return this.http
      .post(`${environment.accountant_apiUrl}users/relative-relations/store`, relation);
  }

  // updateRelationStatus(status: { status: number }): Observable<any> {
  //   return this.http
  //     .patch(`${environment.accountant_apiUrl}users/relative-relations/status/:id`, status);
  // }

  changeStatus(id: string, status: { status: number }): Observable<any> {
    return this.http
      .patch(`${environment.accountant_apiUrl}users/relative-relations/status/${id}`, status);
  }

  itemsDataMapping(items) {
    return items?.map((item) => {
        return {
            ...item,
            statusView: item?.status === 1 ? 'مفعله' : 'غير مفعله',
            status_c: item?.status === 1
        };
    });
}
}
