import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class BasicInformationService {

  constructor(private http: HttpClient) {
  }

  getProfileData(): Observable<any> {
    return this.http
      .get(`${environment.auth_apiUrl}users/profile`);
  }

  /**
   * Update user data 
   */
  updateUserData(body): Observable<any> {
    return this.http
      .patch(`${environment.auth_apiUrl}users/profile/update-data`, body);
  }

  /**
   * Update user image 
   */
  updateUserImage(body): Observable<any> {
    return this.http
      .post(`${environment.auth_apiUrl}users/profile/change-my-image`, body);
  }

  /**
   * Remove user image 
   */
  removeUserImage(): Observable<any> {
    return this.http
      .delete(`${environment.auth_apiUrl}users/profile/remove-image`);
  }

  /**
   * Change user password 
   */
  changePassword(body): Observable<any> {
    return this.http
      .post(`${environment.auth_apiUrl}users/profile/change-password`, body);
  }

  setTelegramData(username: { username: string }): Observable<any> {
    return this.http
      .patch<{ item: any }>(`${environment.auth_apiUrl}users/settings/set-telergam`, username);
  }

  getSettingNotification(): Observable<any> {
    return this.http
      .get(`${environment.auth_apiUrl}users/settings/get-notifications`).pipe(map((res:any) => {
        return {
          ...res,
          item : this.mapNotifications(res.item), 
        }
      }));
  }

  updateSettingNotification(body): Observable<any> {
    return this.http
      .patch(`${environment.auth_apiUrl}users/settings/update-notifications`, body);
  }

  mapNotifications(data){
    const notifications = data.map(element => {
      return {
        key : Object.keys(element)[0],
        status : element[Object.keys(element)[0]] == 1 ? true : false
      }
    });
    return notifications
  }

}
