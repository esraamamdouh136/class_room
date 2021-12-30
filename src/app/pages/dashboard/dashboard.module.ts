import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { DashboardComponent } from './dashboard.component';
import { ChartsModule } from 'ng2-charts';
import { BarChartComponent } from './components/bar-chart/bar-chart.component';
import { LineChartComponent } from './components/line-chart/line-chart.component';
import { PieChartComponent } from './components/pie-chart/pie-chart.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { TimelineComponent } from './components/timeline/timeline.component';

@NgModule({
  declarations: [DashboardComponent, BarChartComponent, LineChartComponent, PieChartComponent, TimelineComponent],
  imports: [
    CommonModule,
    ChartsModule,
    SharedModule,
    RouterModule.forChild([
      {
        path: '',
        component: DashboardComponent,
      },
    ])
  ],
})
export class DashboardModule {}
