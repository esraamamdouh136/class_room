import {HttpClient} from '@angular/common/http';
import {Injectable} from '@angular/core';

import {Observable} from 'rxjs';
import {map} from 'rxjs/operators';
import {ApiResponse} from 'src/app/shared/model/global';
import {environment} from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class UsersService {
  constructor(private http: HttpClient) {
  }

  /**
   * Get all users data
   * searchWord
   * page
   */
  getUsers(searchWord, page): Observable<ApiResponse> {
    const url = `${environment.auth_apiUrl}users/admin-management?search_word=${searchWord}&page=${page}`;
    return this.http.get(url).pipe(map((res: any) => {
      return {
        data: this.itemsDataMapping(res.items.data),
        length: res.items.total,
        message: res.message,
        code: res.code
      };
    }));
  }

  /**
   * Update user data
   * @param body
   * @param id (user id)
   * @returns
   */
  updateUserData(id, body): Observable<any> {
    const url = `${environment.auth_apiUrl}users/admin-management/${id}/update`;
    return this.http.post(url, body);
  }

  /**
   * Add new user
   * @param body
   * @returns
   */
  addUser(body): Observable<any> {
    const url = `${environment.auth_apiUrl}users/admin-management/add`;
    return this.http.post(url, body);
  }

  /**
   * Delete user
   * @param body
   * @returns
   */
  deleteUser(id): Observable<any> {
    const url = `${environment.auth_apiUrl}users/admin-management/${id}/delete`;
    return this.http.delete(url);
  }

  /**
   * Change status
   * @param body
   * @returns
   */
  changeStatus(id, status): Observable<any> {
    const url = `${environment.auth_apiUrl}users/admin-management/${id}/status/${status}`;
    return this.http.get(url);
  }

  /**
   * Assign role to user
   * @param (id) user id
   */
  assignRoleToUser(id, body): Observable<any> {
    const url = `${environment.auth_apiUrl}users/admin-management/${id}/roles`;
    return this.http.patch(url, body);
  }

  /**
   * Map users data to show in table
   * @param items
   * @returns
   */
  itemsDataMapping(items) {
    return items.map((item) => {
      return {
        ...item,
        statusView: item?.status == 1 ? 'مفعله' : 'غير مفعله',
      };
    });
  }

}
