import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';

import {FinancialSettingRoutingModule} from './financial-setting-routing.module';
import {FinancialSettingComponent} from './financial-setting.component';
import {InlineSVGModule} from 'ng-inline-svg';
import {OrganizationComponent} from './components/organization/organization.component';
import {UsersComponent} from './components/users/users.component';
import {FiscalYearComponent} from './components/fiscal-year/fiscal-year.component';
import {NgSelectModule} from '@ng-select/ng-select';
import {SharedModule} from 'src/app/shared/shared.module';
import {AreasComponent} from './components/areas/areas.component';
import {BranchesComponent} from './components/branches/branches.component';
import {CostCenterComponent} from './components/cost-center/cost-center.component';
import {FiscalYearFormComponent} from './components/fiscal-year/add-edit-fiscal-year/add-edit-fiscal-year.component';
import {UsersFormComponent} from './components/users/add-edit-user/add-edit-user.component';
import {OpeningBalancesComponent} from './components/opening-balances/opening-balances.component';
import {ValiditiesManagementComponent} from './components/validities-management/validities-management.component';
import {TaxesComponent} from './components/taxes/taxes.component';
import {ChartOfAccountsComponent} from './components/chart-of-accounts/chart-of-accounts.component';
import {SerialNumbersComponent} from './components/serial-numbers/serial-numbers.component';
import {ManualBondsComponent} from './components/manual-bonds/manual-bonds.component';
import {PaymentMethodsComponent} from './components/payment-methods/payment-methods.component';
import {TypesOfPremiumsComponent} from './components/types-of-premiums/types-of-premiums.component';
import {TypesOfFeesComponent} from './components/types-of-fees/types-of-fees.component';
import {StudyMajorsComponent} from './components/study-majors/study-majors.component';
import {RelativeRelationComponent} from './components/relative-relation/relative-relation.component';
import {GeneralDiscountsComponent} from './components/general-discounts/general-discounts.component';
import {SpecialDiscountsComponent} from './components/special-discounts/special-discounts.component';
import {CaseStudiesComponent} from './components/case-studies/case-studies.component';
import {PaymentTerminalPosComponent} from './components/payment-terminal-pos/payment-terminal-pos.component';
import {AddEditRelationComponent} from './components/relative-relation/add-edit-relation/add-edit-relation.component';
import {CategoriesOfFeesComponent} from './components/cateogries-of-fees/categories-of-fees.component';
import {AddEditFeesComponent} from './components/types-of-fees/add-edit-fees/add-edit-fees.component';
import {AddAndEditComponent} from './components/case-studies/add-edit-case-study/add-edit-case-study.component';
import {AddEditTaxesComponent} from './components/taxes/add-edit-taxes/add-edit-taxes.component';
import {MatButtonModule} from '@angular/material/button';
import {MatIconModule} from '@angular/material/icon';
import {MatTreeModule} from '@angular/material/tree';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {MatRadioModule} from '@angular/material/radio';
import {UpdateUserRoleComponent} from './components/users/update-user-role/update-user-role.component';
import {AddNewRoleComponent} from './components/validities-management/add-new-role/add-new-role.component';
import {TreeModule} from '@circlon/angular-tree-component';
import {AddEditAreaComponent} from './components/areas/add-edit-area/add-edit-area.component';
import {AddEditBranchComponent} from './components/branches/add-edit-branch/add-edit-branch.component';
import {CurrenciesComponent} from './components/currencies/currencies.component';
import {AddEditCurrencyComponent} from './components/currencies/add-edit-currency/add-edit-currency.component';
import {AddEditCostCenterComponent} from './components/cost-center/add-edit-cost-center/add-edit-cost-center.component';
import {SpecialDialogComponent} from './components/special-discounts/add-edit-special-discount/add-edit-special-discount.component';
import {GeneralDiscountsFormComponent} from './components/general-discounts/add-edit-general-discount/add-edit-general-discount.component';
import {PaymentFormComponent} from './components/payment-methods/add-edit-payment-methods/payment-form.component';
import {BanksComponent} from './components/banks/banks.component';
import {ClassroomsComponent} from './components/classrooms/classrooms.component';
import {FormClassroomsComponent} from './components/classrooms/form-classrooms/form-classrooms.component';
import {SemstersComponent} from './components/semsters/semsters.component';
import {MatNativeDateModule} from '@angular/material/core';
import {AddEditSemestersComponent} from './components/semsters/add-edit-semesters/add-edit-semesters.component';
import {FormaddEditBankComponent} from './components/banks/formadd-edit-bank/formadd-edit-bank.component';
import {CateogriesAddFormComponent} from './components/cateogries-of-fees/cateogries-add-form/cateogries-add-form.component';
import {AddEditAccountComponent} from './components/chart-of-accounts/add-edit-account/add-edit-account.component';
import {LedgerSearchComponent} from './components/chart-of-accounts/ledger-search/ledger-search.component';
import {LedgerDetailsComponent} from './components/chart-of-accounts/ledger-details/ledger-details.component';
import { ResizableModule } from 'angular-resizable-element';
import { ConnectEducationSystemComponent } from './components/connect-education-system/connect-education-system.component';
@NgModule({
  declarations: [
    FinancialSettingComponent,
    OrganizationComponent,
    UsersComponent,
    FiscalYearComponent,
    AreasComponent,
    BranchesComponent,
    CostCenterComponent,
    FiscalYearFormComponent,
    UsersFormComponent,
    OpeningBalancesComponent,
    ValiditiesManagementComponent,
    TaxesComponent,
    ChartOfAccountsComponent,
    SerialNumbersComponent,
    ManualBondsComponent,
    PaymentMethodsComponent,
    TypesOfPremiumsComponent,
    TypesOfFeesComponent,
    CategoriesOfFeesComponent,
    StudyMajorsComponent,
    RelativeRelationComponent,
    GeneralDiscountsComponent,
    SpecialDiscountsComponent,
    CaseStudiesComponent,
    PaymentTerminalPosComponent,
    AddEditRelationComponent,
    AddEditFeesComponent,
    AddAndEditComponent,
    CateogriesAddFormComponent,
    AddEditTaxesComponent,
    GeneralDiscountsFormComponent,
    AddNewRoleComponent,
    UpdateUserRoleComponent,
    AddEditAreaComponent,
    AddEditBranchComponent,
    CurrenciesComponent,
    AddEditCurrencyComponent,
    AddEditCostCenterComponent,
    SpecialDialogComponent,
    PaymentFormComponent,
    BanksComponent,
    ClassroomsComponent,
    FormClassroomsComponent,
    SemstersComponent,
    AddEditSemestersComponent,
    FormaddEditBankComponent,
    AddEditAccountComponent,
    LedgerSearchComponent,
    LedgerDetailsComponent,
    ConnectEducationSystemComponent,
  ],

  imports: [
    SharedModule,
    CommonModule,
    FinancialSettingRoutingModule,
    NgSelectModule,
    InlineSVGModule,
    MatRadioModule,
    FormsModule,
    ReactiveFormsModule,
    MatButtonModule,
    MatIconModule,
    TreeModule,
    MatTreeModule,
    MatNativeDateModule,
    ResizableModule

  ],
})
export class FinancialSettingModule {
}
