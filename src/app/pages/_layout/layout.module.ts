import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { InlineSVGModule } from 'ng-inline-svg';
import { LayoutRoutingModule } from './layout-routing.module';
import {
  NgbDropdownModule,
  NgbProgressbarModule,
} from '@ng-bootstrap/ng-bootstrap';
import { TranslationModule } from '../../modules/i18n/translation.module';
import { LayoutComponent } from './layout.component';
import { ScriptsInitComponent } from './init/scipts-init/scripts-init.component';
import { HeaderMobileComponent } from './components/header-mobile/header-mobile.component';
import { AsideComponent } from './components/aside/aside.component';
import { FooterComponent } from './components/footer/footer.component';
import { HeaderComponent } from './components/header/header.component';
import { HeaderMenuComponent } from './components/header/header-menu/header-menu.component';
import { TopbarComponent } from './components/topbar/topbar.component';
import { ExtrasModule } from '../../_metronic/partials/layout/extras/extras.module';
import { LanguageSelectorComponent } from './components/topbar/language-selector/language-selector.component';
import { CoreModule } from '../../_metronic/core';
import { SubheaderModule } from '../../_metronic/partials/layout/subheader/subheader.module';
import { AsideDynamicComponent } from './components/aside-dynamic/aside-dynamic.component';
import { HeaderMenuDynamicComponent } from './components/header/header-menu-dynamic/header-menu-dynamic.component';
import { UserDrobdownActionComponent } from './components/topbar/user-drobdown-action/user-drobdown-action.component';
import { MatDialogModule } from "@angular/material/dialog";
import { SharedModule } from "../../shared/shared.module";
import { MessagesComponent } from './components/topbar/messages/messages.component';
import { NotificationComponent } from './components/topbar/notification/notification.component';
import { ExpireTokenModelComponent } from "../../shared/components/expire-token-model/expire-token-model.component";

@NgModule({
  declarations: [
    LayoutComponent,
    ScriptsInitComponent,
    HeaderMobileComponent,
    AsideComponent,
    FooterComponent,
    HeaderComponent,
    HeaderMenuComponent,
    TopbarComponent,
    LanguageSelectorComponent,
    AsideDynamicComponent,
    HeaderMenuDynamicComponent,
    UserDrobdownActionComponent,
    MessagesComponent,
    NotificationComponent,
    ExpireTokenModelComponent,
  ],
  imports: [
    CommonModule,
    LayoutRoutingModule,
    TranslationModule,
    InlineSVGModule,
    ExtrasModule,
    NgbDropdownModule,
    NgbProgressbarModule,
    CoreModule,
    SubheaderModule,
    MatDialogModule,
    SharedModule
  ],
  exports: [
    HeaderMobileComponent,
    AsideComponent,
    AsideDynamicComponent,
    HeaderComponent,
    ScriptsInitComponent,
    ExpireTokenModelComponent
  ]
})
export class LayoutModule { }
