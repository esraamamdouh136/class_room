import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LedgerViewComponent } from './ledger-view/ledger-view.component';
import { SharedModule } from "src/app/shared/shared.module";
import { RouterModule, Routes } from "@angular/router";

export const routes: Routes = [
  {
    path: '',
    component : LedgerViewComponent
  },
  { path: "**", redirectTo: "ledger-view", pathMatch: "full" },
];

@NgModule({
  declarations: [LedgerViewComponent],
  imports: [
    CommonModule,
    SharedModule,
    RouterModule.forChild(routes)
  ]
})
export class LedgerViewModule { }
