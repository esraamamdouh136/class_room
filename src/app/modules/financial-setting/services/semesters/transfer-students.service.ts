import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {environment} from '../../../../../environments/environment';
import {map} from 'rxjs/operators';
import {TransferStudents} from '../../models/semester/semesters';

@Injectable({
  providedIn: 'root'
})
export class TransferStudentsService {

  constructor(private http: HttpClient) {
  }

  getStudents(data: { length: number, start: number, draw: number },
              // tslint:disable-next-line:variable-name
              class_id: number, school_id: number, season_id: number): Observable<any> {
    const path = `v1/schools/students`;
    return this.http
      .post(`${environment.accountant_apiUrl}users/lms/schools`, {
        path,
        params: {...data, school_id, season_id, class_id},
        method: 'get'
      })
      .pipe(
        map((res: any) => {
          return {data: res?.data?.data?.flat(), total: res?.data?.total};
        })
      );
  }

  getSchools(): Observable<any> {
    return this.http.post(`${environment.accountant_apiUrl}users/lms/schools`, {
      path: 'v1/schools/requireList',
      method: 'post',
      params: {
        require: ['schools']
      }
    }).pipe(
      map((res: any) => res?.data?.flat())
    );

  }

  getYears(schoolId: number): Observable<any> {
    return this.http.post(`${environment.accountant_apiUrl}users/lms/schools`, {
      path: 'v1/schools/requireList',
      method: 'post',
      params: {
        require: ['years:school.' + schoolId]
      }
    }).pipe(
      map((res: any) => res?.data?.flat())
    );
  }

  getSemesters(yearId: number): Observable<any> {
    return this.http.post(`${environment.accountant_apiUrl}users/lms/schools`, {
      path: 'v1/schools/requireList',
      method: 'post',
      params: {
        require: ['seasons:year.' + yearId]
      }
    }).pipe(
      map((res: any) => res?.data?.flat())
    );
  }

  getClass(schoolId: number): Observable<any> {
    return this.http.post(`${environment.accountant_apiUrl}users/lms/schools`, {
      path: 'v1/schools/requireList',
      method: 'post',
      params: {
        require: ['grades:school.' + schoolId]
      }
    }).pipe(
      map((res: any) => res?.data?.flat())
    );
  }

  getClassRooms(classId: number, semesterId: number, schoolId: number): Observable<any> {
    return this.http.post(`${environment.accountant_apiUrl}users/lms/schools`, {
      path: 'v1/schools/requireList',
      method: 'post',
      params: {
        require: [`classes:grade.${classId},season.${semesterId},school.${schoolId}`]
      }
    }).pipe(
      map((res: any) => res?.data?.flat())
    );
  }

  transferStudents(payload: TransferStudents): Observable<any> {
    return this.http.post(`${environment.accountant_apiUrl}users/lms/schools`, {
      path: 'v1/schools/transfer',
      method: 'post',
      params: payload
    });
  }
}
