import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { of } from "rxjs";
import { map } from 'rxjs/operators';
import { END_POINTS_INTERFACE } from 'src/app/modules/financial-setting/models/endPoints/endPoints';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ServiceService {

  constructor(
    private http : HttpClient,
    private translation: TranslateService,

    ) { }

  getContracts(search : string , page?) {
    return this.http.get(`${environment.accountant_apiUrl}users/contract-templates?name=${search}&page=${page}`)
    .pipe(map((res : END_POINTS_INTERFACE) => {
      return {
        data : this.itemsDataMapping( res?.paginate.data),
        total: res?.paginate?.total
      }}
    ))
  }

  changeStatus(id : string , status : {status : number}) {
    return this.http.patch(`${environment.accountant_apiUrl}users/contract-templates/status/${id}` , status)
  }
  createNewContract(data) {
    return this.http.post(`${environment.accountant_apiUrl}users/contract-templates/store` , data)
  }

  editContractById(id){
    return this.http.get(`${environment.accountant_apiUrl}users/contract-templates/${id}/find`)
  }

  getListFeesType(mother_company , cost_center , fees_class_id , classroom_id){
    return this.http.get(`${environment.accountant_apiUrl}users/lists/${mother_company}/fees_types?cost_center_id=${cost_center}&fees_class_id=${fees_class_id}&classroom_id=${classroom_id}`)
  }

  itemsDataMapping(data) {
    return data.map((res:any)=>{
      return {
        ...res,
        statusView: res.status === 1 ?
        this.translation.instant('general.active') : this.translation.instant('general.inactive'),
        itemsLen : res.items.length
      }
    })
  }
  getStudents() {
    return this.http.get(`${environment.accountant_apiUrl}users/students`)
  }
}