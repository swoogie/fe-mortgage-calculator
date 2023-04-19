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

@Component({
  selector: 'app-donut',
  templateUrl: './donut.component.html',
  styleUrls: ['./donut.component.scss'],
})
export class DonutComponent implements OnInit, OnChanges {
  @Input() total: number;
  donut: any = {};

  constructor() {
    this.donut = {};
  }
  ngOnChanges(changes: SimpleChanges) {
    if (changes['total'] && !changes['total'].firstChange) {
      this.donut.title.text = `Total: ${this.total}`;
    }
  }
  ngOnInit() {
    this.donut = new Chart({
      chart: {
        type: 'pie',
        plotShadow: false,
        plotBorderWidth: null,
      },
      tooltip: {
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
            softConnector: true,
          },
          showInLegend: true,
        },
      },
      title: {
        verticalAlign: 'middle',
        floating: false,
        text: `Total: ${this.total}`,
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
          data: [
            { name: 'Mortgage loans', y: 68.1, color: '#c5cae9' },
            { name: 'Consumer loans', y: 11.0, color: '#FFCB6F' },
            { name: 'Leasing amount', y: 11.2, color: '#7986cb' },
            { name: 'Credit card limit', y: 9.7, color: '#4FA57F' },
          ],
        },
      ],
    });
    this.setTitleText();
  }

  add() {
    this.donut.addPoint(Math.floor(Math.random() * 10));
  }

  private setTitleText() {
    if (this.donut) {
      this.donut.title.text = `Total: ${this.total}`;
    }
  }
}
