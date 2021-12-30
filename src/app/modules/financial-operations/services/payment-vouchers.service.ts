import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {environment} from '../../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class PaymentVouchersService {

  constructor(private http: HttpClient) {
  }

  getPaymentVouchers(
    voucherType: 'payment' | 'receipt',
    arrow: 'first' | 'last' | 'next' | 'equal' | 'previous', id?: string, target?: string
  ): Observable<any> {
    return this.http
      .get(`${environment.accountant_apiUrl}users/${voucherType}_vouchers/find?arrow=${arrow}${id?.length ? '&id=' + id : ''}${target?.length ? '&setting_show=' + target : ''}`);
  }

  addPaymentVoucher(data: FormData, voucherType: 'payment' | 'receipt'): Observable<any> {
    return this.http
      .post(`${environment.accountant_apiUrl}users/${voucherType}_vouchers/store`, data);
  }

  getNumber(date: string, voucherType: 'payment' | 'receipt'): Observable<any> {
    return this.http
      .patch(`${environment.accountant_apiUrl}users/${voucherType}_vouchers/get-number`, {date});
  }

  getPaymentMethods(): Observable<any> {
    return this.http
      .get(`${environment.accountant_apiUrl}users/payment_methods`);
  }

  getSandookBalance(paymentMethodId: number, voucherType: 'payment' | 'receipt'): Observable<any> {
    const methodId = voucherType === 'payment' ? {payment_method_id: paymentMethodId} : {receipt_method_id: paymentMethodId};
    return this.http
      .patch(`${environment.accountant_apiUrl}users/${voucherType}_vouchers/get-${voucherType}-balance`, methodId);
  }
}
