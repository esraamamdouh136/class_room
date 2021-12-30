import {Component, OnInit} from '@angular/core';
import {TranslationService} from 'src/app/modules/i18n/translation.service';

// import * as pluginLabels from 'chartjs-plugin-labels';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],

})
export class DashboardComponent implements OnInit {
  viewMode = 'tab1';
  note: boolean = false;

  constructor(
    public lang: TranslationService,
  ) {
  }

  ngOnInit() {
    // this.pieChartPlugins = [pluginLabels];
  }

  noteHover() {
    this.note = true;
  }

  noteOut() {
    this.note = false;
  }


}
