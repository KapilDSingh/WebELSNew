import { Component, OnInit, NgZone, ViewChild, OnChanges, SimpleChanges, OnDestroy } from '@angular/core';


import { Router, RouterEvent, NavigationEnd, ActivatedRoute } from '@angular/router';

import { fuelTypeData } from '../Models/IsoModels';

import { SignalrISOdataService } from '../services/signalr-ISOdata.service';

import { loadTblRow } from '../Models/IsoModels';
import { filter, takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs/internal/Subject';



@Component({
  selector: 'app-iso-charts',
  templateUrl: './iso-charts.component.html',
  styleUrls: ['./iso-charts.component.css'],
  styles: [':host > *:not(h1) { display: inline-block !important; }'],
})
export class IsoChartsComponent implements OnInit, OnDestroy {

  
  GenmixchartData: Array<Array<Date | number | string>>;
  GenmixStringToChild: string;
  Genmixtitle: string;
  canSendMessage: boolean;
  public destroyed = new Subject<any>();




  constructor(private router: Router, private route: ActivatedRoute,
    private signalrService: SignalrISOdataService,
    private _ngZone: NgZone
  ) {
    this.subscribeToEvents();
     this.GenmixchartData = new Array<Array<Date | number | string>>();

  }
  ngOnInit(): void {
    

  }

  sendfuelTypeData(n) {
    if (this.canSendMessage) {
      this.signalrService.sendfuelTypeData(n);
    }
  }

  processfuelTypeData(fuelTypeData: Array<fuelTypeData>) {
    const ChartDataPoints: Array<Array<Date | number | string>> = new Array<Array<Date | number | string>>();

    for (let i = 0; i < fuelTypeData.length; i++) {
      const genmixDate = new Date(fuelTypeData[i].timestamp);
      const dataPoint: Array<Date | number | string> = new Array<Date | number | string>();
      dataPoint.push(genmixDate, fuelTypeData[i].gas, fuelTypeData[i].nuclear, fuelTypeData[i].coal, fuelTypeData[i].hydro, fuelTypeData[i].wind, fuelTypeData[i].solar, fuelTypeData[i].multipleFuels, fuelTypeData[i].otherRenewables, fuelTypeData[i].oil, fuelTypeData[i].other, fuelTypeData[i].storage);
      ChartDataPoints.push(dataPoint);
    }
    return ChartDataPoints;
  }


  
  private PushfuelTypeDataPoints(ChartDataPoints: Array<Array<Date | number | string>>) {
    if (ChartDataPoints.length === 1) {

      this.GenmixchartData.shift();
      this.GenmixchartData.push(ChartDataPoints[0]);

    } else {
      this.GenmixchartData.length = 0;
      for (let i = 0; i < ChartDataPoints.length; i++) {

        this.GenmixchartData.push(ChartDataPoints[i]);
      }

    }
    this.GenmixStringToChild = this.GenmixStringToChild + this.GenmixchartData[this.GenmixchartData.length - 1][0].toString();
  }


  private subscribeToEvents(): void {
    this.signalrService.connectionEstablished
    .pipe(takeUntil(this.destroyed))
    .subscribe(() => {
      this.canSendMessage = true;
      this.sendfuelTypeData(8);
    });

    this.signalrService.GenmixmessageReceived.subscribe((data: Array<fuelTypeData>) => {
      this._ngZone.run(() => {
        this.GenmixStringToChild = 'Generation Mix as of ';
        const GenmixChartDataPoints = this.processfuelTypeData(data);
        this.PushfuelTypeDataPoints(GenmixChartDataPoints);
      });
    });
  }


  ngOnDestroy(): void {
    this.destroyed.next();
    this.destroyed.complete();
  }
}
