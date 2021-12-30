import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {BehaviorSubject, Observable} from 'rxjs';
import {environment} from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class CheckBeginningBalanceService {

  hasBeginningBalance: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);

  constructor(private http: HttpClient) {
  }

  checkBeginningBalance(): Observable<any> {
    return this.http
      .get(`${environment.accountant_apiUrl}users/journal_entries/check-beginning-balance`);
  }
}
