import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Injectable } from '@angular/core';
import { TranslateService } from "@ngx-translate/core";
import { Observable, of } from "rxjs";
import { map } from "rxjs/operators";
import { END_POINTS_INTERFACE } from "src/app/modules/financial-setting/models/endPoints/endPoints";
import { environment } from "src/environments/environment";

@Injectable({
  providedIn: 'root'
})
export class ContractsService {

  constructor(
    private http: HttpClient,
    private translation: TranslateService,
  ) { }

  getContractsTable(search?: string, page?): Observable<any> {
    return this.http.get(`${environment.accountant_apiUrl}users/contracts?name=${search}&page=${page}`)
      .pipe(map((res: END_POINTS_INTERFACE) => {
        return {
          data: this.itemsDataMapping(res?.paginate.data),
          total: res?.paginate?.total
        }
      }
      ))
    // return of(DUMMY_CONTRACTS)
  }

  updateContract(body): Observable<any> {
    // return this.http.get(`${environment.accountant_apiUrl}users/contract-templates?name=${search}&page=${page}`)
    // .pipe(map((res : END_POINTS_INTERFACE) => {
    //   return {
    //     data : this.itemsDataMapping( res?.paginate.data),
    //   }}
    // ))
    return of([])
  }

  addContract(body): Observable<any> {
    return this.http.post(`${environment.accountant_apiUrl}users/contracts/store`, body)
    // return of([])
  }

  getStudentsList(companyNum, word): Observable<any> {
    return this.http.get(`${environment.accountant_apiUrl}users/lists/${companyNum}/students-autocomplete?search_word=${word}`)
  }

  getBillById(id): Observable<any> {
    return this.http.get(`${environment.accountant_apiUrl}users/invoices/${id}/find`)
  }

  getContractsList(): Observable<any> {
    return this.http.get(`${environment.accountant_apiUrl}users/contract-templates`)
  }

  changeStatus(id, status): Observable<any> {
    const url = `${environment.accountant_apiUrl}users/contracts/status/${id}`;
    return this.http.patch(url, { status })
  }

  uploadContractModel(data) {
    // const url = `${environment.auth_apiUrl}users/admin-management/${id}/status/${status}`;
    return of({
      message: 'success'
    })
  }

  downloadContract(id, params) {
    let pathParams = new URLSearchParams(params).toString()
    let headers = new HttpHeaders();
    headers = headers.set('Accept', 'application/pdf');

    return this.http.get(`${environment.accountant_apiUrl}users/contracts/${id}/pdf?${pathParams}`,
      { headers: headers, responseType: 'blob' }
    )
  }
  
  uploadContractToUser(id, params) {
    let pathParams = new URLSearchParams(params).toString()

    return this.http.get(`${environment.accountant_apiUrl}users/contracts/${id}/pdf?${pathParams}`)
  }

  itemsDataMapping(data) {
    return data.map((res: any) => {
      return {
        ...res,
        statusView: res.status === 1 ?
          this.translation.instant('general.active') : this.translation.instant('general.inactive'),
          total : Math.round((res.total + Number.EPSILON) * 100) / 100,
          has_invoice_total : Math.round((res.has_invoice_total + Number.EPSILON) * 100) / 100,
          amountRest : Math.round((res.total - res.has_invoice_total + Number.EPSILON) * 100) / 100
      }
    })
  }
}


export const DUMMY_CONTRACTS = [

  {
    contractNum: 2,
    addContractDate: '1-1-2022',
    studentName: "gad mohamed",
    fatherName: 'father',
    semaster: 'العاشر',
    class: 'الاول',
    statusView: 'مفعل',
    contractName: 'اسم العقد',
    cateogriesoffees: [
      {
        name: 'رسوم دراسية - فئة 7000 ريال',
        id: 1
      },
      {
        name: ' رسوم زي مدرسي - فئة 5000 ريال',
        id: 2
      },
      {
        name: ' رسوم زي مدرسي - فئة 5000 ريال',
        id: 3
      },
      {
        name: ' رسوم زي مدرسي - فئة 5000 ريال',
        id: 4
      },
    ],
    status: 1,
    service: 'رسوم دراسيه - خدمه',
    contractPrice: '5000',
  },
  {
    contractNum: 2,
    addContractDate: '1-1-2022',
    studentName: "gad mohamed",
    fatherName: 'father',
    semaster: 'العاشر',
    class: 'الاول',
    statusView: 'غير مفعل',
    contractName: 'اسم العقد',
    cateogriesoffees: [
      {
        name: 'gad',
        id: 5
      },
      {
        name: 'gad',
        id: 6
      },
      {
        name: 'gad',
        id: 7
      },
      {
        name: 'gad',
        id: 8
      },
    ],
    status: 2,
    service: 'رسوم دراسيه - خدمه',
    contractPrice: '5000',
  },
  {
    contractNum: 2,
    addContractDate: '1-1-2022',
    studentName: "gad mohamed",
    fatherName: 'father',
    semaster: 'العاشر',
    class: 'الاول',
    statusView: 'مفعل',
    contractName: 'اسم العقد',
    cateogriesoffees: [
      {
        name: 'gad',
        id: 9
      },
      {
        name: 'gad',
        id: 2
      },
      {
        name: 'gad',
        id: 3
      },
      {
        name: 'gad',
        id: 4
      },
    ],
    status: 1,
    service: 'رسوم دراسيه - خدمه',
    contractPrice: '5000',
  }
]