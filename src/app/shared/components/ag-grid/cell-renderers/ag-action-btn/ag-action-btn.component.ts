import {Component} from '@angular/core';
import {ICellRendererAngularComp} from 'ag-grid-angular';

@Component({
    selector: 'app-ag-action-btn-renderer',
    templateUrl: './ag-action-btn.component.html',
    styles: [
        'button:disabled {opacity: 0.4;}',
        'button:not(:disabled) {cursor: pointer}'
    ]
})

export class AgActionBtnComponent implements ICellRendererAngularComp {

    params;
    actions = [];
    disabled: boolean;

    agInit(params) {
        this.params = params;
        this.actions = params.actions;
        this.disabled = params.disabled;
    }


    refresh(params?: any): boolean {
        return true;
    }

    handleAction(action: string): void {
        this.params.getAction({
            action,
            data: this.params.data,
        });
    }

}
