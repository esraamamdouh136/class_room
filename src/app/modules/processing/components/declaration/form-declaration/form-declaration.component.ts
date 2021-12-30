import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';
import { tap } from 'rxjs/operators';
import { ProcessingService } from '../../../services/processing.service';
import { DeclarationComponent } from '../declaration.component';

@Component({
    selector: 'app-form-declaration',
    templateUrl: './form-declaration.component.html',
    styleUrls: ['./form-declaration.component.scss']
})
export class FormDeclarationComponent implements OnInit {
    formErrors;
    form: FormGroup;

    constructor(
        private processingService: ProcessingService,
        @Inject(MAT_DIALOG_DATA) public data,
        private dialog: MatDialogRef<DeclarationComponent>,
        private toaster: ToastrService,
        private _FormBuilder: FormBuilder
    ) {
    }

    ngOnInit(): void {
        this.initForm();
        if (this.data.update) {
            this.form.patchValue(this.data.data);
        }
    }

    initForm() {
        this.form = this._FormBuilder.group({
            name: ['', Validators.required],
            status: [1],
            is_default: [false, [Validators.required]],
        });
    }

    // get the status form control
    get statusValue() {
        return this.form.get('status').value;
    }

    get isDefaultValue() {
        return this.form.get("is_default").value;
    }


    submit() {
        const body = this.prePost(this.form.value);
        this.processingService.createNewChannel(body).pipe(
            tap(() => this.dialog.close(true))
        ).subscribe((res: any) => {
            this.toaster.success(res.message);
        },
            err => {
                this.formErrors = err?.error;
            });
    }

    prePost(formVal) {
        const data = {
            ...formVal,
            status: this.data.update ? formVal.status ? 1 : 2 : 1,
            id: this.data.data?.id,
            is_connected: formVal.is_connected === false,
            is_default: this.form.value.is_default ? 1 : 2
        };
        if (!this.data.update) {
            delete data.id;
        }
        return data;
    }
}
