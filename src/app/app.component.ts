import {
    Component,
    ChangeDetectionStrategy,
    OnDestroy,
    OnInit,
} from '@angular/core';
import { TranslationService } from './modules/i18n/translation.service';
// language list
import { locale as enLang } from './modules/i18n/vocabs/en';
import { locale as arLang } from './modules/i18n/vocabs/ar';
import { SplashScreenService } from './_metronic/partials/layout/splash-screen/splash-screen.service';
import { Router, NavigationEnd, NavigationError } from '@angular/router';
import { Subscription } from 'rxjs';
import { TableExtendedService } from './_metronic/shared/crud-table';
import { TopNavService } from './shared/services/top-nav.service';

@Component({
    // tslint:disable-next-line:component-selector
    selector: 'body[root]',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss'],
    // Cahnge changeDetection stratigy
    // changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppComponent implements OnInit, OnDestroy {
    private unsubscribe: Subscription[] = []; // Read more: => https://brianflove.com/2016/12/11/anguar-2-unsubscribe-observables/
    loadded;

    constructor(
        private translationService: TranslationService,
        private splashScreenService: SplashScreenService,
        private router: Router,
        private tableService: TableExtendedService,
    ) {
        // register translations
        this.translationService.loadTranslations(
            enLang,
            arLang
        );
    }

    ngOnInit() {
        // If user does not choose language AR is default
        let currentLang = localStorage.getItem('language') ? localStorage.getItem('language') : 'ar';
        this.translationService.setLanguage(currentLang);
        const routerSubscription = this.router.events.subscribe((event) => {
            if (event instanceof NavigationEnd) {
                // clear filtration paginations and others
                this.tableService.setDefaults();
                // hide splash screen
                this.splashScreenService.hide();

                // scroll to top on every route change
                window.scrollTo(0, 0);

                // to display back the body content
                setTimeout(() => {
                    document.body.classList.add('page-loaded');
                }, 500);
            }
        });
        this.unsubscribe.push(routerSubscription);
    }


    ngOnDestroy() {
        this.unsubscribe.forEach((sb) => sb.unsubscribe());
    }
}
