import {Location} from '@angular/common';
import {Component, Input, OnInit} from '@angular/core';
import {NgbPopoverConfig} from '@ng-bootstrap/ng-bootstrap';
import {distinctUntilChanged} from 'rxjs/operators';
import {ApiService} from 'src/app/shared/services/api.service';
import {SharedService} from 'src/app/shared/services/shared.service';
import {environment} from 'src/environments/environment';
import {LayoutService} from '../../../../_metronic/core';
import {MenuItems} from '../../../../shared/model/global';

@Component({
  selector: 'app-aside',
  templateUrl: './aside.component.html',
  styleUrls: ['./aside.component.scss'],
  providers: [NgbPopoverConfig]
})
export class AsideComponent implements OnInit {
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
  @Input() superAdmin: boolean;

  constructor(private layout: LayoutService, private loc: Location, private _api: ApiService, private _shredService: SharedService, config: NgbPopoverConfig) {
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

  private getLogo() {
    if (this.brandSkin === 'light') {
      return './assets/media/logos/logo-dark.png';
    } else {
      return './assets/media/logos/logo-light.png';
    }
  }

  /**
   * Get aside menu
   */
  getMenu(selectedRoleId?) {
    if (this.superAdmin) {
      this.menuItems = [
        {
          css_class: 'fa fa-home',
          name: 'الرئيسية',
          slug: 'admin/home',
          color: '#5867DD'
        }
      ];
    } else {
      this._api.getReq(environment.auth_apiUrl, `users/profile/menu?system_account_role_id=${selectedRoleId}`).subscribe(res => {
        this.menuItems = [...res];
        console.log(this.menuItems, 'menu');
        this.checkThirdLevel(this.menuItems);
      });
    }
  }

  /**
   * Check menu item has third level menu.
   * If menu third level is (general-ledger) update menu data.
   * @param menu (Menu Items)
   */
  checkThirdLevel(menu) {
    menu.forEach(item => {
      if (item?.children) {
        item?.children.forEach(e => {
          if (e?.children && e.slug == 'general-ledger') {
            this._shredService.generalLedgerMenu.next(e.children);
          }
        });
      }
    });
  }

  hoverOver() {
    document.querySelector('.aside-minimize:not(.aside-minimize-hover) .aside-menu .menu-nav')?.classList.add('hoverClass');
  }

  hoverOut() {
    document.querySelector('.aside-minimize:not(.aside-minimize-hover) .aside-menu .menu-nav')?.classList.remove('hoverClass');
  }
}
