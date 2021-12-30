import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {environment} from '../../../../../environments/environment';
import {map} from 'rxjs/operators';
import {TranslateService, TranslateStore} from '@ngx-translate/core';

@Injectable({
    providedIn: 'root'
})
export class SemestersService {

    constructor(private http: HttpClient, private translateService: TranslateService) {
    }

    getSemesters(searchQuery?: string, page?: number): Observable<any> {
        return this.http
            .get(`${environment.accountant_apiUrl}users/semsters?name=${searchQuery}&page=${page}`)
            .pipe(
                map((data: any) => {
                    return {
                        data: this.mapSemesters(data.paginate.data),
                        total: data.paginate.total
                    };
                })
            );
    }

    changeStatus(id: string, status: { status: number }): Observable<any> {
        return this.http
            .patch(`${environment.accountant_apiUrl}users/semsters/status/${id}`, status);
    }

    addOrEditSemester(data): Observable<any> {
        return this.http
            .post(`${environment.accountant_apiUrl}users/semsters/store`, data);
    }

    mapSemesters(data) {
        return data?.map(res => {
            return {
                ...res,
                statusView: res.status === 1 ? this.translateService.instant('general.active') : this.translateService.instant('general.inactive'),
                status_c: res?.status === 1,
                date_start : this.formateDate(res?.start_at),
                date_end :  this.formateDate(res?.end_at)
            };
        });
    }

    formateDate(date){
        const formatedDate = date.split(/\//);
        return [ formatedDate[1], formatedDate[0], formatedDate[2] ].join('/');
    }

}
