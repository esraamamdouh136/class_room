import {Component, OnInit} from '@angular/core';
import {AuthService} from 'src/app/modules/auth';
import {Router} from '@angular/router';
import {SecurityTypesStatus} from 'src/app/shared/model/global';

@Component({
  selector: 'app-security',
  templateUrl: './security.component.html',
  styleUrls: ['./security.component.scss']
})
export class SecurityComponent implements OnInit {
  twoStepStatus = null;
  smsStatus = '';
  emailStatus = '';

  constructor(private authService: AuthService, private router: Router) {
  }

  ngOnInit(): void {
    this.twoStepStatus = JSON.parse(localStorage.getItem('user'))?.two_step_status;
    this.smsStatus = JSON.parse(localStorage.getItem('user'))?.sms_status;
    this.emailStatus = JSON.parse(localStorage.getItem('user'))?.email_status;
  }

  chanageTwoStepStatus(status) {
    if (this.twoStepStatus === 1) {
      this.authService.changeStatus(0, SecurityTypesStatus.twoStep).subscribe(res => {
        localStorage.setItem('user', JSON.stringify(res.item));
        this.twoStepStatus = res.item.two_step_status;
        console.log(res);
      });
    } else {
      this.router.navigate(['auth/twa-scan'], {queryParams: {allow: true}});
    }
  }

  chanageSmsStatus(status) {
    this.authService.changeStatus(status, SecurityTypesStatus.sms).subscribe(res => {
      localStorage.setItem('user', JSON.stringify(res.item));
      this.smsStatus = res.item.sms_status;
    });
  }

  chanageEmailStatus(status) {
    this.authService.changeStatus(status, SecurityTypesStatus.email).subscribe(res => {
      localStorage.setItem('user', JSON.stringify(res.item));
      this.emailStatus = res.item.email_status;
    });
  }

}
