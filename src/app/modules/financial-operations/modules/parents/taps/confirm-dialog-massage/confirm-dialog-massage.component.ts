import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-confirm-dialog-massage',
  templateUrl: './confirm-dialog-massage.component.html',
  styleUrls: ['./confirm-dialog-massage.component.scss']
})
export class ConfirmDialogMassageComponent implements OnInit {
  showLoading = false;
  constructor
  (
    private dialogRef: MatDialogRef<ConfirmDialogMassageComponent>
  ) { }

  confirm() {
    this.showLoading == true
  }

  ngOnInit(): void {
  }
  onDismiss(): void {
    this.dialogRef.close(false);
  }
}
