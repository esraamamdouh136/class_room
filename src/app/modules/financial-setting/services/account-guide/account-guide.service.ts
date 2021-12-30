import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {environment} from '../../../../../environments/environment';
import {map} from 'rxjs/operators';
import {GuideTree} from '../../../../shared/model/global';
import {ledgerParamsData} from '../../models/account-guide/global';

@Injectable({
  providedIn: 'root'
})
export class AccountGuideService {

  constructor(private http: HttpClient) {
  }

  getGuideTree(searchQuery?: string): Observable<any> {
    return this.http
      .get<{ tree: any[] }>(`${environment.accountant_apiUrl}users/account_guide`)
      .pipe(
        map(data => data.tree)
      );
  }

  getGuideTreeFlattened(motherCompanyNumber: number): Observable<any> {
    return this.http
      .get(`${environment.accountant_apiUrl}users/lists/${motherCompanyNumber}/account-guide-allow-add-subaccount?show-according-selection=1`);
  }

  getCode(accountGuideId: number): Observable<any> {
    return this.http
      .get(`${environment.accountant_apiUrl}users/account_guide/code?parent_id=${accountGuideId}`);
  }

  addSubAccount(parentId: number, data: GuideTree): Observable<any> {
    return this.http
      .post(`${environment.accountant_apiUrl}users/account_guide/create-sub/${parentId}`, data);
  }

  updateAccount(accountId: number, data: GuideTree): Observable<any> {
    return this.http
      .patch(`${environment.accountant_apiUrl}users/account_guide/update-item/${accountId}`, data);
  }

  getLedgerData(data: ledgerParamsData): Observable<any> {
    return this.http
      .get(`${environment.accountant_apiUrl}users/journal_entries/ledger/?
            status=${data.status}&${data.journal_module_id}&date_from=${data.date_from}&
            date_to=${data.date_to}&${data.statement}&${data.father_id}&${data.student_id}&${data.cost_center_id}&
            ${data.cost_center_branch_id}&${data.cost_center_region_id}&${data.tag}&account_guide_id=${data.account_guide_id}&currency_id=${data.currency_id}`);
  }

  getStudents(): Observable<any> {
    return this.http
      .get(`${environment.accountant_apiUrl}users/students`);
  }

  makeParentReceivable(accountGuideId: number): Observable<any> {
    return this.http
      .patch(`${environment.accountant_apiUrl}users/account_guide/parents-receivables`,
        {
          account_guide_id: accountGuideId
        });
  }
}
