import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable, of } from "rxjs";
import { environment } from "src/environments/environment";

@Injectable({
  providedIn: "root",
})
export class ValidateManagmentService {
  constructor(private http: HttpClient) {}

  /**
   * Get All Roles
   */
  listRoles(): Observable<any> {
    const url = `${environment.auth_apiUrl}users/admin-roles`;
    return this.http.get(url);
  }

  listPermissions(): Observable<any> {
    const url = `${environment.auth_apiUrl}users/admin-roles/permissions`;
    return this.http.get(url);
  }

  findById(roleId): Observable<any> {
    const url = `${environment.auth_apiUrl}users/admin-roles/${roleId}/find`;
    return this.http.get(url);
  }

  addNewRole(body) {
    const url = `${environment.auth_apiUrl}users/admin-roles/add`;
    return this.http.post(url, body);
  }

  updateRolePermission(id, body) {
    const url = `${environment.auth_apiUrl}users/admin-roles/${id}/update`;
    return this.http.put(url, body);
  }
}
