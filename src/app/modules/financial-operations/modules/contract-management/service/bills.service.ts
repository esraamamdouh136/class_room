import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { END_POINTS_INTERFACE } from 'src/app/modules/financial-setting/models/endPoints/endPoints';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class BillsService {

  constructor(
    private http: HttpClient,
    private translation: TranslateService,
  ) { }



  getBillsTable(searchParams, page): Observable<any> {
    //invoices?status=&father_id=&number&student_id
    return this.http.get(`${environment.accountant_apiUrl}users/invoices?number=${searchParams.number}&father_id=${searchParams.father_id}&student_id=${searchParams.student_id}&page=${page}`)
      .pipe(map((res: END_POINTS_INTERFACE) => {
        return {
          data: this.itemsDataMapping(res?.paginate.data),
          total: res?.paginate?.total
        }
      }
      ))
  }

  itemsDataMapping(data) {
    return data.map((res: any) => {
      const element = res;
      if (element.status === 0 && element.paid == 0) {
        element.statusView = this.translation.instant('contracts.Unpaid');
      } else if (element.status === 0 && element.paid > 0) {
        element.statusView = this.translation.instant('contracts.ParialPaid');
        // element.status = 4;
      } else if (element.status === 1) {
        element.statusView = this.translation.instant('contracts.paid');
      } else {
        element.statusView = this.translation.instant('contracts.pendingPaid');
      }
      return {
        ...element,
      }
    })
  }

  downloadBill(id) {
    let headers = new HttpHeaders();
    headers = headers.set('Accept', 'application/pdf');

    return this.http.get(`${environment.accountant_apiUrl}users/invoices/${id}/pdf`,
      { headers: headers, responseType: 'blob' }
    )
  }
}
