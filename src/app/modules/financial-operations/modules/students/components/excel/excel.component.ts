import { Component, OnInit } from '@angular/core';
import { TranslationService } from 'src/app/modules/i18n/translation.service';

@Component({
  selector: 'app-excel',
  templateUrl: './excel.component.html',
  styleUrls: ['./excel.component.scss']
})
export class ExcelComponent implements OnInit {
  class_room =[
  {name : 'الاول الابتدائي'},
  {name : 'الثانى الابتدائي'},
  {name : 'الثالث الابتدائي'},
  {name : 'الرابع الابتدائي'},
  {name : 'الخامس الابتدائي'},

]
  constructor(
    public translation: TranslationService,

  ) { }

  ngOnInit(): void {
  }

}
