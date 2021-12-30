import {Component, OnInit} from '@angular/core';
import {BasicInformationService} from '../../services/basic-information.service';
import {finalize} from 'rxjs/operators';
import {Subscription} from 'rxjs';
import {Profile} from '../../models/personal-details';

@Component({
  selector: 'app-alerts',
  templateUrl: './alerts.component.html',
  styleUrls: ['./alerts.component.scss']
})
export class AlertsComponent implements OnInit {

  subscription: Subscription = new Subscription();
  confirmationLink = 'https://t.me/viewclass_accountantbot';
  dataLoaded = false;
  formErrors;
  profile: Profile = {};
  confirmLoading = false;
  enableEdit = true;
  confirmationResponse;
  notifications = [];

  constructor(private basicInformationService: BasicInformationService) {
  }

  ngOnInit(): void {
    this.getProfile();
    this.getNotification();
  }

  getProfile(): void {

    this.dataLoaded = false;
    this.subscription.add(this.basicInformationService
      .getProfileData()
      .pipe(
        finalize(() => this.dataLoaded = true)
      )
      .subscribe(
        (res) => {
          this.profile = res?.item;
          if (this.profile.telegram_id) {
            this.enableEdit = false;
          }
        }
      ));
  }

  getNotification(){
    this.basicInformationService.getSettingNotification().subscribe(res => {
      this.notifications = res.item;
    })
  }

  updateNotification(key,status){    
    const body ={
      [key] : !status
    }
    this.basicInformationService.updateSettingNotification(body).subscribe(res => {
      this.notifications.map(e => {
        if(e.key == key){
          e.status = !e.status
        }
      })
    })
  }

  setTelegramUsername(): void {
    if (this.profile.telegram_username.trim() && !this.confirmationResponse) {
      this.confirmLoading = true;
      this.basicInformationService
        .setTelegramData({username: this.profile.telegram_username})
        .pipe(
          finalize(() => this.confirmLoading = false)
        )
        .subscribe(
          (res) => {
            // this.toaster.success('');
            this.confirmationResponse = res?.item?.telegram_code;
            this.getProfile();
          }
        );
    } else if(this.confirmationResponse) {
      window.location.reload();
    }
  }

  changeEditStatus(npt: HTMLInputElement): void {
    this.enableEdit = !this.enableEdit;
    if (this.enableEdit) {
      npt.focus();
    }
  }

}
