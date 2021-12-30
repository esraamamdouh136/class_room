import { Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';

import { ToastrService } from 'ngx-toastr';
import { BehaviorSubject, Subscription } from 'rxjs';
import { isValidPhoneNumber } from 'libphonenumber-js'

import { User } from "../../../models/user/user";
import { Country, Role } from "src/app/shared/model/global";
import { UsersService } from "../../../services/users/users.service";

interface DialogData {
  roles?: any,
  countries?: any,
  user?: User
}

@Component({
  selector: 'app-users-form',
  templateUrl: './add-edit-user.component.html',
  styleUrls: ['./add-edit-user.component.scss']
})
export class UsersFormComponent implements OnInit, OnDestroy {
  roles: Role[] = [];
  countries: Country[] = [];
  passwordValidationsMessages: any[]
  subscription: Subscription = new Subscription();

  selectedFile: any;
  time = new Date().getTime();

  addLoading = false;
  changePassword: boolean;

  formErrors;
  form: FormGroup;
  public fileUploadControl = new FormControl(null);

  errors: BehaviorSubject<any> = new BehaviorSubject({});
  imageUrl: BehaviorSubject<any> = new BehaviorSubject("");
  errorPhone: BehaviorSubject<any> = new BehaviorSubject(false);
  showLoading: BehaviorSubject<any> = new BehaviorSubject(false);

  constructor(
    private fb: FormBuilder,
    private _users: UsersService,
    private toaster: ToastrService,
    @Inject(MAT_DIALOG_DATA) public data: DialogData,
    private dialog: MatDialogRef<UsersFormComponent>,
  ) { }

  ngOnInit() {
    this.initForm()
    this.getFromDropData()

    this.form.get("phone").valueChanges.subscribe(value => {
      if (this.form.value.country) {
        if (!isValidPhoneNumber(value, this.form.value.country)) {
          this.errorPhone.next(true)
          this.form.get("phone").setErrors({ 'incorrect': true })
        }
        else {
          this.errorPhone.next(false)
          this.form.get("phone").setErrors(null)
        }
      }
    })

    this.passwordValidationsMessages = [
      { message: "setting.usersPage.passwordMinLength", valid: () => { return this.form.get("password").value.length >= 8 } },
      { message: "setting.usersPage.passwordOneUpper", valid: () => { return /(?=.*[A-Z])/.test(this.form.get("password").value) } },
      { message: "setting.usersPage.passwordOneLower", valid: () => { return /(?=.*[a-z])/.test(this.form.get("password").value) } },
      { message: "setting.usersPage.passwordoneNumber", valid: () => { return /(?=.*\d)/.test(this.form.get("password").value) } },
      { message: "setting.usersPage.passwordoneSymbol", valid: () => { return /(?=.*?[#?!@$%^&*-])/.test(this.form.get("password").value) } },
      { message: "setting.usersPage.mustBeTheSame", valid: () => { return this.form.get("password").value == this.form.get("password_confirmation").value } },
    ]

  }

  /**
 * Get form dropdown data
 */
  getFromDropData() {
    this.countries = this.data.countries;
    this.roles = this.data.roles;
    if (this.data.user?.id) {
      this.imageUrl.next(`${this.data.user.image_path}?${this.time}`);
      this.data.user['image'] = null;  // Reinitialize image file upload with null
      this.form.patchValue({ ...this.data.user, status: this.data.user.status == 1 ? true : false });
      this.disablePasswordInputs();
    } else {
      this.changePassword = true;
    }
  }


  disablePasswordInputs() {
    this.form.get('password').disable();
    this.form.get('password').clearValidators();
    this.form.get('password').updateValueAndValidity();
    this.form.get('password_confirmation').disable();
    this.form.get('password_confirmation').clearValidators();
    this.form.get('password_confirmation').updateValueAndValidity();
  }

  enablePassword(value) {
    if (value.checked) {
      this.form.get('password').enable()
      this.form.get('password').setValidators([Validators.required, Validators.pattern(/^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$/)]);
      this.form.get('password').updateValueAndValidity();
      this.form.get('password_confirmation').enable()
      this.form.get('password_confirmation').setValidators([Validators.required, Validators.pattern(/^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$/)]);
      this.form.get('password_confirmation').updateValueAndValidity();
    }
    else this.disablePasswordInputs()
  }

  disableForm() {
    if (this.form.valid && this.form.get('password').value === this.form.get('password_confirmation').value)
      return false
    else return true
  }

  onSelectCountry(value) {

    this.errorPhone.next(!isValidPhoneNumber(this.form.value.phone, value.iso_code))
    if (!isValidPhoneNumber(this.form.value.phone, value.iso_code)) {

      this.form.get("phone").setErrors({ 'incorrect': true })
    }
    else this.form.get("phone").setErrors(null)

  }

  initForm() {
    this.form = this.fb.group({
      image: this.fileUploadControl,
      username: ['', Validators.required],
      name: ['', Validators.required],
      email: ['', Validators.required],
      password: ['', Validators.compose([
        Validators.required,
        Validators.pattern(/^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$/)
      ])],
      password_confirmation: ['', Validators.compose([
        Validators.required,
        Validators.pattern(/^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$/)
      ])],
      system_account_role_id: ['1', Validators.required],
      status: ["1"],
      phone: ['', Validators.required],
      country: ['', Validators.required],
    })
  }

  // get the status form control
  get statusValue() {
    return this.form.get("status").value;
  }

  /**
   * When click add user or update
   * Add or update based on action
   * Get data again
   */
  onSubmit() {
    this.addLoading = true;
    // form.status =
    const body = this.prepareDataBeforePost()

    if (this.data?.user?.id) {
      // If user has image and not choose an image remove image from body
      this.subscription.add(
        this._users.updateUserData(this.data.user.id, body).subscribe(res => {
          this.dialog.close(true);
          this.toaster.success(res.message);
          this.addLoading = false;
          this.formErrors = {};
          this.formErrors = {};
          this.imageUrl.next('');
        },
          err => {
            if (err.status == 422) {
              this.formErrors = err?.error;
            }
            this.addLoading = false;
          })
      )
    }
    else {
      this.subscription.add(
        this._users.addUser(body).subscribe(res => {
          this.dialog.close(true)
          this.toaster.success(res.message);
          this.addLoading = false;
          this.formErrors = {};
          this.imageUrl.next('');
        },
          err => {
            if (err.status == 422) {
              this.formErrors = err?.error;
            }
            this.addLoading = false;
          })
      )
    }
  }


  typePassword(e) {
    let arabicCharUnicodeRange = /[\u0600-\u06FF]/;
    let key = e.which;
    if (key === 32) {
      return false;
    }

    let str = String.fromCharCode(key);
    if (arabicCharUnicodeRange.test(str)) {
      return false;
    }

    return true;

  }

  prepareDataBeforePost() {
    const formData = new FormData();
    for (const key in this.form.value) {
      if (key === 'image' && this.form.value.image) {
        this.form.value.image.forEach(el => {
          formData.append('image', el)
        });
      }
      else if (key === 'system_account_role_id') {
      }
      else {
        formData.append(key, this.form.value[key])
      }

      if(key === 'image' && !this.form.value.image){
        formData.delete('image');
      }
    }

    if (this.data?.user?.id) {
      if (this.data.user.has_image && !this.form.value.image) {
        formData.delete('image');
      }
      formData.append('status', `${this.form.value.status ? 1 : 2}`)
    }

    
    return formData;
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

}
