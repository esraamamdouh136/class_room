import { Component, OnInit } from '@angular/core';
import { ChartDataSets, ChartOptions, ChartType } from 'chart.js';
import { Label } from 'ng2-charts';
import { TranslationService } from 'src/app/modules/i18n/translation.service';

@Component({
  selector: 'app-bar-chart',
  templateUrl: './bar-chart.component.html',
  styleUrls: ['./bar-chart.component.scss']
})
export class BarChartComponent implements OnInit {

  constructor(
    public lang: TranslationService,
  ) { }

  ngOnInit(): void {
  }

     // start Data Chart bar
     public barChartOptions: ChartOptions = {
      legend: { display: false },
      responsive: true,
      scales: { //you're missing this
        yAxes: [{
          scaleLabel: {
            display: false,
          },
          ticks: { // and this
            callback: function () {
              return 10000 / 1000 + 'M';
            }
          }
        }],
        xAxes: [{
          gridLines: {
            display: false
          }
        }],
        
      }
    };
  
    public barChartLabels: Label[] = ['1/21', '2/21', '3/21', '4/21', '5/21', '6/21', '7/21', '8/21', '9/21', '10/21', '11/21', '12/21'];
    public barChartType: ChartType = 'bar';
    public barChartLegend = true;
    public barChartPlugins = [];
  
    public chartColorsBar: Array<any> = [
      { // first color
        backgroundColor: '#B4D093',
        borderColor: '#B4D093',
        pointBackgroundColor: '#B4D093',
        pointBorderColor: '#fff',
        pointHoverBackgroundColor: '#fff',
        pointHoverBorderColor: 'rgba(225,10,24,0.2)'
      },
      { // second color
        backgroundColor: '#ECCB7A',
        borderColor: '#ECCB7A',
        pointBackgroundColor: '#ECCB7A',
        pointBorderColor: '#fff',
        pointHoverBackgroundColor: '#fff',
        pointHoverBorderColor: '#ECCB7A'
      }];
  
    public barChartData: ChartDataSets[] = [
      { data: [20, 10, 40, 20, 56, 55, 40, 65, 59, 20, 30, 56, 55], label: 'Series A' },
      { data: [28, 48, 40, 19, 86, 27, 90, 28, 48, 40, 19, 30, 27, 90], label: 'Series B' }
    ];
  
    // End Data Chart bar

}
