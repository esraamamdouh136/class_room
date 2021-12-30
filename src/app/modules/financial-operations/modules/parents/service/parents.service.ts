import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ParentsService {

  constructor
    (
      private http: HttpClient
    ) { }


  getParents(page?: number, take?: number): Observable<any> {
    return this.http
      .get(`${environment.accountant_apiUrl}users/parents_files?take=${take}&page=${page}`);
  }

  getParentsTable(page?: number, search?): Observable<any> {
    return this.http
      .get(`${environment.accountant_apiUrl}users/parents_files?name=${search}&page=${page}`);
  }

  getFileById(id): Observable<any> {
    return this.http
      .get(`${environment.accountant_apiUrl}users/parents_files/find?id=${id}`);
  }

  createFamilyFile(body) {
    return this.http.post(`${environment.accountant_apiUrl}users/parents_files/store`, body)
  }

  updateParents(body) {
    return this.http.post(`${environment.accountant_apiUrl}users/fathers/store`, body)
  }

  storeAllFiles(body) {
    return this.http.post(`${environment.accountant_apiUrl}users/parents_files/store-all`, body)
  }

  updateStudent(body) {
    return this.http.post(`${environment.accountant_apiUrl}users/students/store`, body)
  }

  getRelations(motherNumber) {
    return this.http.get(`${environment.accountant_apiUrl}users/lists/${motherNumber}/relative-relations`)
  }

  getAllAttachments(id,searchWord,page) {
    return this.http.get(`${environment.accountant_apiUrl}users/parents_files/get/${id}/attachments?name=${searchWord}&page=${page}`)
  }

  getStudents(page?: number, take?: number): Observable<any> {
    return this.http
      .get(`${environment.accountant_apiUrl}users/students?take=${take}&page=${page}`);
  }

  getDataById(id) {
    return this.http
      .get(`${environment.accountant_apiUrl}users/fathers/find-by-id-number?identification_number=${id}`)
  }

  getSearchById(id, type?) {
    return this.http
      .get(`${environment.accountant_apiUrl}users/parents_files/find?id=${id}&arrow=${type}`)
  }

  uploadProfileImage(id, body) {
    return this.http
      .post(`${environment.accountant_apiUrl}users/parents_files/store/${id}/image`, body)
  }

  uploadParentsFileAttashment(id, body) {
    return this.http
      .post(`${environment.accountant_apiUrl}users/parents_files/store/${id}/attachments`, body)
  }

  public getIPAddress()  
  {  
    return this.http.get("https://iplist.cc/api");  
  } 
}



