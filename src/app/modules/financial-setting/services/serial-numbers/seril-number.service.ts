import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from "src/environments/environment";

@Injectable({ providedIn: 'root' })
export class SerialNumbers {
    constructor(private httpClient: HttpClient) { }


    addSerialNumbers(data) {
        const url = `${environment.accountant_apiUrl}users/serial-numbers/store`
        return this.httpClient.post(url,data);
    }

    getSerialNumbers() {
        const url = `${environment.accountant_apiUrl}users/serial-numbers/get`
        return this.httpClient.get(url);
    }

}