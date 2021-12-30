import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from "@angular/router";
import { ToastrService } from "ngx-toastr";
import { Subscription } from 'rxjs';
import { ProcessingService } from "../../services/processing.service";

@Component({
  selector: 'app-active-loading',
  templateUrl: './active-loading.component.html',
  styleUrls: ['./active-loading.component.scss']
})
export class ActiveLoadingComponent implements OnInit, OnDestroy {
  code;
  chanelId;
  showLoading: boolean = true;
  subscription: Subscription = new Subscription();


  constructor(private toaster: ToastrService,
    private router: Router,
    private processingService: ProcessingService,
    private activateRoute: ActivatedRoute,
  ) { }

  ngOnInit(): void {

    this.subscription.add(this.activateRoute.queryParams.subscribe((res) => {
      if (res?.code) {
        this.code = res.code;
        this.chanelId = localStorage.getItem('chanelId');
        this.activeEmail();
      }
    }));
  }


  activeEmail() {
    this.subscription.add(this.processingService.activeCode(this.chanelId, this.code).subscribe((res: any) => {
      this.router.navigate(['/processing/sheets-list'], { queryParams: { id: res?.item?.id } });
      localStorage.removeItem('chanelId');
    }, error => {
      localStorage.removeItem('chanelId')
      // if (error?.error?.errors) {
      //   this.toaster.error(error?.error?.error)
      //   localStorage.removeItem('chanelId')
      // }
    }));
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

}
