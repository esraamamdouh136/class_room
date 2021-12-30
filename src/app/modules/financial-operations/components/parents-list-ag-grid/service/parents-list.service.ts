import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { TranslateService } from "@ngx-translate/core";
import { Observable } from 'rxjs';
import { map } from "rxjs/operators";
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ParentsListService {

  constructor
    (
      private http: HttpClient,
      private translation: TranslateService,
  ) { }


  getParentsTable(page?: number, search?, first?): Observable<any> {
    return this.http
      .get(`${environment.accountant_apiUrl}users/parents_files`, { params: { name: search, page: `${page}`, first: first } }).pipe(map((res: any) => {
        return {
          data: this.dataMapping(res.paginate?.data),
          total: res.paginate.total,
          message: res.message,
          code: res.code
        };
      }));
  }
  changeStatus(id: string, status: { status: number }) {
    return this.http
      .patch(`${environment.accountant_apiUrl}users/parents_files/status/${id}`, status)
  }

  dataMapping(res) {
    return res.map((res) => {
      return {
        ...res,
        statusView: res?.status === 1 ? this.translation.instant('general.active') : this.translation.instant('general.inactive'),
        fatherName: `${res?.father?.name_ar ? res?.father?.name_ar : ''} ${res?.father?.father_name_ar ? res?.father?.father_name_ar : ''} ${res?.father?.grandfather_name_ar ? res?.father?.grandfather_name_ar : ''}`,
        matherName: `${res?.mother?.name_ar ? res?.mother?.name_ar : ''} ${res?.mother?.father_name_ar ? res?.mother?.father_name_ar : ''} ${res?.mother?.grandfather_name_ar ? res?.mother?.grandfather_name_ar : ''}`,
        relativeName: `${res?.relative?.name_ar ? res?.relative?.name_ar : ''} ${res?.relative?.father_name_ar ? res?.relative?.father_name_ar : ''} ${res?.relative?.grandfather_name_ar ? res?.relative?.grandfather_name_ar : ''}`,
        email: res?.father?.email,
        childernLength: res?.students?.length
      };
    });
  }

  getImportFromParents(){
    return this.http.get(`${environment.accountant_apiUrl}users/lms/import-parents-request`)
  }

}
