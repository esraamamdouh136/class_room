import {HttpClient} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {TranslateService} from '@ngx-translate/core';
import {map} from 'rxjs/operators';
import {environment} from 'src/environments/environment';
import {END_POINTS_INTERFACE} from '../../financial-setting/models/endPoints/endPoints';

@Injectable({
  providedIn: 'root'
})
export class ProcessingService {

  constructor(
    private http: HttpClient,
    private translation: TranslateService,
  ) {
  }

  getChannelsData(search: string, page?) {
    return this.http
      .get(`${environment.accountant_apiUrl}users/google/channels?name=${search}&page=${page}`)
      .pipe(
        map((res: END_POINTS_INTERFACE) => {
          return {
            code: res.code,
            message: res.message,
            data: this.itemsDataMapping(res?.paginate.data),
            total: res?.paginate?.total
          };
        }));
  }

  changeStatus(id: string) {
    return this.http.get(`${environment.accountant_apiUrl}users/google/channels/remove-link/${id}`);
  }

  createNewChannel(data) {
    return this.http.post(`${environment.accountant_apiUrl}users/google/channels/store`, data);
  }

  getUrlDrive(id: number, baseUrL) {
    return this.http.patch(`${environment.accountant_apiUrl}users/google/channels/request-link/${id}`, baseUrL);
  }

  setIsDefault(id: number) {
    return this.http.patch(`${environment.accountant_apiUrl}users/google/channels/${id}/default`, {});
  }

  // Active email after get permissions
  activeCode(channelID: number, code) {
    const body = {
      uri: environment.GoogleDriveRedirectUrl,
      code
    };
    return this.http
      .patch(`${environment.accountant_apiUrl}users/google/channels/request-link/${channelID}/active`, body);
  }

  itemsDataMapping(data) {
    return data?.map(res => {
      return {
        ...res,
        isConnected: res.is_connected === false ?
          this.translation.instant('general.not_connected') : this.translation.instant('general.connected'),
        email: res.profile?.email,
        isDefault: res?.is_default === 1,
      };
    });
  }
}

