import {Component, Inject, OnDestroy, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';

import {ToastrService} from 'ngx-toastr';
import {take, tap} from 'rxjs/operators';
import {SharedService} from 'src/app/shared/services/shared.service';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {PaymentService} from '../../../services/paymentServices/payment.service';
import {forkJoin, Subscription} from 'rxjs';
import {TranslationService} from 'src/app/modules/i18n/translation.service';
import {TranslateService} from '@ngx-translate/core';
import { ListsService } from "src/app/shared/services/list_Service/lists.service";

@Component({
  selector: 'app-payment-form',
  templateUrl: './payment-form.component.html',
  styleUrls: ['./payment-form.component.scss'],
})
export class PaymentFormComponent implements OnInit, OnDestroy {
  bankName: string;
  language: string;

  discount_value: boolean = true;
  nameOfEnglish: boolean;
  nameofArabic: boolean;

  bankID: number;
  selectedMotherCompanyNumber: number;
  selectedConstCenterNumber: number;

  formErrors;
  form: FormGroup;
  account_guide: number;
  accountGuide: any;
  subscription: Subscription = new Subscription();

  constructor(
    private paymentService: PaymentService,
    @Inject(MAT_DIALOG_DATA) public data,
    private dialog: MatDialogRef<PaymentFormComponent>,
    private toaster: ToastrService,
    private _shredService: SharedService,
    private _FormBuilder: FormBuilder,
    public translateService: TranslationService,
    private translate: TranslateService,
    private listService: ListsService
  ) {
  }

  ngOnInit(): void {
    this.initForm();
    this.getFormData();
    if (this.data?.update) {
      this.bankID = this.data.data?.bank_id;
      this.form.patchValue(this.data?.data);
    }
    this.defualtLanguageInputs();
  }

  defualtLanguageInputs() {
    if (this.translateService.getSelectedLanguage() == 'ar') {
      this.language = this.translate.instant('MENU.en_language');
      this.nameOfEnglish = false;
      this.nameofArabic = true;
    } else {
      this.language = this.translate.instant('MENU.ar_language');
      this.nameOfEnglish = true;
      this.nameofArabic = false;
    }
  }

  // initialize Form
  initForm() {
    this.form = this._FormBuilder.group({
      name_ar: ['', Validators.required],
      name_en: ['', Validators.required],
      nick_name_ar: ['', Validators.required],
      nick_name_en: ['', Validators.required],
      status: [1],
    });
  }

  // get the status form control
  get statusValue() {
    return this.form.get('status').value;
  }

  getFormData() {
    this.subscription.add(
      forkJoin([
        this._shredService.selectedCompanyNumber$.pipe(take(1)),
        this._shredService.selectedConstCenterId$.pipe(take(1)),
      ]).subscribe((res) => {
        this.selectedMotherCompanyNumber = res[0];
        this.selectedConstCenterNumber = res[1];
        this.getBankAccountGuide();
        this.getBank();
      })
    );
  }

  getBankAccountGuide() {
    this.subscription.add(
      this.listService
        .getAccountGuideTree(this.selectedMotherCompanyNumber)
        .subscribe((res: any) => {
          this.accountGuide = res.filter((e) => e?.code);
        })
    );
  }

  getBank() {
    this.subscription.add(
      this.listService
        .getBank(
          this.selectedMotherCompanyNumber,
          this.selectedConstCenterNumber
        )
        .subscribe((res: any) => {
          this.bankName = res?.items;
        })
    );
  }

  submit() {
    if (
      this.form.get('name_ar').value === '' &&
      this.form.get('nick_name_ar').value === ''
    ) {
      this.form.controls['name_ar'].setValue(this.form.get('name_en').value);
      this.form.controls['nick_name_ar'].setValue(
        this.form.get('nick_name_en').value
      );
    } else if (
      this.form.get('name_en').value === '' &&
      this.form.get('nick_name_en').value === ''
    ) {
      this.form.controls['name_en'].setValue(this.form.get('name_ar').value);
      this.form.controls['nick_name_en'].setValue(
        this.form.get('nick_name_ar').value
      );
    }
    const body = this.prepareDataBeforePost(this.form.value);
    this.subscription.add(
      this.paymentService
        .createNewPaymentMethod(body)
        .pipe(tap(() => this.dialog.close(true)))
        .subscribe(
          (res: any) => {
            this.toaster.success(res.message);
          },
          (err) => {
            this.formErrors = err?.error;
          }
        )
    );
  }

  prepareDataBeforePost(formVal) {
    const data = {
      ...formVal,
      status: this.data ? (formVal.status ? 1 : 2) : 1,
      id: this.data?.data?.id,
      bank_id: this.bankID,
    };

    if (!this.data.update) {
      delete data.id;
    }
    return data;
  }

  toggleLanguage() {
    if (this.nameofArabic === true) {
      this.language = this.translate.instant('MENU.ar_language');
      this.nameOfEnglish = true;
      this.nameofArabic = false;
    } else if (this.nameOfEnglish === true) {
      this.language = this.translate.instant('MENU.en_language');
      this.nameOfEnglish = false;
      this.nameofArabic = true;
    }
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }
}
