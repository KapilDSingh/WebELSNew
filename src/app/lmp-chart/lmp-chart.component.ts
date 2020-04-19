import { Component, OnInit, NgZone } from '@angular/core';
import { Subject } from 'rxjs';
import { MinMaxDate } from '../Models/MiscModels';
import { GoogleChartService } from '../services/google-chart.service';
import { ActivatedRoute } from '@angular/router';
import { SignalrISOdataService } from '../services/signalr-ISOdata.service';
import { MiscService } from '../services/misc.service';
import { takeUntil } from 'rxjs/operators';
import { lmpTblRow } from '../Models/IsoModels';
import { ResizedEvent } from 'angular-resize-event';

@Component({
  selector: 'app-lmp-chart',
  templateUrl: './lmp-chart.component.html',
  styleUrls: ['./lmp-chart.component.css']
})
export class LmpChartComponent implements OnInit {

  private destroyed = new Subject<any>();
  private gLib: any;
  private minMaxDate: MinMaxDate;
  private LmpTable: any;
  private LmpDashboard: any;
  private chartTitle: string;
  private LmpLine: any;
  private LmpDateSlider: any;
  private width: number;
  private height: number;
  private controlOptions: any;
  private chartData = new Array<lmpTblRow>();

  constructor(private gChartService: GoogleChartService, private route: ActivatedRoute,
    private signalrService: SignalrISOdataService, private _ngZone: NgZone, private miscSvc: MiscService) {
    this.gLib = this.gChartService.getGoogle();
    this.gLib.charts.load('current', { 'packages': ['corechart', 'table', 'controls'] });
    this.gLib.charts.setOnLoadCallback(this.drawLmpChart.bind(this));
    route.params.pipe(
      takeUntil(this.destroyed)
    ).subscribe(val => {
      this.chartData = this.route.snapshot.data.LmpData;
    });
  }
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
    vAxis: { title: '$/MwH', textStyle: { fontSize: '12' }, format: 'currency' },
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
    }
  }

  ngOnInit() {
    this.chartData = this.route.snapshot.data.LmpData;

    this.signalrService.LMPmessageReceived
      .pipe(takeUntil(this.destroyed))
      .subscribe((data) => {
        this._ngZone.run(() => {
          this.updateLmpChart(data);
        });
      });
  }
  formatAxes() {
    const date_formatter = new this.gLib.visualization.DateFormat({ pattern: 'MMM dd, yyyy,  h:mm aa' });
    date_formatter.format(this.LmpTable, 0);  // Where 0 is the index of the column

    const formatter = new this.gLib.visualization.NumberFormat({ suffix: ' $/MWH', pattern: '#,###' });
    formatter.format(this.LmpTable, 1); // Apply formatter to second column
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


  private drawLmpChart(options) {
    // Create the dataset (DataTable)
    this.LmpTable = new this.gLib.visualization.DataTable();
    this.LmpTable.addColumn('date', 'Date');
    this.LmpTable.addColumn('number', 'LMP');
    this.LmpTable.addColumn({ type: 'string', role: 'style' });
    this.LmpTable.addColumn({ type: 'boolean', role: 'certainty' });

    for (let i = 0; i < this.chartData.length; i++) {
      let chartRow = new Array<Date | number | string | Boolean>();
      const date = new Date(this.chartData[i].timestamp);

      chartRow.push(date);
      if (this.chartData[i].fiveMinuteAvgLMP > 100)
        this.chartData[i].fiveMinuteAvgLMP = 100;
      chartRow.push(this.chartData[i].fiveMinuteAvgLMP);

      const day = date.getDay();
      chartRow = this.setConditionalFormat(day, chartRow);

      this.LmpTable.addRow(chartRow);
    }
    this.chartTitle = 'PSEG Zone LMP at 5 minute intervals. Last Reading at ' + new Date(this.chartData[this.chartData.length - 1].timestamp).toLocaleTimeString() + ' (EST)';

    let MaxDt = new Date(this.chartData[this.chartData.length - 1].timestamp);
    let MinDt = new Date(MaxDt);
    MinDt.setDate(MaxDt.getDate() - 1);

    this.minMaxDate = this.miscSvc.GetMinMaxdate(this.chartData);
    // Create a dashboard.
    const dash_container = document.getElementById('LMPdashboard_div');

    this.LmpDashboard = new this.gLib.visualization.Dashboard(dash_container);

    // Create a date range slider
    this.LmpDateSlider = new this.gLib.visualization.ControlWrapper({
      'controlType': 'ChartRangeFilter',
      'containerId': 'LMPcontrol_div',
      'state': { 'range': { 'start': MinDt, 'end': MaxDt } }
    });
    this.setFilterOptions();
    this.LmpDateSlider.setOptions(this.controlOptions);

    this.formatAxes();

    // Line chart visualization
    this.LmpLine = new this.gLib.visualization.ChartWrapper({
      'chartType': 'ComboChart',
      'containerId': 'LMPline_div',

      'options': this.options,
    });
    this.LmpLine.setOption('title', this.chartTitle);
    // Bind LmpLine to the dashboard, and to the controls
    // this will make sure our line chart is updated when our date changes
    this.LmpDashboard.bind(this.LmpDateSlider, this.LmpLine);

    this.LmpDashboard.draw(this.LmpTable);
  }

  private updateLmpChart(data: lmpTblRow) {
    this.chartData.push(data);
    this.chartTitle = 'PSEG Zone LMP at 5 minute intervals. Last Reading at ' + new Date(this.chartData[this.chartData.length - 1].timestamp).toLocaleTimeString() + ' (EST)';

    let chartRow = new Array<Date | number | string | Boolean>();
    const date = new Date(data.timestamp);
    chartRow.push(date);
    chartRow.push(data.fiveMinuteAvgLMP);
    const day = date.getDay();

    if (this.LmpDashboard != undefined) {
      chartRow = this.setConditionalFormat(day, chartRow);
      this.LmpTable.addRow(chartRow);
      this.LmpLine.setOption('title', this.chartTitle);

      this.formatAxes();
      this.LmpDashboard.draw(this.LmpTable);
    }
  }
  onResized(event: ResizedEvent) {
    this.width = event.newWidth;
    this.height = event.newHeight;


    console.log('width', this.width);
    console.log('height', this.height);

    if (this.LmpLine != undefined) {
      this.LmpLine.draw();
      this.LmpDateSlider.draw();
    }

  }
  ngOnDestroy(): void {
    this.destroyed.next();
    this.destroyed.complete();
  }
}

