import {Component, OnDestroy, OnInit} from '@angular/core';
import {BasicInformationService} from '../../services/basic-information.service';
import {finalize} from 'rxjs/operators';
import {Subscription} from 'rxjs';
import {Profile} from '../../models/personal-details';
import {ToastrService} from 'ngx-toastr';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {SharedService} from 'src/app/shared/services/shared.service';
import {AuthService} from '../../../auth';
import { ListsService } from "src/app/shared/services/list_Service/lists.service";

@Component({
  selector: 'app-basic-information',
  templateUrl: './basic-information.component.html',
  styleUrls: ['./basic-information.component.scss']
})
export class BasicInformationComponent implements OnInit, OnDestroy {

  dataLoaded = false;
  disableForm = true;
  changePassword = false;
  subscription: Subscription = new Subscription();
  changePasswordform: FormGroup;
  profile: Profile = {};
  formErrors;
  selectedCountryId;
  tableData = [];
  countries = [];
  public userImage: Array<File> = [];
  passwordValidationsMessages: any[];
  tableColumns = [
    {
      name: 'general.role',
      dataKey: 'role',
      isSortable: false
    },
    {
      name: 'general.company',
      dataKey: 'company',
      isSortable: false
    },
    {
      name: 'general.cost_center',
      dataKey: 'cost_center',
      isSortable: false
    },
  ];

  constructor(private basicInformationService: BasicInformationService,
              private lists: ListsService,
              private toastr: ToastrService,
              private fb: FormBuilder,
              private _sharedService: SharedService,
              public authService: AuthService) {
  }

  ngOnInit(): void {
    this.getProfile();
    this.initForm();
    // Password validation
    this.passwordValidationsMessages = [
      {
        message: 'setting.usersPage.passwordMinLength', valid: () => {
          return this.changePasswordform.get('password').value?.length >= 8;
        }
      },
      {
        message: 'setting.usersPage.passwordOneUpper', valid: () => {
          return /(?=.*[A-Z])/.test(this.changePasswordform.get('password').value);
        }
      },
      {
        message: 'setting.usersPage.passwordOneLower', valid: () => {
          return /(?=.*[a-z])/.test(this.changePasswordform.get('password').value);
        }
      },
      {
        message: 'setting.usersPage.passwordoneNumber', valid: () => {
          return /(?=.*\d)/.test(this.changePasswordform.get('password').value);
        }
      },
      {
        message: 'setting.usersPage.passwordoneSymbol', valid: () => {
          return /(?=.*?[#?!@$%^&*-])/.test(this.changePasswordform.get('password').value);
        }
      },
      {
        message: 'setting.usersPage.mustBeTheSame', valid: () => {
          return (
            this.changePasswordform.get('password').value === this.changePasswordform.get('password_confirmation').value
            && this.changePasswordform.get('password_confirmation').value?.length >= 8
            && this.changePasswordform.get('password').value?.length >= 8
          );
        }
      },
    ];

    this.getUserData();
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  initForm() {
    this.changePasswordform = this.fb.group({
      password: ['', Validators.compose([Validators.required, Validators.pattern(/^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$/)])],
      password_confirmation: ['', Validators.compose([Validators.required, Validators.pattern(/^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$/)])],
      current_password: ['', [Validators.required]]
    });
  }

  getUserData() {
    let data = [];
    this._sharedService.navData$.subscribe(res => {
      if (res) {
        res.data.forEach((element) => {
          let row = {};
          row['role'] = {title: element.title, id: element.id};
          element.companies = element.companies.length ? element.companies : [element.companies[1]];
          if (element.companies.length) {
            element.companies.forEach((company) => {
              row['company'] = {name: company.name, id: company.id, number: company.number};
              company.cost_centers = company.cost_centers.length ? company.cost_centers : [company.cost_centers[1]];
              if (company.cost_centers.length) {
                company.cost_centers.forEach((costCenter, costIndex) => {
                  row['cost_center'] = company.cost_centers[costIndex];
                  data.push(JSON.parse(JSON.stringify(row)));
                });
              } else {
                row['cost_center'] = {};
                data.push(JSON.parse(JSON.stringify(row)));
              }
            });
          } else {
            row['company'] = {};
            row['cost_center'] = {};
            data.push(JSON.parse(JSON.stringify(row)));
          }
        });
        this.tableData = this.itemsDataMapping(data);
      }
    });
  }

  getProfile(): void {
    this.dataLoaded = false;

    this.subscription.add(this.basicInformationService
      .getProfileData()
      .pipe(
        finalize(() => this.dataLoaded = true)
      )
      .subscribe(
        (res) => {
          this.profile = this.changeImageAndLocalUserData(res?.item);
          this.getCountries();
        }
      ));
  }

  getCountries() {
    this.lists.countries().subscribe(res => {
      this.countries = res.items;
    });
  }

  // Enable editing
  edit() {
    this.disableForm = false;
  }

  updateUserData(data) {
    this.basicInformationService.updateUserData(data.value).subscribe(res => {
      if (res.code === 200) {
        this.formErrors = {};
        this.toastr.success(res.message);
        this.profile = this.changeImageAndLocalUserData(res.item);
      }
    }, error => {
      if (error.status === 422) {
        this.formErrors = error?.error;
      }
    });
  }

  removeImage() {
    this.basicInformationService.removeUserImage().subscribe(res => {
      if (res.code === 200) {
        this.formErrors = {};
        this.toastr.success(res.message);
        this.userImage = [];
        this.profile.has_image = false;
        this.profile.image_path = 'https://via.placeholder.com/120x90.png';
        localStorage.setItem('user', JSON.stringify(this.profile));
        this._sharedService.userImagePath.next(null);
      }
    });
  }

  uploadPhoto() {
    const formData = new FormData();
    formData.append('image', this.userImage[0]);
    this.basicInformationService.updateUserImage(formData).subscribe(res => {
      if (res.code === 200) {
        this.toastr.success(res.message);
        this.profile = this.changeImageAndLocalUserData(res.item);
        this._sharedService.userImagePath.next(res.item.image_path);
      }
    });
  }

  changeImageAndLocalUserData(item) {
    let seconds = new Date().getSeconds();
    item.image_path = `${item.image_path}?${seconds}`;
    localStorage.setItem('user', JSON.stringify(item));
    return item;
  }

  changeUserPassword() {
    this.basicInformationService.changePassword(this.changePasswordform.value).subscribe(res => {
      if (res.code === 200) {
        this.formErrors = {};
        this.toastr.success(res.message);
        this.changePasswordform.reset();
      }

    }, error => {
      if (error.status === 422) {
        this.formErrors = error?.error;
      }
    });
  }

  cancelEdit() {
    this.disableForm = true;
  }


  /**
   * Map table data to show in table
   * @param items
   * @returns
   */
  itemsDataMapping(items) {
    return items?.map((item) => {
      return {
        role: item?.role?.title,
        company: item?.company?.name,
        cost_center: item?.cost_center?.name
      };
    });
  }

}
