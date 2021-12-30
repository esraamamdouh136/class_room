import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from "src/environments/environment";
import { Observable, of } from "rxjs";

@Injectable({ providedIn: 'root' })
export class StudyYearsService {

    constructor(private http: HttpClient) {
    }

    // Study years
    getStudyYears(): Observable<any> {
        const body = {
            path: 'v1/schools/years/list',
            params: {},
            method: 'get'
        }
        return this.http
            .post(`${environment.accountant_apiUrl}users/lms/schools`, body);
    }

    getStudyYearDetails(id): Observable<any> {
        const body = {
            path: `v1/schools/years/${id}`,
            params: {},
            method: 'get'
        }
        return this.http
            .post(`${environment.accountant_apiUrl}users/lms/schools`, body);
    }


    /**
     * Add study year
     * @returns 
     */
    addEditStudent(data): Observable<any> {
        const body = {
            path: 'v1/schools/years',
            params: { ...data },
            method: 'post'
        }
        return this.http
            .post(`${environment.accountant_apiUrl}users/lms/schools`, body);
    }

    /**
     * Update study year
     * @returns 
     */
    updateStudyYear(data, id): Observable<any> {
        const body = {
            path: `v1/schools/years/${id}`,
            params: { ...data },
            method: 'patch'
        }
        return this.http
            .post(`${environment.accountant_apiUrl}users/lms/schools`, body);
    }

    /**
     * Set season as current
     * @param yearId 
     * @param seasonId 
     * @returns {Observable}
     */
    setAsCurrent(yearId, seasonId): Observable<any> {
        const body = {
            path: `v1/schools/years/${yearId}/seasons/${seasonId}/setCurrent`,
            params: {},
            method: 'post'
        }
        return this.http
            .post(`${environment.accountant_apiUrl}users/lms/schools`, body);
    }

    /**
     * Delete study year
     * @param yearId 
     * @returns {Observable}
     */
    deleteStudyYears(id): Observable<any> {
        const body = {
            path: 'v1/schools/years/' + id,
            params: {},
            method: 'delete'
        }
        return this.http
            .post(`${environment.accountant_apiUrl}users/lms/schools`, body);
    }


    // Study years weeks Section

    // Get study weeks data
    getStudyWeeks(keyWord?): Observable<any> {
        const body = {
            path: `v1/schools/weeks?title=${keyWord}`,
            params: {},
            method: 'get'
        }
        return this.http
            .post(`${environment.accountant_apiUrl}users/lms/schools`, body);
    }

    // Get study weeks data
    getStudyWeeksTableBySubject(subject): Observable<any> {

        const body = {
            path: `v1/schools/weeks/table?subject_id=${subject?.id}`,
            params: {},
            method: 'get'
        }
        return this.http
            .post(`${environment.accountant_apiUrl}users/lms/schools`, body);
    }

    // Get one study weeks
    getStudyWeekByOne(id,subjectID): Observable<any> {
        const body = {
            path: `v1/schools/weeks/getOne?id=${id}&subject_id=${subjectID}`,
            params: {},
            method: 'get'
        }
        return this.http
            .post(`${environment.accountant_apiUrl}users/lms/schools`, body);
    }

    /**
     * Add study weeks
     * @returns 
     */
    saveStudyWeeks(data): Observable<any> {
        const body = {
            path: 'v1/schools/weeks',
            params: { ...data },
            method: 'post'
        }
        return this.http
            .post(`${environment.accountant_apiUrl}users/lms/schools`, body);
    }

    /**
     * Update study weeks
     * @returns 
     */
    updateStudyWeeks(data): Observable<any> {
        const body = {
            path: 'v1/schools/weeks/update',
            params: { ...data },
            method: 'post'
        }
        return this.http
            .post(`${environment.accountant_apiUrl}users/lms/schools`, body);
    }

    /**
     * assign Lecture To Week
     * @returns 
     */
    assignLectureToWeek(data): Observable<any> {
        const body = {
            path: 'v1/schools/weeks/assignLectures',
            params: { ...data },
            method: 'post'
        }
        return this.http
            .post(`${environment.accountant_apiUrl}users/lms/schools`, body);
    }


    deleteStudyWeek(data): Observable<any> {
        const body = {
            path: 'v1/schools/weeks',
            params: { ...data },
            method: 'delete'
        }
        return this.http
            .post(`${environment.accountant_apiUrl}users/lms/schools`, body);
    }

    getSeasons(data): Observable<any> {
        const body = {
            path: `v1/schools/requireList`,
            params: { ...data },
            method: 'post'
        }
        return this.http
            .post(`${environment.accountant_apiUrl}users/lms/schools`, body);
    }

    // Get Classes
    getClasses(): Observable<any> {
        const body = {
            path: `v1/schools/requireList`,
            params: { ...{ "require": ["grades"] } },
            method: 'post'
        }
        return this.http
            .post(`${environment.accountant_apiUrl}users/lms/schools`, body);
    }

    // Get Subjects
    getSubjects(selectedClass): Observable<any> {
        const body = {
            path: `v1/schools/requireList`,
            // params: { ...{ "require": [`subjects:grade.${selectedClass?.id}`] } },
            params: { ...{ "require": ['subjects:grade.355'] } },
            method: 'post'
        }

        return this.http
            .post(`${environment.accountant_apiUrl}users/lms/schools`, body);
    }

}