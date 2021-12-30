import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})

/**
 * Manipulate the HTTP requests for the wohle app
 * handle the main POST, GET, UPDATE, DELETE methods
 */
export class ApiService {
  constructor(private http: HttpClient) { }

  /**
   * Post request using angular httpClient module
   * @param {string} url - the end point url
   * @param {any} data - request paiload
   * @return {Observable} Observable of response, comes from the end point
   */
  postReq(domain: string, url: string, data: any, options?: any): Observable<any> {
    const authData = JSON.parse(
      localStorage.getItem('v723demo3-authf649fc9a5f55')
    );
    const httpHeaders = new HttpHeaders({
      Authorization: `Bearer ${authData['access_token']}`,
    });
    return this.http.post(domain + url, data, { headers: httpHeaders });
  }

  /**
   * Get request using angular httpClient module
   * @param {string} url - the end point url
   * @param {?any} [data] - request paiload
   * @return {Observable} Observable of response, comes from the end point
   */
  getReq(domain: string, url: string, data?: any): Observable<any> {
    // const authData = JSON.parse(
    //   localStorage.getItem('v723demo3-authf649fc9a5f55')
    // );
    // const httpHeaders = new HttpHeaders({
    //   Authorization: `Bearer ${authData['access_token']}`,
    // });
    return this.http.get(domain + url);
  }

  /**
   * Get request using angular httpClient module
   * you can bass a parameter (data) in the url seperated by '/'
   * @param {string} url - the end point url
   * @param {string} data - request paiload
   * @return {Observable} Observable of response, comes from the end point
   */
  //   getHeaderReq(url: string, data: string): Observable<any> {
  //     return this.http.get(environment.serverUrl + url + '/' + data);
  //   }

  /**
   * PUT request using angular httpClient module
   * you can bass a parameter (data) in the url seperated by '/'
   * @param {string} url - the end point url
   * @param {?any} data - request paiload
   * @return {Observable} Observable of response, comes from the end point
   */
  putReq(domain: string, url: string, data?: any): Observable<any> {
    return this.http.put(domain + url, data);
  }

  /**
   * DELETE request using angular httpClient module
   * you can bass a parameter (data) in the url seperated by '/'
   * @param {string} url - the end point url
   * @param {?any} data - request paiload
   * @return {Observable} Observable of response, comes from the end point
   */
  deleteReq(domain: string, url: string, data?: any): Observable<any> {
    const options = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
      }),
      body: data,
    };
    if (data){
      return this.http.delete(domain + url, options);
    } else {
      return this.http.delete(domain + url);
    }
      
  }
}
