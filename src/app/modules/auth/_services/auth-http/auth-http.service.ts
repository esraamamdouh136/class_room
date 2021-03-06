import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { HttpClient, HttpHeaders, HttpParams } from "@angular/common/http";
import { UserModel } from "../../_models/user.model";
import { environment } from "../../../../../environments/environment";
import { AuthModel } from "../../_models/auth.model";

const API_USERS_URL = `${environment.apiUrl}/auth`;

@Injectable({
  providedIn: "root",
})
export class AuthHTTPService {
  constructor(private http: HttpClient) { }

  // public methods
  // login(email: string, password: string): Observable<any> {
  //   return this.http.post<AuthModel>(`${API_USERS_URL}/login`, { email, password });
  // }

  // Login http request
  login(userData: any) {
    return this.http.post(
      environment.auth_apiUrl + "users/auth/" + userData.type + "/login",
      userData
    );
  }

  // logout http request
  logout() {
    return this.http.post(
      environment.auth_apiUrl + "users/profile/logout",
      {}
    );
  }

  // Call dashbord to check if user active TWA
  dashbord(url, header) {
    return this.http.get(url, header);
  }

  // Get Two way data
  getTwyScanData() {
    var header = {
      headers: new HttpHeaders().set(
        "Authorization",
        `Bearer  ${localStorage.getItem("token")}`
      ),
    };
    const url = `${environment.auth_apiUrl}users/profile/two_step/qr`;
    return this.http.get(url, header);
  }

  /**
   * SKIP SETTING QR CODE()
   */
  skipSettingQRCode() {
    let header = {
      headers: new HttpHeaders().set(
        "Authorization",
        `Bearer  ${localStorage.getItem("checkToken")}`
      ),
    };
    const ENDPOINT = `users/profile/two_step/skip`;
    return this.http.get(`${environment.auth_apiUrl}${ENDPOINT}`);
  }

  /**
   * Set qrcode data before verify
   * this request must be call before check code end point otherwise check endpoint fail
   * @param body (setcode)
   */
  setTwoWayData(body) {
    var header = {
      headers: new HttpHeaders().set(
        "Authorization",
        `Bearer  ${localStorage.getItem("token")}`
      ),
    };
    const ENDPOINT = `users/profile/two_step/qr/set`;
    return this.http.post(`${environment.auth_apiUrl}${ENDPOINT}`, body);
  }

  /**
   * When user click verify
   * @param body (opt-code)
   * @returns
   */
  verifyTwaCode(body) {
    var header = {
      headers: new HttpHeaders().set(
        "Authorization",
        `Bearer  ${localStorage.getItem("token")}`
      ),
    };
    const ENDPOINT = `users/profile/two_step/qr/check`;
    return this.http.post(`${environment.auth_apiUrl}${ENDPOINT}`, body);
  }

  changeTwoStepStatus(status){
    const body = {
      "status":status
    }
    const ENDPOINT = `users/settings/two-step-status`;
    return this.http.patch(`${environment.auth_apiUrl}${ENDPOINT}`, body);
  }

  changeSmsStatus(status){
    const body = {
      "status":status
    }
    const ENDPOINT = `users/settings/sms-status`;
    return this.http.patch(`${environment.auth_apiUrl}${ENDPOINT}`, body);
  }

  changeEmailStatus(status){
    const body = {
      "status":status
    }
    const ENDPOINT = `users/settings/email-status`;
    return this.http.patch(`${environment.auth_apiUrl}${ENDPOINT}`, body);
  }
  
  /**
   * @param name (google or facebook)
   * @param type (user or admin)
   * @returns
   */
  getSocialUrl(type: string, name: string) {
    let params = new HttpParams().set(
      "redirect",
      `${environment.redirect_url}?name=${name}&type=${type}`
    );
    return this.http.get(
      environment.auth_apiUrl + "users/auth/" + type + "/" + name + "/redirect",
      { params }
    );
  }

  /**
   * After user click account and redirect
   * @param name (google or facebook)
   * @param type (user or admin)
   * @param code (code generated by facebook or google)
   * @returns
   */
  loginSocial(name: string, type: string, code: string) {
    let body = {
      code: code,
      system_login_code: environment.system_login_code,
      redirect: `${environment.redirect_url}?name=${name}&type=${type}`,
    };
    let url =
      environment.auth_apiUrl + "users/auth/" + type + "/" + name + "/login";
    return this.http.post(url, body);
  }

  /**
   * Refresh user token
   */
  refreshToke() {
    const ENDPOINT = `users/profile/refresh`;
    return this.http.post(`${environment.auth_apiUrl}${ENDPOINT}`, {});
  }

  // CREATE =>  POST: add a new user to the server
  createUser(user: UserModel): Observable<UserModel> {
    return this.http.post<UserModel>(API_USERS_URL, user);
  }

  // Your server should check email => If email exists send link to the user and return true | If email doesn't exist return false
  forgotPassword(email: string): Observable<boolean> {
    return this.http.post<boolean>(`${API_USERS_URL}/forgot-password`, {
      email,
    });
  }

  getUserByToken(token): Observable<UserModel> {
    const httpHeaders = new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });
    return this.http.get<UserModel>(`${API_USERS_URL}/me`, {
      headers: httpHeaders,
    });
  }
}
