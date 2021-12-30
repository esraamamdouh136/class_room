import {NgModule} from '@angular/core';
import {Routes, RouterModule} from '@angular/router';
import {AreasComponent} from './components/areas/areas.component';
import {BranchesComponent} from './components/branches/branches.component';
import {CostCenterComponent} from './components/cost-center/cost-center.component';
import {FiscalYearComponent} from './components/fiscal-year/fiscal-year.component';
import {OrganizationComponent} from './components/organization/organization.component';
import {UsersComponent} from './components/users/users.component';
import {FinancialSettingComponent} from './financial-setting.component';
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
import {CategoriesOfFeesComponent} from './components/cateogries-of-fees/categories-of-fees.component';
import {CurrenciesComponent} from './components/currencies/currencies.component';
import {BanksComponent} from './components/banks/banks.component';
import {ClassroomsComponent} from './components/classrooms/classrooms.component';
import {SemstersComponent} from './components/semsters/semsters.component';
import {JornalEntryComponent} from '../financial-operations/components/jornal-entry/jornal-entry.component';
import {CateogriesAddFormComponent} from './components/cateogries-of-fees/cateogries-add-form/cateogries-add-form.component';
import { ConnectEducationSystemComponent } from "./components/connect-education-system/connect-education-system.component";

const routes: Routes = [
  {
    path: '',
    component: FinancialSettingComponent,
    children: [
      {
        path: '',
        redirectTo: 'profile',
      },

      {
        path: 'profile',
        component: OrganizationComponent
      },
      {
        path: 'bank-settings',
        component: BanksComponent
      },
      {
        path: 'class-rooms',
        component: ClassroomsComponent
      },
      {
        path: 'semsters',
        // loadChildren : () => import('../financial-setting/components/semsters/study-years/study-years.module').then(m => m.StudyYearsModule)
        component: SemstersComponent
      },
      {
        path: 'users',
        component: UsersComponent
      },
      {
        path: 'fiscal-year',
        component: FiscalYearComponent
      },
      {
        path: 'areas',
        component: AreasComponent
      },
      {
        path: 'branches',
        component: BranchesComponent
      },
      {
        path: 'cost-center',
        component: CostCenterComponent
      },
      {
        path: 'opening-balances',
        component: JornalEntryComponent,
        data: {component: 'opening'}
      },
      {
        path: 'validities-management',
        component: ValiditiesManagementComponent
      },
      {
        path: 'taxes',
        component: TaxesComponent
      },
      {
        path: 'chart-of-accounts',
        component: ChartOfAccountsComponent
      },
      {
        path: 'serial-numbers',
        component: SerialNumbersComponent
      },
      {
        path: 'manual-bonds',
        component: ManualBondsComponent
      },
      {
        path: 'payment-methods',
        component: PaymentMethodsComponent
      },
      {
        path: 'types-of-premiums',
        component: TypesOfPremiumsComponent
      },
      {
        path: 'types-of-fees',
        component: TypesOfFeesComponent
      },
      {
        path: 'cateogries-of-fees',
        component: CategoriesOfFeesComponent,
      },
      {
        path: 'study-majors',
        component: StudyMajorsComponent
      },
      {
        path: 'relative-relation',
        component: RelativeRelationComponent
      },
      {
        path: 'general-discounts',
        component: GeneralDiscountsComponent
      },
      {
        path: 'special-discounts',
        component: SpecialDiscountsComponent
      },
      {
        path: 'case-studies',
        component: CaseStudiesComponent
      },
      {
        path: 'payment-terminal-(pos)',
        component: PaymentTerminalPosComponent
      },
      {
        path: 'cateogries-form',
        component: CateogriesAddFormComponent
      },
      {
        path: 'currencies',
        component: CurrenciesComponent
      },
      {
        path: 'connect-education',
        component: ConnectEducationSystemComponent
      },

    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class FinancialSettingRoutingModule {
}
