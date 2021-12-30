import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ParentsListService {

  constructor
    (
      private http: HttpClient
    ) { }


  getParentsTable(page?: number, search?, first?): Observable<any> {
    return this.http
      .get(`${environment.accountant_apiUrl}users/parents_files`, { params: { name: search, page: `${page}`, first: first } });
  }
  changeStatus(id: string, status: { status: number }) {
    return this.http
      .patch(`${environment.accountant_apiUrl}users/parents_files/status/${id}`, status)
  }
}
