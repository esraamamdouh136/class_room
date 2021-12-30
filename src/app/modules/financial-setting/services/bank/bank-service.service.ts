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
export class BankServiceService {
  constructor
  (
    private http: HttpClient,
    private translation: TranslateService,

  ) { }


getDataBanks( searchInput : string = '', page?: number): Observable<any> {
  return this.http
    .get(`${environment.accountant_apiUrl}users/banks?name=${searchInput}&page=${page}`).pipe(map((res : END_POINTS_INTERFACE) => {
      return {
        code : res.code,
        message : res.message,
        data : this.itemsDataMapping( res?.paginate.data),
        total: res?.paginate?.total
      }
     
    }))
}
changeStatus(id: string, status: { status: number }) {
  return this.http
    .patch(`${environment.accountant_apiUrl}users/banks/status/${id}`, status)
}
createNewBank(body) {
  return this.http.post(`${environment.accountant_apiUrl}users/banks/store`, body)
}

itemsDataMapping(data) {
  return data?.map(res => {
      return {
          ...res,
          statusView: res.status === 1 ?
              this.translation.instant('general.active') : this.translation.instant('general.inactive'),
          // status_c: res?.status === 1,
          date: res.updated_at,
          bank_fees_tax_per: res.bank_fees_tax_percentage + ' % ',
          bank_fees_per: res.bank_fees_percentage + ' % ',
          account_guide_title: res?.account_guide?.title
      };
  });
}

}



