import { Component, ElementRef, HostListener, OnInit } from '@angular/core';
import { SharedService } from 'src/app/shared/services/shared.service';

@Component({
  selector: 'app-personal-details',
  templateUrl: './personal-details.component.html',
  styleUrls: ['./personal-details.component.scss']
})
export class PersonalDetailsComponent implements OnInit {

  menuItems = [];
  loading = true;
  showMenu = false;

  constructor(
    private sharedService : SharedService,
    private eRef: ElementRef

  ) { }

  toggleSidebar:boolean;
  @HostListener('document:click', ['$event'])
  clickout(event) {
    if(this.eRef.nativeElement.contains(event.target)) {
      this.toggleSidebar = false;
    }
  }

  ngOnInit(): void {
    this.sharedService.toggleMenu.subscribe(res =>{
      this.toggleSidebar = res
    })
    this.menuItems = [
      {
        slug: 'basic-information',
        color: '#F1B81C',
        css_class: 'fa fa-list',
        name: 'البيانات الاساسية'
      },
      {
        slug: 'security',
        color: '#E84F6A',
        css_class: 'fa fa-shield-alt',
        name: 'الحماية'
      },
      {
        slug: 'alerts',
        color: '#E84F6A',
        css_class: 'fa fa-bell',
        name: 'التنبيهات'
      },
    ];
  }


}
