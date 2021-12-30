import { Injectable } from '@angular/core';
import { ToastrService } from "ngx-toastr";

@Injectable({
  providedIn: 'root'
})
export class MessagesService {

  constructor(
    private toaster: ToastrService,
  ) { }

  showErrorMessage(message,title?: string){
    this.toaster.error(message,title);
  }

  showSuccessMessage(message,title?: string){
    this.toaster.success(message,title);
  }
}
