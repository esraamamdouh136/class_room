import { Component, ElementRef, HostListener, OnInit } from '@angular/core';
import { SharedService } from 'src/app/shared/services/shared.service';
@Component({
  selector: 'app-contract-management',
  templateUrl: './contract-management.component.html',
  styleUrls: ['./contract-management.component.scss']
})
export class ContractManagementComponent implements OnInit {
  toggleSidebar
  @HostListener('document:click', ['$event'])
  clickout(event) {
    if(this.eRef.nativeElement.contains(event.target)) {
      this.toggleSidebar = false;
    }
  }
  constructor
  (
    private sharedService : SharedService,
    private eRef: ElementRef
  ) { }

  ngOnInit(): void {
    this.sharedService.toggleMenu.subscribe(res =>{
      this.toggleSidebar = res
    })
  }
}
