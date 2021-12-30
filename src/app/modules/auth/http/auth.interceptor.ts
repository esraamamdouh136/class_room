import { Injectable } from '@angular/core';
import {
  HttpEvent,
  HttpInterceptor,
  HttpHandler,
  HttpRequest,
  HttpHeaders,
} from '@angular/common/http';
import { forkJoin, Observable } from 'rxjs';
import { AuthService } from '../_services/auth.service';
import { SharedService } from 'src/app/shared/services/shared.service';
import { switchMap, take, tap } from 'rxjs/operators';
import { TopNavService } from "src/app/shared/services/top-nav.service";

// import { TokenService } from "@admin/shared/token.service";

/**
 * Prefixes all requests not starting with `http[s]` with `environment.serverUrl`.
 */
@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  constructor(private auth: AuthService, private _shredService: SharedService, private _topNavService: TopNavService) {
  }

  intercept(
    request: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    const token = this.auth.getToken();

    const selectedCompanyNumber = this._shredService.selectedCompanyNumber$.pipe(take(1));
    const selectedJob = this._shredService.selectedRoleId$.pipe(take(1));
    const selectedCostCenter = this._shredService.selectedConstCenterId$.pipe(take(1));
    const selectedFiscalYear = this._shredService.selectedFiscalYearId$.pipe(take(1));
    const dataLoaded = this._topNavService.dataLoadded$.pipe(take(1));

    return forkJoin([selectedCompanyNumber, selectedJob, selectedCostCenter, selectedFiscalYear, dataLoaded]).pipe(tap(res => {
      let header = {};

      // if (res.every(val => val)) {
      //   header['x-current-mother-company'] = `${res[0]}`;
      //   header['x-current-role'] = `${res[1]}`;
      //   header['x-current-cost-center'] = `${res[2]}`;
      //   header['x-current-fiscal-year'] = `${res[3]}`;
      // }
      // if (res[4]) {
      // }
      if (res[0]) {
        header['x-current-mother-company'] = `${res[0]}`;
      }
      if (res[1]) {
        header['x-current-role'] = `${res[1]}`;
      }
      if (res[2]) {
        header['x-current-cost-center'] = `${res[2]}`;
      }
      if (res[3]) {
        header['x-current-fiscal-year'] = `${res[3]}`;
      }

      if (token && token.length && !request.url.includes('iplist.cc')) {
        header['Authorization'] = `Bearer ${token}`;
        const headers = new HttpHeaders(header);
        request = request.clone({ headers });
      }
    }), switchMap(res => {
      return next.handle(request);
    }));
  }
}
