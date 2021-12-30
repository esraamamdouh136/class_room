import { Component, OnInit } from '@angular/core';
import { Label } from 'ng2-charts';
import { TranslationService } from 'src/app/modules/i18n/translation.service';

@Component({
  selector: 'app-line-chart',
  templateUrl: './line-chart.component.html',
  styleUrls: ['./line-chart.component.scss']
})
export class LineChartComponent implements OnInit {

  constructor(
    public lang: TranslationService,

  ) { }

  ngOnInit(): void {
  }

    // start Data Chart Link
    chartData = [
      { data: [0, 4, 5, 6, 7, 9, 2, 4, 8, 25, 7, 40], label: 'Series A' },
    ];
    chartLabels: Label = ['1/21', '2/21', '3/21', '4/21', '5/21', '6/21', '7/21', '8/21', '9/21', '10/21', '11/21', '12/21'];
    chartOptions = {
      responsive: true,
      scales: { //you're missing this
        xAxes: [{
          gridLines: {
            display: false
          }
  
        }],
        yAxes: [{
          ticks: {
              display: false
          }
      }]
      }
    };
    chartColors = [
      {
        borderColor: '#E5EDEC',
        backgroundColor: 'transparent',
        pointBackgroundColor: '#4680FF',
        pointBorderColor: '#4680FF',
      },
    ];
    chartLegend = true;
    chartPlugins = [];
  
    // End Data Chart Link

}
