import { TranslationWidth } from "@angular/common";
import { Injectable } from '@angular/core';
import { NgbDatepickerI18n, NgbDateStruct } from "@ng-bootstrap/ng-bootstrap";

const WEEKDAYS = ['ن', 'ث', 'ر', 'خ', 'ج', 'س', 'ح'];
const MONTHS = ['محرم', 'صفر', 'ربيع الأول', 'ربيع الآخر', 'جمادى الأولى', 'جمادى الآخرة', 'رجب', 'شعبان', 'رمضان', 'شوال',
  'ذو القعدة', 'ذو الحجة'];

@Injectable({ providedIn: 'root' })
export class HijriDatePickerService extends NgbDatepickerI18n {

    getMonthShortName(month: number) {
        return MONTHS[month - 1];
    }

    getMonthFullName(month: number) {
        return MONTHS[month - 1];
    }

    getWeekdayLabel(weekday: number, width?: TranslationWidth) {
        return WEEKDAYS[weekday - 1];
    }

    getWeekdayShortName(weekday: number, width?: TranslationWidth) {
        return WEEKDAYS[weekday - 1];
    }

    getDayAriaLabel(date: NgbDateStruct): string {
        return `${date.day}-${date.month}-${date.year}`;
    }

}