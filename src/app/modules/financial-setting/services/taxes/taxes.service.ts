import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {environment} from '../../../../../environments/environment';
import {map} from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class TaxesService {

  constructor(private http: HttpClient) {
  }

  getTaxes(searchQuery: string = '', page?: number): Observable<any> {
    return this.http
      .get<{ paginate?: any, message: string }>(`${environment.accountant_apiUrl}users/taxes?name=${searchQuery}&page=${page}`)
      .pipe(
        map(it => {
          return {
            data: this.itemDataMapping(it.paginate?.data),
            total: it.paginate?.total,
            message: it.message
          };
        })
      );
  }

  addEditTax(tax): Observable<any> {
    return this.http
      .post(`${environment.accountant_apiUrl}users/taxes/store`, tax);
  }

  changeStatus(id: string, status: { status: number }): Observable<any> {
    return this.http
      .patch(`${environment.accountant_apiUrl}users/taxes/status/${id}`, status);
  }

  itemDataMapping(items) {
    return items?.map((item) => {
        return {
            ...item,
            account_details: `${item?.mother_company?.name}`,
            statusView: item?.status === 1 ? 'مفعله' : 'غير مفعله',
            status_c: item?.status === 1,
            nationalities: item?.countries?.map(it => it.title).length,
            image_path: item?.mother_company?.image_path,
            taxes: `${item?.percentage}% ${item?.name_ar}`,
            tax_number: item?.mother_company?.tax_number,
            taxFreeNationality: item?.countries.map(it => it?.id)
        };
    });
}
}
