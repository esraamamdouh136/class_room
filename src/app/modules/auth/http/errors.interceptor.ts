import { Injectable } from "@angular/core";
import {
  HttpEvent,
  HttpInterceptor,
  HttpHandler,
  HttpRequest,
  HttpErrorResponse,
} from "@angular/common/http";
import {
  Observable,
  of,
  throwError,
  throwError as observableThrowError,
} from "rxjs";
import { catchError } from "rxjs/operators";

import { Router } from "@angular/router";
import { environment } from "src/environments/environment";
import { ToastrService } from "ngx-toastr";

/**
 * Adds a default error handler to all requests.
 */
@Injectable({
  providedIn: "root",
})
export class ErrorHandlerInterceptor implements HttpInterceptor {
  constructor(private router: Router, private toastr: ToastrService) { }

  intercept(
    request: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    return next
      .handle(request)
      .pipe(catchError((error) => this.errorHandler(error)));
    // }
  }

  /**
   * Logs out the user and clear credentials.
   * @return True if the user was logged out successfully.
   */
  logout(): Observable<boolean> {
    // Customize credentials invalidation here
    // this.credentialsService.setCredentials();
    return of(true);
  }

  // Customize the default error handler here if needed
  private errorHandler(response: HttpEvent<any>): Observable<HttpEvent<any>> {
    if (!environment.production) {
      // Do something with the error
    }
    /**
     * pass validation errors to next > core form to handle it
     */
    if (response instanceof HttpErrorResponse) {

      if (response.status === 422) {
        throw response;
      }

      if (response.status == 400 && (response.error.code !== 4000 && response.error.code !== 5000)) {
        if (!response.url.includes('fathers/find-by-id-number')) {
          this.toastr.error(response.error.message);
        }
        throw response;
      }

      if (response.status === 302 && response.error.code === 3001) {
        localStorage.setItem('isFirstTime' , 'true')
        this.router.navigate(["/auth/twa-scan"]);
        throw response;
      } else if (response.status === 302 && response.error.code === 3002) {
        localStorage.removeItem('isFirstTime')
        this.router.navigate(["auth/verify-code"],{ queryParams: { allow: true } });
        throw response;
      }

      /**
       * logout when unauthenticated
       */
      if (response.status === 401) {
        let clearedData = ["checkToken", "user", "token", "expires_in", "expire_date",'ledgerViewData'];
        clearedData.forEach((element) => {
          localStorage.removeItem(element);
        });
        this.toastr.error(response.error.message);
        this.router.navigate(["/auth/login"]);
        throw response;
      }

      if (response.status === 500) {
        this.toastr.error("Server Error");
        throw response;
      }
      if (response.status === 404) {
        throw response;
      }
    }

    // if (response && response.name === 'TimeoutError') {
    //   this.shared.toastr.warning(
    //     response.message,
    //     this.shared.translate.instant('common.success')
    //   );
    //
    //   throw response;
    //
    // }

    /**
     * todo handle other error codes
     * handle errors like 500 and 401 etc
     */
    throw response;
  }
}
