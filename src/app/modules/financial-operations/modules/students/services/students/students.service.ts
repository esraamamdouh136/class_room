import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {environment} from '../../../../../../../environments/environment';
import {map} from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class StudentsService {

  path = 'v1/schools/students';

  constructor(private http: HttpClient) {
  }

  //  // from marwan
  //  getStudents(data: {length: number, start: number, draw: number}): Observable<any> {
  //    return this.http
  //      .post(`${environment.accountant_apiUrl}users/lms/schools`, {path: this.path, params: data, method: 'get'});
  //  }
  //
  //
  //  addEditStudent(student: any, mode: 'save' | 'update'): Observable<any> {
  //    return this.http
  //      .post(`${environment.accountant_apiUrl}users/lms/schools`, {path: this.path + '/' + mode, params: student, method: 'post'});
  //  }

  getStudents(searchQuery: string = '', page: number): Observable<any> {
    return this.http
      .get(`${environment.accountant_apiUrl}users/students?page=${page}&name=${searchQuery}`).pipe(
        map((res: any) => {
          return {data: res?.paginate?.data, total: res?.paginate?.total};
        })
      );
  }

  addEditStudent(student: any): Observable<any> {
    return this.http.post(`${environment.accountant_apiUrl}users/students/store`, student);
  }
}
