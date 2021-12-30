import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from "src/environments/environment";

@Injectable({ providedIn: 'root' })
export class ConnectEducation {
    constructor(private http: HttpClient) { }

    connectToEducationSystem(body) {
        const url = `${environment.accountant_apiUrl}users/set-lms-user`;
        return this.http.post(url, body);
    }

}