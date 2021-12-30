import { Component, Input, OnInit, SimpleChanges } from "@angular/core";
import { Router } from "@angular/router";
import { NgbModal } from "@ng-bootstrap/ng-bootstrap";
import { AuthService } from "src/app/modules/auth";
import { SharedService } from "src/app/shared/services/shared.service";

@Component({
  selector: "app-user-drobdown-action",
  templateUrl: "./user-drobdown-action.component.html",
  styleUrls: ["./user-drobdown-action.component.scss"],
})
export class UserDrobdownActionComponent implements OnInit {
  lang;
  @Input() placement;
  userData;
  constructor(private _auth: AuthService, private router: Router, private modalService: NgbModal, private _shared: SharedService) { }

  ngOnInit(): void {
    this.userData = this.getUserData();
    this._shared.userImagePath$.subscribe(res => {
      let second = new Date().getSeconds;
      this.userData.image_path = res ? `${res}?${second}` : this.getUserData()?.image_path
    })
    // this.placement = this.language == "en" ? "bottom-right" : "bottom-left";
  }

  ngOnChanges(changes: SimpleChanges) {
  }

  getUserData() {
    return JSON.parse(localStorage.getItem('user'))
  }

  /**
   * Logout
   */
  logOut() {
    this._auth.logout().subscribe(res => {
      this._shared.navData.next(null);
      this.modalService.dismissAll();
      let clearedData = ['checkToken', 'user', 'token', 'expires_in', 'columStatus','expire_date', 'selectedComNumber', 'selectedFiscalYearId', 'selectedRoleId', 'selectedCostCenterId', 'role','ledgerViewData']
      clearedData.forEach(element => {
        localStorage.removeItem(element);
      });
      this.router.navigate(['/auth/login'], {
        queryParams: {},
      });
    })
  }


  /**
   * Open confirm logout dialog
   */
  open(content) {
    this.modalService.open(content).result.then(
    );
  }
}
