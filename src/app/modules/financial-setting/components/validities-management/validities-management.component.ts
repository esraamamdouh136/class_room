import { Component, OnInit } from "@angular/core";
import { MatDialog } from "@angular/material/dialog";

import { Subscription } from "rxjs";

import { AdminRoles } from "src/app/shared/model/admin-roles";
import { SharedService } from "src/app/shared/services/shared.service";
import { AddNewRoleComponent } from "./add-new-role/add-new-role.component";
import { ValidateManagmentService } from "../../services/validates-managment/validate-managment.service";

@Component({
  selector: "app-validities-management",
  templateUrl: "./validities-management.component.html",
  styleUrls: ["./validities-management.component.scss"],
})
export class ValiditiesManagementComponent implements OnInit {
  thirdLevelList = [];
  secondLevelList = [];
  allPermissionsList = [];
  firstLevelHeaderMenu = [];
  secondLevelHeaderMenu = [];
  rolesList: AdminRoles[] = [];
  userPermissions: string[] = [];

  selectedRole;
  firstLevelValue;
  secondLevelValue;

  subscription: Subscription = new Subscription();

  constructor(
    private _MatDialog: MatDialog,
    private _sharedService: SharedService,
    private _rolesService: ValidateManagmentService,
  ) { }

  ngOnInit(): void {
    this.getData();
  }

  getData() {
    this.subscription.add(
      this._sharedService.navChanged$.subscribe(data => {
        if (data) {
          this.getAllRoles();
          this.getPermissionsList();
        }
      })
    )
  }

  getAllRoles() {
    this.subscription.add(
      this._rolesService.listRoles().subscribe((roles: any) => {
        this.rolesList = roles.items.data.map((element) => {
          element["checked"] = false;
          return element;
        });
      })
    )
  }

  getPermissionsList() {
    this.subscription.add(
      this._rolesService.listPermissions().subscribe((permissions) => {
        this.getFirstLevel(permissions.items); // Get first level dropdown
        this.allPermissionsList = permissions.items;
      })
    )
  }

  // Get first level dropdown
  getFirstLevel(obj: object) {
    this.firstLevelHeaderMenu = Object.keys(obj);
  }

  checkMainRole(checkedRole) {
    this.selectedRole = checkedRole;
    this.thirdLevelList = [];
    this.secondLevelList = [];
    this.secondLevelHeaderMenu = [];
    this.firstLevelValue = this.firstLevelHeaderMenu[0];
    this.selectFirstLevelDropdown(this.firstLevelHeaderMenu[0]);
    this.rolesList.map((role) => {
      role.checked = role.id == checkedRole.id ? true : false;
      return role;
    });

    this.subscription.add(
      this._rolesService.findById(checkedRole.id).subscribe((res) => {
        this.userPermissions = res.item.permissions;
      })
    )
  }

  /**
   * When a user select first level dropdown
   * Check if there are second level
   * If not update second level list values with (title and permissions)
   * If it has second level update secondLevel dropdown and secondLevel list values
   * @param e
   */
  selectFirstLevelDropdown(e) {
    let data = this.allPermissionsList[e];
    /**
     * Check Third
     * ================================
     */
    let dataKeys = Object.keys(data);
    dataKeys.forEach((key) => {
      let keyValue = data[key];
      let keyValueKeys = Object.keys(keyValue);
      let isThird = false;
      keyValueKeys.forEach((k) => {
        if (typeof keyValue[k] == "object") {
          this.secondLevelValue = e;
          isThird = true;
        }
      });
      if (!isThird) {
        this.secondLevelList.push({
          title: key,
          checked: false,
          permissions: keyValue,
        });
      } else {
        this.secondLevelHeaderMenu = dataKeys;
        this.secondLevelValue = this.secondLevelHeaderMenu[0];
        this.getThirdLevelData(keyValue);
      }
    });
  }

  /**
   * To update secondLevelList values if there are more than one level
   */
  getThirdLevelData(Value) {
    let dataKeys = Object.keys(Value);
    dataKeys.forEach((key) => {
      let keyValue = Value[key];
      this.secondLevelList.push({
        title: key,
        checked: false,
        permissions: keyValue,
      });
    });
  }

  checkSecodnLevel(item) {
    this.thirdLevelList = [];
    this.secondLevelList.map((el) => {
      el.checked = el.title == item.title ? true : false;
      return el;
    });

    let data = item.permissions;
    let dataKeys = Object.keys(data);
    dataKeys.forEach((key, index) => {
      let keyValue = data[key];
      this.thirdLevelList.push({
        title: key,
        checked: this.userPermissions.find((val) => val == keyValue)
          ? true
          : false,
        value: keyValue,
      });
    });
  }

  /**
   * When user change first level dropdown value
   * Reset second level dropDown and secondLevel list value and thirdLevel list values
   * */
  selectFirstLevelValue(val) {
    this.thirdLevelList = [];
    this.secondLevelList = [];
    this.secondLevelHeaderMenu = [];
    this.selectFirstLevelDropdown(val);
  }

  selectSecondLevelValue(e) {
    this.thirdLevelList = [];
    this.secondLevelList = [];
    this.getThirdLevelData(this.allPermissionsList[this.firstLevelValue][e]);
  }

  /**
   * Check if user want to delete or add the permission
   * If want to add => add the value to user permission then send request
   * If want to delete => remove the value form permission list then send request
   * @param permission (Permission we want to update)
   */
  updateRolePermission(permission) {
    if (!permission.checked) {
      this.userPermissions.push(permission.value);
    } else {
      this.userPermissions.splice(
        this.userPermissions.indexOf(permission.value),
        1
      );
    }

    const body = {
      title: this.selectedRole.title,
      permissions: [...this.userPermissions],
    };

    this._rolesService
      .updateRolePermission(this.selectedRole.id, body)
      .subscribe((res) => {
        permission.checked = !permission.checked;
      });
  }

  /**
   * Add new role
   */
  openAddEditValiditiesManagementForm() {
    const dialogRef = this._MatDialog.open(AddNewRoleComponent, {
      minWidth: "650px",
      panelClass: "custom-dialog-container",
      data: {
        permissions: this.allPermissionsList,
        firstLevelHeader: this.firstLevelHeaderMenu,
      },
    });

    this.subscription.add(
      dialogRef.afterClosed().subscribe((result) => {
        if (result) {
          this.getAllRoles();
        }
      })
    )
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }
}
