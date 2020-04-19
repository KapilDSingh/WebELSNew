import { Component, OnInit, ViewChild, Input, OnChanges, SimpleChanges, NgZone } from '@angular/core';
import { GoogleChartService } from '../services/google-chart.service';
import { Router, ActivatedRoute, RouterEvent, NavigationEnd } from '@angular/router';
import { MeterData } from '../Models/MeterModel';
import { DatePipe } from '@angular/common';
import { MinMaxDate } from '../Models/MiscModels';
import { MeterService } from '../services/meter.service';
import { SignalrISOdataService } from '../services/signalr-ISOdata.service';
import { MiscService } from '../services/misc.service';
import { NONE_TYPE } from '@angular/compiler/src/output/output_ast';
import { ResizedEvent } from 'angular-resize-event';
import { filter, takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';


@Component({
  selector: 'app-kw-chart',
  templateUrl: './kw-chart.component.html',
  styleUrls: ['./kw-chart.component.scss']
})
export class KwChartComponent implements OnInit {

  public destroyed = new Subject<any>();
  private gLib: any;
  private minMaxDate: MinMaxDate;
  private meterKWTable: any;
  private meterKWDashboard: any;
  private chartTitle: string;
  private meterKWLine: any;
  private meterKWDateSlider: any;
  private width: number;
  private height: number;
  private controlOptions: any;

  constructor(private gChartService: GoogleChartService, private route: ActivatedRoute,
    private signalrService: SignalrISOdataService, private _ngZone: NgZone, private miscSvc: MiscService) {
    this.gLib = this.gChartService.getGoogle();
    this.gLib.charts.load('current', { 'packages': ['corechart', 'table', 'controls'] });
    this.gLib.charts.setOnLoadCallback(this.drawMeterKWChart.bind(this));
    route.params.pipe(
      takeUntil(this.destroyed)
    ).subscribe(val => {
      this.chartData = this.route.snapshot.data.MeterData;
    });
  }

  private chartData = new Array<MeterData>();

  private options = {
    enableInteractivity: true,

    seriesType: 'bars',
    colors: ['#13f9f6'],
    legend: {
      position: 'top', alignment: 'end'
    },
    titleTextStyle: {
      color: 'black',    // any HTML string color ('red', '#cc00cc')
      fontName: 'Montesserat', // i.e. 'Times New Roman'
      fontSize: '24', // 12, 18 whatever you want (don't specify px)
      bold: false,    // true or false
      italic: true,   // true of false
    },
    chartArea: { width: '80%', height: '80%' },
    crosshair: { trigger: 'both' },
    curveType: 'function',
    lineWidth: 1,
    vAxis: { title: 'KW', textStyle: { fontSize: '12' }, format: 'short' },
    hAxis: {
      textStyle: {
        fontSize: '12'
      },
      gridlines: {
        count: -1,
        units: {
          days: { format: ['MMM dd'] },
          hours: { format: ['HH:mm', 'ha'] },
        }
      },
      minorGridlines: {
        units: {
          hours: { format: ['hh:mm:ss a', 'ha'] },
          minutes: { format: ['HH:mm a Z', ':mm'] }
        }
      },

    },
  }
  setFilterOptions() {
    this.controlOptions = {
      // Filter by the date axis.
      'filterColumnIndex': 0,
      ui: {
        'chartOptions': {

          chartArea: { width: '80%', height: '100%' },
          hAxis: {
            textStyle: {
              fontSize: '14'
            },
            gridlines: {
              count: -1,
              units: {
                days: { format: ['MMM dd'] },
                hours: { format: ['HH:mm', 'ha'] },
              }
            },
            minorGridlines: {
              units: {
                hours: { format: ['hh:mm:ss a', 'ha'] },
                minutes: { format: ['HH:mm a Z', ':mm'] }
              }
            }
          }
        },
      }

    }
  }

  ngOnInit() {
    this.chartData = this.route.snapshot.data.MeterData;

    this.signalrService.MeterKWDataMessageReceived
      .pipe(takeUntil(this.destroyed))
      .subscribe((data) => {
        this._ngZone.run(() => {
          this.updateMeterKWChart(data);
        });
      });
  }
  formatAxes() {
    const date_formatter = new this.gLib.visualization.DateFormat({ pattern: 'MMM dd, yyyy,  h:mm aa' });
    date_formatter.format(this.meterKWTable, 0);  // Where 0 is the index of the column

    const formatter = new this.gLib.visualization.NumberFormat({ suffix: ' KW', pattern: '#,###' });
    formatter.format(this.meterKWTable, 1); // Apply formatter to second column
  }


  setConditionalFormat(day: number, chartRow: Array<Date | number | string | Boolean>): Array<Date | number | string | Boolean> {
    if (day > 0 && day < 6) {
      chartRow.push('opacity:.7');
      chartRow.push(true);
    } else {
      chartRow.push('opacity:.2');
      chartRow.push(false);
    }
    return chartRow;
  }


  private drawMeterKWChart(options) {
    // Create the dataset (DataTable)
    this.meterKWTable = new this.gLib.visualization.DataTable();
    this.meterKWTable.addColumn('date', 'Date');
    this.meterKWTable.addColumn('number', 'KW Weekdays');
    this.meterKWTable.addColumn({ type: 'string', role: 'style' });
    this.meterKWTable.addColumn({ type: 'boolean', role: 'certainty' });

    for (let i = 0; i < this.chartData.length; i++) {
      let chartRow = new Array<Date | number | string | Boolean>();
      const date = new Date(this.chartData[i].timestamp);

      chartRow.push(date);
      chartRow.push(this.chartData[i].rms_Watts_Tot*10/1000);

      const day = date.getDay();
      chartRow = this.setConditionalFormat(day, chartRow);

      this.meterKWTable.addRow(chartRow);
    }
    this.chartTitle = 'Rate of Electricity Use (KW) at minute intervals. Last Reading at ' + new Date(this.chartData[this.chartData.length - 1].timestamp).toLocaleTimeString() + ' (EST)';

    let MaxDt = new Date(this.chartData[this.chartData.length - 1].timestamp);
    let MinDt = new Date(MaxDt);
    MinDt.setDate(MaxDt.getDate() - 1);

    // Create a dashboard.
    const dash_container = document.getElementById('MeterKWdashboard_div');

    this.meterKWDashboard = new this.gLib.visualization.Dashboard(dash_container);

    // Create a date range slider
    this.meterKWDateSlider = new this.gLib.visualization.ControlWrapper({
      'controlType': 'ChartRangeFilter',
      'containerId': 'MeterKWcontrol_div',
      'state': { 'range': { 'start': MinDt, 'end': MaxDt } }
    });
    this.setFilterOptions();
    this.meterKWDateSlider.setOptions(this.controlOptions);

    this.formatAxes();

    // Line chart visualization
    this.meterKWLine = new this.gLib.visualization.ChartWrapper({
      'chartType': 'ComboChart',
      'containerId': 'MeterKWline_div',

      'options': this.options,
    });
    this.meterKWLine.setOption('title', this.chartTitle);
    // Bind meterKWLine to the dashboard, and to the controls
    // this will make sure our line chart is updated when our date changes
    this.meterKWDashboard.bind(this.meterKWDateSlider, this.meterKWLine);

    this.meterKWDashboard.draw(this.meterKWTable);
  }

  private updateMeterKWChart(data: MeterData) {
    this.chartData.push(data);
    this.chartTitle = 'Rate of Electricity Use (KW) at minute intervals. Last Reading at ' + new Date(this.chartData[this.chartData.length - 1].timestamp).toLocaleTimeString() + ' (EST)';

    let chartRow = new Array<Date | number | string | Boolean>();
    const date = new Date(data.timestamp);
    chartRow.push(date);
    chartRow.push(data.rms_Watts_Tot*10/1000);
    const day = date.getDay();

    if (this.meterKWDashboard != undefined) {
      chartRow = this.setConditionalFormat(day, chartRow);
      this.meterKWTable.addRow(chartRow);
      this.meterKWLine.setOption('title', this.chartTitle);

      this.formatAxes();
      this.meterKWDashboard.draw(this.meterKWTable);
    }
  }
  onResized(event: ResizedEvent) {
    this.width = event.newWidth;
    this.height = event.newHeight;


    console.log('width', this.width);
    console.log('height', this.height);

    if (this.meterKWLine != undefined) {
      this.meterKWLine.draw();
      this.meterKWDateSlider.draw();
    }
  }
  ngOnDestroy(): void {
    this.destroyed.next();
    this.destroyed.complete();
  }
}

