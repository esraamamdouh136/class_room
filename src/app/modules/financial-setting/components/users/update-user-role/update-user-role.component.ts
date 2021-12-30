import { Component, Inject, OnDestroy, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material/dialog";

import { forkJoin, Subscription } from "rxjs";
import { ToastrService } from "ngx-toastr";

import { User } from "../../../models/user/user";
import { UsersService } from "../../../services/users/users.service";
import { ListsService } from "src/app/shared/services/list_Service/lists.service";

@Component({
  selector: "app-update-user-role",
  templateUrl: "./update-user-role.component.html",
  styleUrls: ["./update-user-role.component.scss"],
})
export class UpdateUserRoleComponent implements OnInit, OnDestroy {
  roles = [];
  costCenters = [];
  motherCompanies = [];
  subscription: Subscription = new Subscription();

  addLoading;
  showLoading = true;

  form: FormGroup;
  selectedMotherCompanyId;

  constructor(
    private _lists: ListsService,
    private toaster: ToastrService,
    private _FormBuilder: FormBuilder,
    private _userService: UsersService,
    @Inject(MAT_DIALOG_DATA) public data: { user: User },
    private dialog: MatDialogRef<UpdateUserRoleComponent>,
  ) { }

  ngOnInit(): void {
    this.DropDownData();
    // init form
    this.initForm();
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  // initialize Form
  initForm() {
    this.form = this._FormBuilder.group({
      mother_company_id: ["", Validators.required],
      role_id: ["", Validators.required],
      cost_centers: [{ value: "", disabled: true }],
    });
  }

  DropDownData() {
    const roles = this._lists.usersRoles();
    const companies = this._lists.motherCompanies();
    this.subscription.add(
      forkJoin([roles, companies]).subscribe((data) => {
        this.roles = data[0].items;
        this.motherCompanies = data[1].items;
        this.showLoading = false;
      })
    )
  }

  selectCompany(val) {
    this.selectedMotherCompanyId = val.id;
    this.costCenters = [];
    const num = val.number;
    this.subscription.add(
      this._lists.costCenters(num).subscribe((res) => {
        this.costCenters = res.items;
        this.form.get("cost_centers").enable();
      })
    )
  }

  onSubmit() {
    this.addLoading = true;
    const body = {
      roles: [
        {
          ...this.form.value,
        },
      ],
    };
    this.subscription.add(
      this._userService.assignRoleToUser(this.data.user.id, body).subscribe(
        (res) => {
          this.addLoading = false;
          this.toaster.success(res.message);
          this.dialog.close(true);
        },
        (error) => {
          if (error.error.code == 400) {
            this.dialog.close(true);
            this.addLoading = false;
          }
        }
      )
    )

  }
}
