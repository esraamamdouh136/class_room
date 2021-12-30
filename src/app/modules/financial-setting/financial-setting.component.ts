import { Component, ElementRef, HostListener, OnInit, ViewChild } from "@angular/core";

import { forkJoin } from "rxjs";
import { take, tap } from "rxjs/operators";

import { SharedService } from "src/app/shared/services/shared.service";
import { TopNavService } from "src/app/shared/services/top-nav.service";

@Component({
  selector: "app-financial-setting",
  templateUrl: "./financial-setting.component.html",
  styleUrls: ["./financial-setting.component.scss"],
})
export class FinancialSettingComponent implements OnInit {
  menuItems = [];
  @ViewChild('scrolledSection', { static: true }) scrolledSection: ElementRef;
  loading = true;
  showMenu = false;

  constructor(
    private _sharedService: SharedService,
    private _topNavService: TopNavService,
    private sharedService : SharedService,
    private eRef: ElementRef
  ) { }

  toggleSidebar:boolean;
  @HostListener('document:click', ['$event'])
  clickout(event) {
    if(this.eRef.nativeElement.contains(event.target)) {
      this.toggleSidebar = false;
    }
  }

  ngOnInit(): void {
    // Check third level menu items.
    this._sharedService.generalLedgerMenu$.subscribe((res) => {
      this.loading = false;
      this.menuItems = res ? res : [];
    });

    // scroll to top of the table after get data 
    this._sharedService.scrollToTop.subscribe(res => {
      if (res) {
        this.scrolledSection.nativeElement.scroll(0, 0);
      }
    })
    this.sharedService.toggleMenu.subscribe(res =>{
      this.toggleSidebar = res
    })
  }
  toggle() {
    this.showMenu = !this.showMenu;
  }
  
}
