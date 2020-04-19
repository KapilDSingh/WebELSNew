import { Component, OnInit, ViewChild, Input, OnChanges, SimpleChanges, NgZone } from '@angular/core';
import { GoogleChartService } from '../services/google-chart.service';
import { Router, ActivatedRoute, RouterEvent, NavigationEnd } from '@angular/router';
import { fuelTypeData } from '../Models/IsoModels';
import { DatePipe } from '@angular/common';
import { MinMaxDate } from '../Models/MiscModels';
import { GenmixService } from '../services/Genmix.service';
import { SignalrISOdataService } from '../services/signalr-ISOdata.service';
import { MiscService } from '../services/misc.service';
import { NONE_TYPE } from '@angular/compiler/src/output/output_ast';
import { ResizedEvent } from 'angular-resize-event';
import { filter, takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';

@Component({
  selector: 'app-gen-mix',
  templateUrl: './gen-mix.component.html',
  styleUrls: ['./gen-mix.component.scss']
})
export class GenMixComponent implements OnInit {

  constructor(private gChartService: GoogleChartService, private route: ActivatedRoute,
    private signalrService: SignalrISOdataService, private _ngZone: NgZone, private miscSvc: MiscService) {
    this.gLib = this.gChartService.getGoogle();
    this.gLib.charts.load('current', { 'packages': ['corechart', 'table', 'controls'] });
    this.gLib.charts.setOnLoadCallback(this.drawGenMixChart.bind(this));
    route.params.pipe(
      takeUntil(this.destroyed)
    ).subscribe(val => {
      this.chartData = this.route.snapshot.data.GenmixData;
    });
  }
  ngOnInit() {

    this.signalrService.GenmixmessageReceived
      .pipe(takeUntil(this.destroyed))
      .subscribe((data) => {
        this._ngZone.run(() => {
          this.updateGenmixChart(data[0]);
        });
      });
  }
  
  public destroyed = new Subject<any>();
  private gLib: any;
  private minMaxDate: MinMaxDate;
  private GenmixTable: any;
  private GenmixDashboard: any;
  private chartTitle: string;
  private GenmixLine: any;
  private GenmixDateSlider: any;
  private width: number;
  private height: number;
  private controlOptions: any;

  private chartData = new Array<fuelTypeData>();

  private options = {
    enableInteractivity: true,
    series: {
      0: {
        seriesType: 'line',

      }
    },
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
        'chartType': 'lineChart',
        'opacity': '0',
        
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

      //     'state': { 'range': { 'start': this.minMaxDate.MinDate, 'end': this.minMaxDate.MaxDate } }
    }
  }

  formatAxes() {
    const date_formatter = new this.gLib.visualization.DateFormat({ pattern: 'MMM dd, yyyy,  h:mm aa' });
    date_formatter.format(this.GenmixTable, 0);  // Where 0 is the index of the column

    const formatter = new this.gLib.visualization.NumberFormat({ suffix: ' MW', pattern: '#,###' });
    formatter.format(this.GenmixTable, 1); // Apply formatter to second column
  }


  setConditionalFormat(day: number, chartRow: Array<Date | number | string | Boolean>): Array<Date | number | string | Boolean> {
    if (day > 0 && day < 6) {
      chartRow.push('color: black;');
      chartRow.push(true);
    } else {
      chartRow.push('color: blue;');
      chartRow.push(false);
    }
    return chartRow;
  }
  

  private drawGenMixChart(options) {
    // Create the dataset (DataTable)
    this.GenmixTable = new this.gLib.visualization.DataTable();
    this.GenmixTable.addColumn('date', 'Date');
    this.GenmixTable.addColumn('number', 'Gas');
    this.GenmixTable.addColumn('number', 'Nuclear');
    this.GenmixTable.addColumn('number', 'Coal');
    this.GenmixTable.addColumn('number', 'Wind');
    this.GenmixTable.addColumn('number', 'Hydro');
    this.GenmixTable.addColumn('number', 'Solar');
    this.GenmixTable.addColumn('number', 'Other');
    
    this.GenmixTable.addColumn({ type: 'string', role: 'style' });
    this.GenmixTable.addColumn({ type: 'boolean', role: 'certainty' });

    for (let i = 0; i < this.chartData.length; i++) {
      let chartRow = new Array<Date | number | string | Boolean>();
      const date = new Date(this.chartData[i].timestamp);
      
      chartRow.push(date);
      chartRow.push(this.chartData[i].gas);
      chartRow.push(this.chartData[i].nuclear);
      chartRow.push(this.chartData[i].coal);
      chartRow.push(this.chartData[i].wind);
      chartRow.push(this.chartData[i].hydro);
      chartRow.push(this.chartData[i].solar);
      let OtherFuels = this.chartData[i].oil + this.chartData[i].multipleFuels + this.chartData[i].otherRenewables +
                   this.chartData[i].storage +  this.chartData[i].other;
      chartRow.push(OtherFuels);

      const day = date.getDay();
      chartRow = this.setConditionalFormat(day, chartRow);

      this.GenmixTable.addRow(chartRow);
    }
    this.chartTitle = 'Hourly Generation Mix as of ' + new Date(this.chartData[this.chartData.length - 1].timestamp).toLocaleTimeString() + ' (EST)';

    this.minMaxDate = this.miscSvc.GetMinMaxdate(this.chartData);
    // Create a dashboard.
    const dash_container = document.getElementById('GENMIXdashboard_div');

    this.GenmixDashboard = new this.gLib.visualization.Dashboard(dash_container);

    // Create a date range slider
    this.GenmixDateSlider = new this.gLib.visualization.ControlWrapper({
      'controlType': 'ChartRangeFilter',
      'containerId': 'GENMIXcontrol_div',
    });
    this.setFilterOptions();
    this.GenmixDateSlider.setOptions(this.controlOptions);

    this.formatAxes();

    // Line chart visualization
    this.GenmixLine = new this.gLib.visualization.ChartWrapper({
      'chartType': 'AreaChart',
      'containerId': 'GENMIXline_div',
        curveType: 'function',
      'options': this.options,
    });
    this.GenmixLine.setOption('title', this.chartTitle);
    // Bind GenmixLine to the dashboard, and to the controls
    // this will make sure our line chart is updated when our date changes
    this.GenmixDashboard.bind(this.GenmixDateSlider, this.GenmixLine);

    this.GenmixDashboard.draw(this.GenmixTable);
  }

  private updateGenmixChart(data: fuelTypeData) {
    this.chartData.push(data);
    this.chartTitle = 'Hourly Genmix Data as of ' + new Date(data.timestamp).toLocaleTimeString('en-US') + ' (EST)';

    let chartRow = new Array<Date | number | string | Boolean>();
    const date = new Date(data.timestamp);
    chartRow.push(date);
    const day = date.getDay();

    if (this.GenmixDashboard != undefined) {
      chartRow = this.setConditionalFormat(day, chartRow);
      this.GenmixTable.addRow(chartRow);
      this.GenmixLine.setOption('title', this.chartTitle);

      this.formatAxes();
      this.GenmixDashboard.draw(this.GenmixTable);
    }
  }
  onResized(event: ResizedEvent) {
    this.width = event.newWidth;
    this.height = event.newHeight;


    console.log('width', this.width);
    console.log('height', this.height);

    if (this.GenmixLine != undefined) {
      this.GenmixLine.draw();
      this.GenmixDateSlider.draw();
    }

  }
  ngOnDestroy(): void {
    this.destroyed.next();
    this.destroyed.complete();
  }
}

