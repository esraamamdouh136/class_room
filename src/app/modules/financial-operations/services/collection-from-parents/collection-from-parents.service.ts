import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {environment} from '../../../../../environments/environment';
import {map} from 'rxjs/operators';
import {TranslationService} from '../../../i18n/translation.service';


@Injectable({
  providedIn: 'root'
})
export class CollectionFromParentsService {

  constructor(private http: HttpClient, private translationService: TranslationService) {
  }

  getParentCollection(
    type: 'collections' | '',
    arrow: 'first' | 'last' | 'next' | 'equal' | 'previous',
    id?: string,
    target?: string
  ): Observable<any> {
    return this.http
      .get(`${environment.accountant_apiUrl}users/parent_collections/find?arrow=${arrow}${id?.length ? '&id=' + id : ''}${target ? '&setting_show=' + target : ''}`);
  }

  getInvoices(id: { student_id?: number, father_id?: number ,amount?:number}): Observable<any> {
    return this.http
      .patch(`${environment.accountant_apiUrl}users/parent_collections/invoices`, id)
      .pipe(
        map((data: any) => data?.items)
      );
  }

  getStudents(motherCompanyNumber: number, name?: string): Observable<any> {
    return this.http
      .get(`${environment.accountant_apiUrl}users/lists/${motherCompanyNumber}/students-autocomplete${name?.length ? '?search_word=' + name : ''}`)
      .pipe(
        map((data: any) => data?.items)
      );
  }

  getParents(motherCompanyNumber: string, name?: string): Observable<any> {
    return this.http
      .get(`${environment.accountant_apiUrl}users/lists/${motherCompanyNumber}/fathers-autocomplete${name?.length ? '?search_word=' + name : ''}`);
  }

  addParentCollection(data: FormData, voucherType: 'collections' | ''): Observable<any> {
    return this.http
      .post(`${environment.accountant_apiUrl}users/parent_collections/store`, data);
  }

  getSandookBalance(paymentMethodId: number, voucherType: 'collections' | ''): Observable<any> {
    const methodId = voucherType === 'collections' ? {payment_method_id: paymentMethodId} : {receipt_method_id: paymentMethodId};
    return this.http
      .patch(`${environment.accountant_apiUrl}users/parent_${voucherType}/get-payment-balance`, methodId);
  }

  getLedgerData(options: { father_id: number, date_from: string, date_to: string }): Observable<any> {
    return this.http
      .get(`${environment.accountant_apiUrl}users/journal_entries/ledger?father_id=${options?.father_id}&date_from=${options?.date_from}&date_to=${options?.date_to}&is_parents_receivable=1`);
  }

  getPaymentMethods(): Observable<any> {
    return this.http
      .get(`${environment.accountant_apiUrl}users/payment_methods`);
  }

  getNumber(date: string, voucherType: 'collections' | ''): Observable<any> {
    return this.http
      .patch(`${environment.accountant_apiUrl}users/parent_${voucherType}/get-number`, {date});
  }
}
