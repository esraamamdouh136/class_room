import { Component, OnInit } from '@angular/core';
import { TranslationService } from 'src/app/modules/i18n/translation.service';

@Component({
  selector: 'app-student-search',
  templateUrl: './student-search.component.html',
  styleUrls: ['./student-search.component.scss']
})
export class StudentSearchComponent implements OnInit {

  constructor(
    public translation: TranslationService,
  ) { }

  ngOnInit(): void {
  }

}
