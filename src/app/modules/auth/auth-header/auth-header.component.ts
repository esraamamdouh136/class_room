import { Component, OnInit } from "@angular/core";
import { TranslateService } from "@ngx-translate/core";
import { TranslationService } from "../../i18n/translation.service";

@Component({
  selector: "app-auth-header",
  templateUrl: "./auth-header.component.html",
  styleUrls: ["./auth-header.component.scss"],
})
export class AuthHeaderComponent implements OnInit {
  selectedLang: string = "ar";
  currentLang = "ar";
  languageLocalStorage = "";
  languages = [
    {
      name: "English",
      code: "en",
      flag: "https://v1.viewclass.com/assets/app/media/img/flags/020-flag.svg",
    },
    {
      name: "اللغه العربيه",
      code: "ar",
      flag: "https://v1.viewclass.com/assets/app/media/img/flags/008-saudi-arabia.svg",
    },
  ];


  constructor(
    private translationService: TranslationService,
    private _TranslateService: TranslateService
  ) { }

  ngOnInit(): void {
    if (localStorage.getItem("language")) {
      this.languageLocalStorage = localStorage.getItem("language");
      this.selectedLang = this.languageLocalStorage;
    }
  }

  changeLanguage(lang) {
    //this.translationService.changeDirection(lang);
    //this.translationService.setLanguage(lang);
    //this.currentLang = lang; 
      localStorage.setItem('language', lang);              
      window.location.reload();
    
  }
 
}
