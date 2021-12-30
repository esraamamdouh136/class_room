import { Component, OnInit } from '@angular/core';
import { TranslateService } from "@ngx-translate/core";
import { TranslationService } from "../i18n/translation.service";

@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.scss']
})
export class AuthComponent implements OnInit {

  today: Date = new Date();

  constructor(private translationService: TranslationService,
    private _TranslateService: TranslateService
  ) { }

  ngOnInit(): void {
    if (localStorage.getItem("language")) {
      let currentLang = localStorage.getItem("language");
      this.changeLanguage(currentLang);
    }
  }

  changeLanguage(lang) {
    this.translationService.changeDirection(lang);
    this.translationService.setLanguage(lang);
  }

}
