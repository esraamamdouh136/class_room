import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA} from '@angular/material/dialog';

@Component({
    selector: 'app-attachments-dialog',
    templateUrl: './attachments-dialog.component.html',
    styleUrls: ['./attachments-dialog.component.scss']
})
export class AttachmentsDialogComponent implements OnInit {

    constructor(
        @Inject(MAT_DIALOG_DATA) public data: {attachmentsPaths: string[], attachments: string[], edit: boolean},
    ) {
    }

    ngOnInit(): void {
    }

    removeMedia(index): void {
        this.data?.attachmentsPaths?.splice(index, 1);
        this.data?.attachments?.splice(index, 1);
    }


}
