import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor
} from '@angular/common/http';
import { Observable } from 'rxjs';
import { finalize, tap } from 'rxjs/operators';
import { NgxSpinnerService } from 'ngx-spinner';

@Injectable()
export class LoaderInterceptor implements HttpInterceptor {


  count = 0;

  constructor(private spinner: NgxSpinnerService) { }

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    

    if (
      !(req.params.has('name') && req.params.getAll('name')[0]) &&
      !(req.params.has('first') && !req.params.getAll('first')[0]) &&
      !req.url.includes('autocomplete')
    ) {
      this.spinner.show()
    } 
    
    this.count++;

    return next.handle(req)

      .pipe(tap(

      ), finalize(() => {

        this.count--;

        if (this.count == 0) this.spinner.hide()
      })
      );
  }
}
