import {NgModule} from '@angular/core';
import {CommonModule, CurrencyPipe, DecimalPipe} from '@angular/common';
import {DragDropModule} from '@angular/cdk/drag-drop'; // move to module
import {NgSelectModule} from '@ng-select/ng-select';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {FileUploadModule} from '@iplab/ngx-file-upload';
import {TranslateModule} from '@ngx-translate/core';

import {MaterialModule} from '../material.module';
import {NgbModule, NgbPaginationModule} from '@ng-bootstrap/ng-bootstrap';

import {InputsErrorsComponent} from './components/inputs-errors/inputs-errors.component';
import {AgTabelComponent} from './components/ag-tabel/ag-tabel.component';
import {DataPropertyGetterPipePipe} from './components/ag-tabel/data-property-getter-pipe/data-property-getter-pipe.pipe';
import {ConfirmDialogComponent} from './components/confirm-dialog/confirm-dialog.component';
import {JournalEntriesComponent} from './components/journal-entries/journal-entries.component';
import {CustomTableComponent} from './components/custom-table/custom-table.component'; // move to module
import {UsdOnlyDirective} from './directives/usd-only.directive';
import {NumbersOnlyDirective} from './directives/numbers-only.directive';
import {NgxIntlTelInputModule} from 'ngx-intl-tel-input';

import {TrimPipe} from './pipe/trim.pipe';
import 'ag-grid-enterprise';
import {AgGridModule} from 'ag-grid-angular';
import {AgGridComponent} from 'src/app/shared/components/ag-grid/ag-grid.component';
import {AgAutocompleteComponent} from 'src/app/shared/components/ag-grid/cell-renderers/ag-autocomplete/ag-autocomplete';
import {AgActionBtnComponent} from './components/ag-grid/cell-renderers/ag-action-btn/ag-action-btn.component';
import {AgImageFormatterComponent} from './components/ag-grid/cell-renderers/ag-imageFormatter/ag-image-formatter.component';
import {MessageBoxComponent} from './components/message-box/message-box.component';
import {AgStatusBtnComponent} from './components/ag-grid/cell-renderers/ag-status-btn/ag-status-btn.component';
import {AgIsDefaultBtnComponent} from './components/ag-grid/cell-renderers/ag-is-default-btn/ag-is-default-btn.component';
import {AgGridPaginationComponent} from './components/ag-grid/ag-grid-pagination/ag-grid-pagination.component';
import {DebounceInputChangeDirective} from './directives/input-change-debounce.directive';
import {LedgerComponent} from './components/ledger/ledger.component';
import {BeginningBalanceDialogComponent} from './components/beginning-balance-dialog/beginning-balance-dialog.component';
import {RouterModule} from '@angular/router';
import {NumericCellEditorComponent} from './components/ag-grid/cell-renderers/ag-numeric-input/ag-numeric-input.component';
import { AgSetPresentBtnComponent } from './components/ag-grid/cell-renderers/ag-set-present-btn/ag-set-present-btn.component';
import { AgTagesCellComponent } from './components/ag-grid/cell-renderers/ag-tages-cell/ag-tages-cell.component';

@NgModule({
  declarations: [
    AgTabelComponent,
    DataPropertyGetterPipePipe,
    NumbersOnlyDirective,
    ConfirmDialogComponent,
    InputsErrorsComponent,
    TrimPipe,
    JournalEntriesComponent,
    CustomTableComponent,
    UsdOnlyDirective,
    AgGridComponent,
    AgAutocompleteComponent,
    AgActionBtnComponent,
    AgImageFormatterComponent,
    MessageBoxComponent,
    AgStatusBtnComponent,
    AgIsDefaultBtnComponent,
    AgGridPaginationComponent,
    DebounceInputChangeDirective,
    LedgerComponent,
    BeginningBalanceDialogComponent,
    NumericCellEditorComponent,
    AgSetPresentBtnComponent,
    AgTagesCellComponent,
  ],
  imports: [
    CommonModule,
    NgSelectModule,
    FormsModule,
    FileUploadModule,
    TranslateModule,
    ReactiveFormsModule,
    NgbPaginationModule,
    NgbModule,
    DragDropModule,
    NgxIntlTelInputModule,
    MaterialModule,
    AgGridModule,
    RouterModule

  ],
  exports: [
    FileUploadModule,
    NgSelectModule,
    TranslateModule,
    FormsModule,
    ReactiveFormsModule,
    AgTabelComponent,
    NgbModule,
    NumbersOnlyDirective,
    InputsErrorsComponent,
    DragDropModule,
    UsdOnlyDirective,
    NgxIntlTelInputModule,
    MaterialModule,
    AgGridComponent,
    AgAutocompleteComponent,
    AgActionBtnComponent,
    MessageBoxComponent,
    AgStatusBtnComponent,
    AgIsDefaultBtnComponent,
    DebounceInputChangeDirective,
    BeginningBalanceDialogComponent,
    AgSetPresentBtnComponent,
    AgTagesCellComponent
  ],

  providers: [CurrencyPipe, DecimalPipe],
})

export class SharedModule {
}
