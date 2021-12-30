import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { END_POINTS_INTERFACE } from '../../models/endPoints/endPoints';

@Injectable({
  providedIn: 'root'
})
export class categoriesFeesService {

  constructor
    (
      private HTTP: HttpClient,
      private translation : TranslateService
    ) { }

  // Get All Data 
  getCategories(searchQuery, page?): Observable<any> {
    return this.HTTP.get
      (`${environment.accountant_apiUrl}users/fees_types?name=${searchQuery}&page=${page}`).pipe(map((res : END_POINTS_INTERFACE) => {
        return {
          code : res.code,
          message : res.message,
          data : this.itemsDataMapping( res?.paginate.data),
          total: res?.paginate?.total
        }
       
      }))
  }


  categories_body(body) {
    return this.HTTP
      .post(`${environment.accountant_apiUrl}users/fees_types/store`, body);
  }

  changeStatus(id: string, status: { status: number }) {
    return this.HTTP
      .patch(`${environment.accountant_apiUrl}users/fees_types/status/${id}`, status)
  }

  getCalc(body) {
    return this.HTTP
      .patch(`${environment.accountant_apiUrl}users/fees_types/calc`, body)
  }

  getDataById(id) {
    return this.HTTP
      .get(`${environment.accountant_apiUrl}users/fees_types/${id}/find`)

  }

  itemsDataMapping(res) {
    return res.map((res) => {
      return {
        ...res,
        statusView: res.status === 1 ? this.translation.instant('general.active') : this.translation.instant('general.inactive'),
        status_c: res?.status === 1,
        date: res.updated_at
      };
    });
  }
}


