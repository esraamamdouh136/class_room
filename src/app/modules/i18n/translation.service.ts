// Localization is based on '@ngx-translate/core';
// Please be familiar with official documentations first => https://github.com/ngx-translate/core

import { DOCUMENT } from "@angular/common";
import { Inject, Injectable } from "@angular/core";
import { TranslateService } from "@ngx-translate/core";
import {BehaviorSubject} from 'rxjs';

export interface Locale {
  lang: string;
  data: any;
}

const LOCALIZATION_LOCAL_STORAGE_KEY = "language";

@Injectable({
  providedIn: "root",
})
export class TranslationService {
  // Private properties
  private langIds: any = [];
  dir: BehaviorSubject<any> = new BehaviorSubject<any>(this.getDirection());

  constructor(
    private translate: TranslateService,
    @Inject(DOCUMENT) private document: Document
  ) {
    // add new langIds to the list
    this.translate.addLangs(["en"]);

    // this language will be used as a fallback when a translation isn't found in the current language
    this.translate.setDefaultLang("en");
  }

  loadTranslations(...args: Locale[]): void {
    const locales = [...args];

    locales.forEach((locale) => {
      // use setTranslation() with the third argument set to true
      // to append translations instead of replacing them
      this.translate.setTranslation(locale.lang, locale.data, true);

      this.langIds.push(locale.lang);
    });

    // add new languages to the list
    this.translate.addLangs(this.langIds);
  }

  setLanguage(lang) {
    if (lang) {
      this.translate.use(this.translate.getDefaultLang());
      this.translate.use(lang);
      localStorage.setItem(LOCALIZATION_LOCAL_STORAGE_KEY, lang);
    }
  }

  /**
   * Returns selected language
   */
  getSelectedLanguage(): any {
    return (
      localStorage.getItem(LOCALIZATION_LOCAL_STORAGE_KEY) ||
      this.translate.getDefaultLang()
    );
  }
  // Change HTML Dir attribute depend on SelectedLanguage
  // TO change style
  changeDirection(lang) {
    const htmlTag = this.document.getElementsByTagName(
      "html"
    )[0] as HTMLHtmlElement;
    htmlTag.dir = lang === "ar" ? "rtl" : "ltr";
    htmlTag.lang = lang;
    htmlTag.setAttribute("direction", `${lang === "ar" ? "rtl" : "ltr"}`);
    this.dir.next(this.getDirection());
  }

  getDirection(): string {
    return this.getSelectedLanguage() === 'en' ? 'ltr' : 'rtl';
  }
}
