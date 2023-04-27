import {
  Component,
  ElementRef,
  Input,
  OnChanges,
  OnInit,
  SimpleChanges,
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
  @Input() maxData: any[];
  @Input() middleLabel: string[];

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
    const data = this.data ? this.data : this.maxData;
    this.donut = new Chart({
      chart: {
        type: 'pie',
        plotShadow: false,
        plotBorderWidth: null,
        plotBackgroundColor: '#F6F8FF',
      },
      tooltip: {
        formatter: function () {
          return '<b>' + Highcharts.numberFormat(this.y, 2) + ' €</b>';
        },
        // pointFormat: '<b> {point.y} Euro</b>',
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
            alignTo: 'connectors',
            connectorWidth: 0.3,
            connectorColor: '#000000',
            connectorShape: 'straight',
            crookDistance: 20,
            formatter: function () {
              if (this.y > 0) {
                return (
                  this.point.name +
                  ': ' +
                  '<b>' +
                  Highcharts.numberFormat(this.point.percentage, 1) +
                  ' %'
                );
              }
              return null;
            },
            style: {
              fontSize: '10px',
              fontWeight: '150',
            },
            distance: 2,
            softConnector: false,
          },
          showInLegend: true,
        },
      },
      title: {
        verticalAlign: 'middle',
        floating: false,
        text: 'Total',
        y: -30,
      },
      subtitle: {
        text: this.middleLabel ? this.middleLabel[0] : '',
        verticalAlign: 'middle',
        floating: false,
        y: -10,
      },
      legend: {
        enabled: true,
        layout: 'horizontal',
        itemStyle: {
          fontSize: '12px',
          fontWeight: 'normal',
        },
      },
      series: [
        {
          type: 'pie',
          colorByPoint: true,
          data: data.map((item, i) => {
            return {
              name: this.labels[i],
              y: item,
              color: this.getColor(i),
            };
          }),
        },
      ],
    });
  }
  getColor(i: number) {
    return COLORS[i % 5];
  }
}
