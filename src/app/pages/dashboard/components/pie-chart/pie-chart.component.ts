import { Component, OnInit } from '@angular/core';
import { ChartOptions } from 'chart.js';

@Component({
  selector: 'app-pie-chart',
  templateUrl: './pie-chart.component.html',
  styleUrls: ['./pie-chart.component.scss']
})
export class PieChartComponent implements OnInit {

  constructor() { }

  ngOnInit() {
  }

  chartOptionsPie = {
    responsive: true,
  };
  chartLabelsPie = ['الرواتب والاجور','الايجارات', 'مصروفات حكوميه' , 'مصروفات اخرى'];
  chartDataPie = [300, 500, 100 , 200];
  chartColorsPie = [{
    backgroundColor: ['#6CB6D2', '#72A638', '#B490C0' , '#F0D079'],
    borderColor: ['#6CB6D2', '#72A638', '#B490C0' , '#F0D079']
  }];
  chartLegendPie = true;
  chartPluginsPie = [];

  private createOptions(): ChartOptions {
    return {
      responsive: true,
          maintainAspectRatio: true,
          plugins: {
              labels: {
                render: 'percentage',
                precision: 2
              }
          },
    };
  }
}
