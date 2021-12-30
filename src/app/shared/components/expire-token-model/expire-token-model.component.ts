import {Component, OnInit, TemplateRef, ViewChild} from '@angular/core';
import {Router} from '@angular/router';
import {NgbModal, NgbModalOptions, NgbProgressbarConfig} from '@ng-bootstrap/ng-bootstrap';
import {AuthService} from 'src/app/modules/auth';
import {SharedService} from '../../services/shared.service';

@Component({
  selector: 'app-expire-token-model',
  templateUrl: './expire-token-model.component.html',
  styleUrls: ['./expire-token-model.component.scss']
})
export class ExpireTokenModelComponent implements OnInit {

  @ViewChild('refreshTokenModel', {static: true}) refreshTokenModel: TemplateRef<any>;

  value = 0;
  isOpened = false;
  dataNow;
  expireDate;
  interval;
  modalOption: NgbModalOptions = {};

  constructor(
    private modalService: NgbModal,
    private _NgbProgressbarConfig: NgbProgressbarConfig,
    private _AuthService: AuthService,
    private authService: AuthService,
    private router: Router,
    private shredService: SharedService
  ) {
    // customize default values of progress bars used by this component tree
    _NgbProgressbarConfig.max = 30;
    _NgbProgressbarConfig.striped = true;
    _NgbProgressbarConfig.animated = true;
    _NgbProgressbarConfig.type = 'success';
    _NgbProgressbarConfig.height = '20px';

  }

  ngOnInit(): void {
    this.startInterval();
  }

  open(content) {
    this.modalOption.backdrop = 'static';
    this.modalOption.keyboard = false;
    this.modalOption.ariaLabelledBy = 'modal-basic-title';
    this.modalService.open(content, this.modalOption).result.then((result) => result);
  }

  // Interval approach
  startInterval() {
    this.interval = setInterval(() => {
      let expireDate = +localStorage.getItem('expire_date');
      let dataNow = new Date().getTime();
      if (expireDate > dataNow && ((expireDate - dataNow < 31 * 1000) || expireDate < dataNow)) {
        if (!this.isOpened) {
          this.open(this.refreshTokenModel);
        }
        this.isOpened = true;
        this.value += 1;
        if (this.value > 30) {
          this.modalService.dismissAll();
          clearInterval(this.interval);
          this.logOut();
        }
      }
    }, 1000);
  }


  refreshToken() {
    this._AuthService.refreshToke().subscribe((res: any) => {
      clearInterval(this.interval);
      this.modalService.dismissAll();
      this.isOpened = false;
      this.value = 0;
      localStorage.setItem('user', JSON.stringify(res.item));
      localStorage.setItem('token', res.access_token);
      localStorage.setItem('expires_in', res.expires_in);
      this.authService.accessToken = res.access_token;
      const date = new Date().getTime() + res.expires_in * 1000;
      this.authService.saveDateToLocalStorage(date);
      this.interval = '';
      this.startInterval();
    });
  }

  logOut() {
    this.authService.logout().subscribe(res => {
      this.shredService.navData.next(null);
      let clearedData = ['checkToken', 'user', 'token', 'columStatus' ,'expires_in', 'expire_date', 'selectedComNumber', 'selectedFiscalYearId', 'selectedRoleId', 'selectedCostCenterId','ledgerViewData'];
      clearedData.forEach(element => {
        localStorage.removeItem(element);
      });
      this.router.navigate(['/auth/login'], {
        queryParams: {},
      });
    });
    this.modalService.dismissAll();
    window.location.reload();
  }

  ngOnDestroy() {
    clearInterval(this.interval);
  }

}
