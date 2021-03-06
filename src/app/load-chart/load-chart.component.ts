import { Component, OnInit, ViewChild, Input, OnChanges, SimpleChanges, NgZone } from '@angular/core';
import { GoogleChartService } from '../services/google-chart.service';
import { Router, ActivatedRoute, RouterEvent, NavigationEnd } from '@angular/router';
import { loadTblRow } from '../Models/IsoModels';
import { DatePipe } from '@angular/common';
import { MinMaxDate } from '../Models/MiscModels';
import { LoadService } from '../services/load.service';
import { SignalrISOdataService } from '../services/signalr-ISOdata.service';
import { MiscService } from '../services/misc.service';
import { NONE_TYPE } from '@angular/compiler/src/output/output_ast';
import { ResizedEvent } from 'angular-resize-event';
import { filter, takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';


@Component({
  selector: 'app-load-chart',
  templateUrl: './load-chart.component.html',
  styleUrls: ['./load-chart.component.css']
})
export class LoadChartComponent implements OnInit {

  public destroyed = new Subject<any>();
  private gLib: any;
  private minMaxDate: MinMaxDate;
  private loadTable: any;
  private loadDashboard: any;
  private chartTitle: string;
  private loadLine: any;
  private loadDateSlider: any;
  private width: number;
  private height: number;
  private controlOptions: any;

  constructor(private gChartService: GoogleChartService, private route: ActivatedRoute,
    private signalrService: SignalrISOdataService, private _ngZone: NgZone, private miscSvc: MiscService) {
    this.gLib = this.gChartService.getGoogle();
    this.gLib.charts.load('current', { 'packages': ['corechart', 'table', 'controls'] });
    this.gLib.charts.setOnLoadCallback(this.drawLoadChart.bind(this));
    route.params.pipe(
      takeUntil(this.destroyed)
    ).subscribe(val => {
      this.chartData = this.route.snapshot.data.LoadData;
    });
  }

  private chartData = new Array<loadTblRow>();

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
    vAxis: { title: 'MW', textStyle: { fontSize: '12' }, format: 'short' },
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
    this.chartData = this.route.snapshot.data.LoadData;

    this.signalrService.LoadmessageReceived
      .pipe(takeUntil(this.destroyed))
      .subscribe((data) => {
        this._ngZone.run(() => {
          this.updateLoadChart(data);
        });
      });
  }
  formatAxes() {
    const date_formatter = new this.gLib.visualization.DateFormat({ pattern: 'MMM dd, yyyy,  h:mm aa' });
    date_formatter.format(this.loadTable, 0);  // Where 0 is the index of the column

    const formatter = new this.gLib.visualization.NumberFormat({ suffix: ' MW', pattern: '#,###' });
    formatter.format(this.loadTable, 1); // Apply formatter to second column
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


  private drawLoadChart(options) {
    // Create the dataset (DataTable)
    this.loadTable = new this.gLib.visualization.DataTable();
    this.loadTable.addColumn('date', 'Date');
    this.loadTable.addColumn('number', 'Load Weekdays');
    this.loadTable.addColumn({ type: 'string', role: 'style' });
    this.loadTable.addColumn({ type: 'boolean', role: 'certainty' });

    for (let i = 0; i < this.chartData.length; i++) {
      let chartRow = new Array<Date | number | string | Boolean>();
      const date = new Date(this.chartData[i].timestamp);

      chartRow.push(date);
      chartRow.push(this.chartData[i].instantaneous_Load);

      const day = date.getDay();
      chartRow = this.setConditionalFormat(day, chartRow);

      this.loadTable.addRow(chartRow);
    }
    this.chartTitle = 'PJM RTO Load at 5 minute intervals. Last Reading at ' + new Date(this.chartData[this.chartData.length - 1].timestamp).toLocaleTimeString() + ' (EST)';

    let MaxDt = new Date(this.chartData[this.chartData.length - 1].timestamp);
    let MinDt = new Date(MaxDt);
    MinDt.setDate(MaxDt.getDate() - 1);

    // Create a dashboard.
    const dash_container = document.getElementById('dashboard_div');

    this.loadDashboard = new this.gLib.visualization.Dashboard(dash_container);

    // Create a date range slider
    this.loadDateSlider = new this.gLib.visualization.ControlWrapper({
      'controlType': 'ChartRangeFilter',
      'containerId': 'control_div',
      'state': { 'range': { 'start': MinDt, 'end': MaxDt } }
    });
    this.setFilterOptions();
    this.loadDateSlider.setOptions(this.controlOptions);

    this.formatAxes();

    // Line chart visualization
    this.loadLine = new this.gLib.visualization.ChartWrapper({
      'chartType': 'ComboChart',
      'containerId': 'line_div',

      'options': this.options,
    });
    this.loadLine.setOption('title', this.chartTitle);
    // Bind loadLine to the dashboard, and to the controls
    // this will make sure our line chart is updated when our date changes
    this.loadDashboard.bind(this.loadDateSlider, this.loadLine);

    this.loadDashboard.draw(this.loadTable);
  }

  private updateLoadChart(data: loadTblRow) {
    this.chartData.push(data);
    this.chartTitle = 'PJM RTO Load at 5 minute intervals. Last Reading at ' + new Date(this.chartData[this.chartData.length - 1].timestamp).toLocaleTimeString() + ' (EST)';

    let chartRow = new Array<Date | number | string | Boolean>();
    const date = new Date(data.timestamp);
    chartRow.push(date);
    chartRow.push(data.instantaneous_Load);
    const day = date.getDay();

    if (this.loadDashboard != undefined) {
      chartRow = this.setConditionalFormat(day, chartRow);
      this.loadTable.addRow(chartRow);
      this.loadLine.setOption('title', this.chartTitle);

      this.formatAxes();
      this.loadDashboard.draw(this.loadTable);
    }
  }
  onResized(event: ResizedEvent) {
    this.width = event.newWidth;
    this.height = event.newHeight;


    console.log('width', this.width);
    console.log('height', this.height);

    if (this.loadLine != undefined) {
      this.loadLine.draw();
      this.loadDateSlider.draw();
    }
  }
  ngOnDestroy(): void {
    this.destroyed.next();
    this.destroyed.complete();
  }
}

