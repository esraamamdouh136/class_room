import {Component, OnInit} from '@angular/core';
import {Location} from '@angular/common';
import {LayoutService} from '../../../../_metronic/core';
import {ApiService} from '../../../../shared/services/api.service';
import {SharedService} from '../../../../shared/services/shared.service';
import {MenuItems} from '../../../../shared/model/global';
import {distinctUntilChanged} from 'rxjs/operators';

@Component({
  selector: 'app-aside-admin',
  templateUrl: './aside.component.html',
  styleUrls: ['./aside.component.scss']
})

export class AsideAdminComponent implements OnInit {
  disableAsideSelfDisplay: boolean;
  headerLogo: string;
  brandSkin: string;
  ulCSSClasses: string;
  location: Location;
  asideMenuHTMLAttributes: any = {};
  asideMenuCSSClasses: string;
  asideMenuDropdown;
  brandClasses: string;
  asideMenuScroll = 1;
  asideSelfMinimizeToggle = false;
  menuItems: MenuItems[] = [];

  constructor(private layout: LayoutService,
              private loc: Location,
              private _api: ApiService,
              private _shredService: SharedService) {
    // config.placement = 'left';
    // config.triggers = 'hover';
  }

  ngOnInit(): void {
    // load view settings
    this.disableAsideSelfDisplay =
      this.layout.getProp('aside.self.display') === false;
    this.brandSkin = this.layout.getProp('brand.self.theme');
    this.headerLogo = this.getLogo();
    this.ulCSSClasses = this.layout.getProp('aside_menu_nav');
    this.asideMenuCSSClasses = this.layout.getStringCSSClasses('aside_menu');
    this.asideMenuHTMLAttributes = this.layout.getHTMLAttributes('aside_menu');
    this.asideMenuDropdown = this.layout.getProp('aside.menu.dropdown') ? '1' : '0';
    this.brandClasses = this.layout.getProp('brand');
    this.asideSelfMinimizeToggle = this.layout.getProp(
      'aside.self.minimize.toggle'
    );
    this.asideMenuScroll = this.layout.getProp('aside.menu.scroll') ? 1 : 0;
    // this.asideMenuCSSClasses = `${this.asideMenuCSSClasses} ${this.asideMenuScroll === 1 ? 'scroll my-4 ps ps--active-y' : ''}`;
    // Routing
    this.location = this.loc;
    this._shredService.selectedRoleId$.pipe(distinctUntilChanged()).subscribe(val => {
      if (val) {
        this.getMenu(val);
      } else {
        this.getMenu();
      }
    });
  }

  getMenu(selectedRoleId?: number): void {
    this.menuItems = [
      {
        css_class: 'fa fa-home',
        name: 'الرئيسية',
        slug: 'admin/home',
        color: '#5867DD'
      }
    ];
  }

  private getLogo() {
    if (this.brandSkin === 'light') {
      return './assets/media/logos/logo-dark.png';
    } else {
      return './assets/media/logos/logo-light.png';
    }
  }

  hoverOver() {
    document.querySelector('.aside-minimize:not(.aside-minimize-hover) .aside-menu .menu-nav')?.classList.add('hoverClass');
  }

  hoverOut() {
    document.querySelector('.aside-minimize:not(.aside-minimize-hover) .aside-menu .menu-nav')?.classList.remove('hoverClass');
  }
}
