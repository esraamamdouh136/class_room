import { Component, OnInit } from '@angular/core';
import { ServicepremiumsService } from '../../services/types-of-premiums/servicepremiums.service';

@Component({
  selector: 'app-types-of-premiums',
  templateUrl: './types-of-premiums.component.html',
  styleUrls: ['./types-of-premiums.component.scss']
})
export class TypesOfPremiumsComponent implements OnInit {
   se
  constructor
  (
   private servicePermiums : ServicepremiumsService
  ) { }

  ngOnInit(): void {
    this.getPermiums()
  }

  getPermiums() {
    this.servicePermiums.getPremiums('').subscribe(res => {
    })
  }

}
