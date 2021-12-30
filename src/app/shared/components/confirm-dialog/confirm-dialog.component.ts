import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {ToastrService} from 'ngx-toastr';
import {ApiService} from '../../services/api.service';


@Component({
  selector: 'app-confirm-dialog',
  templateUrl: './confirm-dialog.component.html',
  styleUrls: ['./confirm-dialog.component.scss']
})
export class ConfirmDialogComponent implements OnInit {
  showLoading = false;

  constructor(private api: ApiService,
              private dialogRef: MatDialogRef<ConfirmDialogComponent>,
              @Inject(MAT_DIALOG_DATA) public data: any,
              private toastr: ToastrService
  ) {
  }

  ngOnInit() {
  }

  confirm() {
    if (this.data?.parentCollection) {
      this.dialogRef.close(true);
      return;
    }
    if (!this.data.updateStatus) {
      this.showLoading = true;
      this.api.deleteReq(this.data.domainUrl, this.data.url,this.data.data).subscribe(res => {
        if (res.code === 200) {
          this.showLoading = false;
          this.toastr.success(res.message);
          this.dialogRef.close(true);
        }
      }, err => {
        this.showLoading = false;
        this.onDismiss();
      });
    } else {
      this.dialogRef.close(true);
    }

  }

  onDismiss(): void {
    this.dialogRef.close(false);
  }
}
