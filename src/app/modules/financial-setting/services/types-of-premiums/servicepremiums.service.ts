import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ServicepremiumsService {

  constructor(private Http : HttpClient) { }

  getPremiums(search : string , pageNumber?) {
    return this.Http.get(`${environment.accountant_apiUrl}users/premium_types?name=${search}&page=${pageNumber}`)
  }
}
