import { HttpErrorResponse } from "@angular/common/http";
import { Component, OnInit } from '@angular/core';
import { ToastrService } from "ngx-toastr";
import { SharedService } from "src/app/shared/services/shared.service";
import { SerialNumbers } from "../../services/serial-numbers/seril-number.service";

@Component({
  selector: 'app-serial-numbers',
  templateUrl: './serial-numbers.component.html',
  styleUrls: ['./serial-numbers.component.scss']
})
export class SerialNumbersComponent implements OnInit {

  form = {
    contracts_start_char_branch: '',
    contracts_start_char_contract: '',
    contracts_contract_number_count: '',
    payment_start_char_contract: '',
    payment_start_char_branch: '',
    payment_number_count: '',
    receipt_start_char_branch: '',
    receipt_start_char_contract: '',
    receipt_number_count: ''
  };

  formErrors ;

  formGroup = {
    invoice: {
      company_char: '',
      prefix_char: '',
      start_with: 1,
      number: 1
    },
    contract: {
      company_char: '',
      prefix_char: '',
      start_with: 1,
      number: 1
    },
    payment_voucher: {
      company_char: '',
      prefix_char: '',
      start_with: 1,
      number: 1
    },
    receipt_voucher: {
      company_char: '',
      prefix_char: '',
      start_with: 1,
      number: 1
    },
    parent_collection: {
      company_char: '',
      prefix_char: '',
      start_with: 1,
      number: 1
    },
    parent_receipt: {
      company_char: '',
      prefix_char: '',
      start_with: 1,
      number: 1
    }
  }

  defaultForm = JSON.stringify(this.formGroup);

  constructor(
    private serialNumbers: SerialNumbers,
    private toaster: ToastrService,
    private shared: SharedService,
  ) {
  }

  ngOnInit(): void {
    this.shared.navChanged$.subscribe(res => {
      this.getSerialNumbers();
    })
  }

  generateNumberCount(count,startWith): string {
    count = Number(count);
    
    let filledStr = '';
    if (count >= 1 && count >= `${startWith}`.length) {
      for (let i = 0; i < count - `${startWith}`.length  ; i++) {
        filledStr = filledStr + '0';
      }
      return filledStr + startWith;
    } else {
      return '';
    }
  }

  addSerialNumbers() {
    this.serialNumbers.addSerialNumbers(this.formGroup).subscribe((res: any) => {
      this.toaster.success(res.message);
      this.formErrors = {};
    },(error:HttpErrorResponse) => {
      if (error.status == 422) {
        this.formErrors = error?.error;
      }
    })
  }

  getSerialNumbers() {
    this.serialNumbers.getSerialNumbers().subscribe((res: any) => {
      if(!Array.isArray(res.items)){
        this.formGroup = res.items
      } else {
        this.formGroup = JSON.parse(this.defaultForm);
      }
    })
  }

}
