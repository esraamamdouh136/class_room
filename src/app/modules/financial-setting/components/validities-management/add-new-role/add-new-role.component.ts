import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { Component, Inject, OnInit, TemplateRef } from "@angular/core";
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material/dialog";

import { ToastrService } from "ngx-toastr";
import { ValidateManagmentService } from "../../../services/validates-managment/validate-managment.service";
import { Subscription } from "rxjs";

@Component({
  selector: "app-add-new-role",
  templateUrl: "./add-new-role.component.html",
  styleUrls: ["./add-new-role.component.scss"],
})
export class AddNewRoleComponent implements OnInit {
  // Add Role
  formErrors;
  addLoading;
  allPermissions;
  form: FormGroup;
  firstLevelValue;
  thirdLevelValue;
  secondLevelValue;
  permissionsDropDown = [];
  thirdLevelHeaderMenu = [];
  firstLevelHeaderMenu = [];
  secondLevelHeaderMenu = [];

  addRoleTemplate: TemplateRef<any>;
  subscription: Subscription = new Subscription();

  constructor(
    private toaster: ToastrService,
    private _FormBuilder: FormBuilder,
    @Inject(MAT_DIALOG_DATA) public data,
    private _rolesService: ValidateManagmentService,
    private dialog: MatDialogRef<AddNewRoleComponent>,
  ) { }

  ngOnInit(): void {
    // init form
    this.initForm();
    this.firstLevelHeaderMenu = this.data.firstLevelHeader;
    this.allPermissions = this.data.permissions;
    this.firstLevelValue = this.firstLevelHeaderMenu[0];
    this.selectFirstLevelValue(this.firstLevelValue);
  }

  // initialize Form
  initForm() {
    this.form = this._FormBuilder.group({
      title: ["", Validators.required],
      permissions: ["", Validators.required],
    });
  }

  selectFirstLevelValue(e) {
    this.secondLevelHeaderMenu = [];
    this.permissionsDropDown = [];
    this.thirdLevelHeaderMenu = [];
    let data = this.allPermissions[e];
    /**
     * Check Third
     */
    let dataKeys = Object.keys(data);
    dataKeys.forEach((key) => {
      let keyValue = data[key];
      let keyValueKeys = Object.keys(keyValue);
      let isThird = false;
      keyValueKeys.forEach((k) => {
        if (typeof keyValue[k] == "object") {
          isThird = true;
        }
      });
      if (!isThird) {
        this.secondLevelHeaderMenu.push({
          title: key,
          permissions: keyValue,
        });
        // For check at first time
        this.secondLevelValue = this.secondLevelHeaderMenu[0].title;
        this.selectPermission(this.secondLevelValue);
      } else {
        this.thirdLevelHeaderMenu = dataKeys;
        this.getThirdLevelData(keyValue);
      }
    });
  }

  getThirdLevelData(Value) {
    let dataKeys = Object.keys(Value);
    dataKeys.forEach((key) => {
      let keyValue = Value[key];
      this.secondLevelHeaderMenu.push({
        title: key,
        permissions: keyValue,
      });
    });
    this.secondLevelValue = this.secondLevelHeaderMenu[0].title;
    this.thirdLevelValue = this.thirdLevelHeaderMenu[0];
    this.selectPermission(this.secondLevelValue);
  }

  selectThirdLevel(val) {
    this.secondLevelHeaderMenu = [];
    this.permissionsDropDown = [];
    // this.form.get("permissions").patchValue([]);
    this.getThirdLevelData(this.allPermissions[this.firstLevelValue][val]);
  }

  selectPermission(val) {
    this.permissionsDropDown = [];
    // this.form.get("permissions").patchValue([]);
    let data = this.secondLevelHeaderMenu.find(
      (e) => e.title == val
    ).permissions;
    let dataKeys = Object.keys(data);
    dataKeys.forEach((key) => {
      let keyValue = data[key];
      this.permissionsDropDown.push({
        title: key,
        value: keyValue,
      });
    });
  }

  onSubmit() {
    this.addLoading = true;
    this.subscription.add(
      this._rolesService.addNewRole(this.form.value).subscribe(
        (res: any) => {
          if (res.code === 200) {
            this.dialog.close(true);
            this.toaster.success(res.message);
            this.addLoading = false;
            this.formErrors = {};
          }
        },
        (err) => {
          this.formErrors = err?.error;
        }
      )
    )
  }
}
