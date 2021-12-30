import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { map } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { END_POINTS_INTERFACE } from '../../models/endPoints/endPoints';

@Injectable({
  providedIn: 'root'
})
export class SpecialDiscountsService {
  constructor
    (
      private http: HttpClient,
      private translation: TranslateService,

    ) { }

  getSpecialDoscounts(search: string = '', page?: number) {
    return this.http.get
      (`${environment.accountant_apiUrl}users/special-discounts?name=${search}&page=${page}`).pipe(map((res : END_POINTS_INTERFACE) => {
        return {
          code : res.code,
          message : res.message,
          data : this.itemsDataMapping( res?.paginate.data),
          total: res?.paginate?.total
        }
       
      }))
    
  }
  changeStatus(id: string, status: { status: number }) {
    return this.http.patch(`${environment.accountant_apiUrl}users/special-discounts/status/${id}`, status)
  }
  editSpecialDoscounts(data) {
    return this.http.post(`${environment.accountant_apiUrl}users/special-discounts/store`, data)
  }

  itemsDataMapping(data) {
    return data?.map(res => {
        return {
            ...res,
            statusView: res.status === 1 ? this.translation.instant('general.active') : this.translation.instant('general.inactive'),
            status_c: res?.status === 1,
            discount_per: res.discount_percentage ? res.discount_percentage + ' % ' : '',
            classrooms_str: res.classrooms.map((classroom, index) => {
                return index + 1 != res.classrooms.length ? classroom.name + ' ' + ' | ' : classroom.name + ' ';
            })
        };
    });
}
}
