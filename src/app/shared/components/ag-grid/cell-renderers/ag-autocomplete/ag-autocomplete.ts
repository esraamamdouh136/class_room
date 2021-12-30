// Author: T4professor

import {Component} from '@angular/core';
import {ICellRendererAngularComp} from 'ag-grid-angular';
import { empty } from 'rxjs';

@Component({
    selector: 'app-ag-autocomplete-renderer',
    templateUrl: './ag-autocomplete.html'
})

export class AgAutocompleteComponent implements ICellRendererAngularComp {
    params;
    label: string;
    data: any;
    selected;
    bindValue: string;
    bindLabel: string;
    placeholder: string;
    multiple: boolean;
    disabled: boolean;

    agInit(params): void {
        this.params = params;
        // this.label = this.params.label || null;
        this.data = params.values;
        this.selected = params.data[params.selectedKey]; // يارب تشتغل
        this.bindValue = params.bindValue;
        this.bindLabel = params.bindLabel;
        this.placeholder = params.placeholder || '';
        this.disabled = params.disabled;
        this.multiple = params.multiple || false;
    }

    refresh(params?: any): boolean {
        this.disabled = params.disabled;
        return true;
    }

    onSelectionChange(event): void {
        this.params.setData({
            event,
            data: this.params.data
        });
    }

    onClick($event) {
        if (this.params.onClick instanceof Function) {
            // put anything into params u want pass into parents component
            const params = {
                event: $event,
                rowData: this.params.node.data
                // ...something
            };
            this.params.onClick(params);

        }
    }
}
