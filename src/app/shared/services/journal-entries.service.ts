import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {environment} from '../../../environments/environment';
import {JournalEntries} from '../model/global';


@Injectable({
  providedIn: 'root'
})
export class JournalEntriesService {

  constructor(private http: HttpClient) {
  }

  addJournalEntry(taxId: number, entries: { tax_linked_account: JournalEntries[] }): Observable<any> {
    return this.http
      .patch(`${environment.accountant_apiUrl}users/taxes/${taxId}/journals`, entries);
  }

  getJournalEntries(
    arrow: 'first' | 'last' | 'next' | 'equal' | 'previous',
    journalModuleId?: string,
    id?: string,
    target?: string): Observable<any> {
    return this.http
      .get(`${environment.accountant_apiUrl}users/journal_entries/find?arrow=${arrow}&journal_module_id=${journalModuleId}${target?.length ? '&setting_show=' + target : ''}${id?.length ? '&id=' + id : ''}`);
  }

  addEntry(data: FormData): Observable<any> {
    return this.http
      .post(`${environment.accountant_apiUrl}users/journal_entries/store`, data);
  }

  addJournalEntrySpecialAccount(taxId: number, entries: { special_discount_linked_account: JournalEntries[] }): Observable<any> {
    return this.http
      .patch(`${environment.accountant_apiUrl}users/special-discounts/${taxId}/journals`, entries);
  }

  getNumber(date: string): Observable<any> {
    return this.http
      .patch(`${environment.accountant_apiUrl}users/journal_entries/get-number`, {date});
  }

  addJournalEntryPaymentMethodAccount(id: number, entries: { payment_method_linked_account: JournalEntries[] }): Observable<any> {
    return this.http
      .patch(`${environment.accountant_apiUrl}users/payment_methods/${id}/journals`, entries);
  }
}
