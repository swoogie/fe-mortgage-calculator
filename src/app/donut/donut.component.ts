import {
  Component,
  ElementRef,
  Input,
  OnChanges,
  OnInit,
  SimpleChanges,
  ViewChild,
} from '@angular/core';
import { Chart } from 'angular-highcharts';
import * as Highcharts from 'highcharts';

const COLORS = ['#c5cae9', '#FFCB6F', '#7986cb', '#4FA57F', '#FE8A7F'];

@Component({
  selector: 'app-donut',
  templateUrl: './donut.component.html',
  styleUrls: ['./donut.component.scss'],
})
export class DonutComponent implements OnInit, OnChanges {
  @Input() data: number[];
  @Input() labels: string[];
  donut: any = {};

  constructor() {
    this.donut = {};
  }
  ngOnChanges(changes: SimpleChanges) {
    this.setupChart();
  }
  ngOnInit() {
    this.setupChart();
  }

  setupChart() {
    this.donut = new Chart({
      chart: {
        // plotBackgroundColor: '#FE8A7F',
        type: 'pie',
        plotShadow: false,
        plotBorderWidth: null,
      },
      tooltip: {
        // enabled: false,
        pointFormat: '<b>{point.percentage:.1f}%</b>',
        shadow: false,
      },
      plotOptions: {
        pie: {
          innerSize: '70%',
          allowPointSelect: true,
          borderWidth: 0.2,
          size: '70%',
          borderColor: '#000000',
          slicedOffset: 0,

          dataLabels: {
            enabled: true,
            connectorWidth: 0.3,
            connectorColor: '#000000',
            connectorShape: 'straight',
            format:
              '<span style="color: #2A272A; font-weight="100""><b>{point.name}:</br><span style="color: #BFA5A6;">{point.percentage:.1f}%',
            style: {
              fontSize: '10px',
              fontWeight: '150',
            },
            distance: 15,
            softConnector: false,
          },
          showInLegend: true,
        },
      },
      title: {
        verticalAlign: 'middle',
        floating: false,
        text: `${this.data.reduce((a, b) => {
          a += b;
          return a;
        }, 0)} `,
        y: -30,
      },
      subtitle: {
        text: 'Total',
        verticalAlign: 'middle',
        floating: false,
        y: -10,
      },
      legend: {
        enabled: true,
        layout: 'vertical',
        itemStyle: {
          fontSize: '12px',
          fontWeight: 'normal',
        },
      },
      series: [
        {
          type: 'pie',
          colorByPoint: true,
          data: this.data.map((item, i) => {
            return { name: this.labels[i], y: item, color: this.getColor(i) };
          }),
        },
      ],
    });
  }
  getColor(i: number) {
    return COLORS[i % 5];
  }
}
