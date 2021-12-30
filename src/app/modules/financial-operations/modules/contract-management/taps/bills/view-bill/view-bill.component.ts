import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { TranslationService } from 'src/app/modules/i18n/translation.service';
import { ContractsService } from '../../../service/contracts/contracts.service';
import { ServiceService } from '../../../service/service.service';

@Component({
  selector: 'app-view-bill',
  templateUrl: './view-bill.component.html',
  styleUrls: ['./view-bill.component.scss']
})
export class ViewBillComponent implements OnInit {
  subscription: Subscription = new Subscription()
   id: number;
   view_bill;
   view_bill_table;
   total = 0;
   all_taxes_value = 0;
   total_discount = 0;
   total_due = 0;
  constructor(
    private contractService: ContractsService,
    private route: ActivatedRoute,  
    public translation: TranslationService,
  
  ) { }

  ngOnInit(): void {
    this.getContractById()
  }
  getContractById() {
    this.route.queryParams.subscribe((params) => {
      this.id = params["id"];
      console.log(this.id , "ID")
      if (this.id) {
        this.view_bill = {}
        this.subscription.add(
          this.contractService.getBillById(this.id)
            .subscribe((res: any) => {
              console.log(res , 'RES')
              console.log(res?.item?.name_ar , 'NAME')
             this.view_bill = {
              name : (this.translation.getSelectedLanguage() == 'ar') ? res?.item?.name_ar : res?.item?.name_en,
               parent_name : (this.translation.getSelectedLanguage() == 'ar') ? res?.item?.parent_ar : res?.item?.parent_en,
               number : res?.item.number,
               company_name : res?.item?.mother_company.name,
               address_street :res?.item?.mother_company.address_street,
               city :res?.item?.mother_company.city,
               tax_number : res?.item?.mother_company.tax_number,
               qr : res.item.qr,
               student_name : (this.translation.getSelectedLanguage() == 'ar') ? res?.item?.student_ar : res?.item?.student_en,
               date: res?.item?.due_date_show
             }
             this.view_bill_table = res?.item?.items
              res?.item?.items.map(x =>{
               this.total= (this.total + x.value)
               this.all_taxes_value = (this.all_taxes_value + x.all_taxes_value)
               this.total_discount = (this.total_discount + x.total_discount)
               this.total_due = (this.total_due + x.total_due)
                });
            })
        );
      }
    });
  }
}
