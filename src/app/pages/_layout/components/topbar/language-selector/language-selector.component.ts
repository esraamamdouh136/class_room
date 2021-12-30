import { DOCUMENT } from "@angular/common";
import {
  ChangeDetectorRef,
  Component,
  EventEmitter,
  Inject,
  OnInit,
  Output,
} from "@angular/core";
import { NavigationStart, Router } from "@angular/router";
import { filter } from "rxjs/operators";
import { TranslationService } from "../../../../../modules/i18n/translation.service";

interface LanguageFlag {
  lang: string;
  name: string;
  flag: string;
  active?: boolean;
}

@Component({
  selector: "app-language-selector",
  templateUrl: "./language-selector.component.html",
  styleUrls: ["./language-selector.component.scss"],
})
export class LanguageSelectorComponent implements OnInit {
  @Output() languageChange = new EventEmitter();
  language: LanguageFlag;
  languages: LanguageFlag[] = [
    {
      lang: "en",
      name: "English",
      flag: "https://v1.viewclass.com/assets/app/media/img/flags/020-flag.svg",
    },
    {
      name: "اللغه العربيه",
      lang: "ar",
      flag: "https://v1.viewclass.com/assets/app/media/img/flags/008-saudi-arabia.svg",
    },
  ];
  Selectedlanguage;
  placement;
  showLangDropDown: boolean = false;
  selectedLang: string
  currentLangObject: any;

  constructor(
    private translationService: TranslationService,
    private router: Router,
    @Inject(DOCUMENT) private document: Document,
    private changeDetection: ChangeDetectorRef
  ) { }

  ngOnInit() {
    this.setSelectedLanguage();
    this.placement =
      this.translationService.getSelectedLanguage() == "en"
        ? "bottom-right"
        : "bottom-left";
    this.router.events
      .pipe(filter((event) => event instanceof NavigationStart))
      .subscribe((event) => {
        this.setSelectedLanguage();
      });
  }

  setLanguageWithRefresh(lang) {
    localStorage.setItem('language', lang);              
    window.location.reload();
    this.showLangDropDown = !this.showLangDropDown
  }

  setLanguage(lang) {
    this.languages.forEach((language: LanguageFlag) => {
      if (language.lang === lang) {
        language.active = true;
        this.language = language;
      } else {
        language.active = false;
      }
    });
    this.translationService.setLanguage(lang);
  }

  setSelectedLanguage(): any {
    this.changeLang(this.translationService.getSelectedLanguage());
    this.setLanguage(this.translationService.getSelectedLanguage());
  }

  // Edit Language
  changeLang(lang) {
    this.placement = lang == "en" ? "bottom-right" : "bottom-left";
    this.currentLangObject = this.languages.find(d => d.lang === lang)
    this.selectedLang = lang
    this.translationService.changeDirection(lang)
    this.languageChange.emit(lang);
  }

  selectOption(lang) {
    this.translationService.setLanguage(lang)
    window.location.reload();
  }


  showLangDrop() {
    this.showLangDropDown = !this.showLangDropDown
  }

}
