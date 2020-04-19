import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subject } from 'rxjs/internal/Subject';

@Component({
  selector: 'app-meter-charts',
  templateUrl: './meter-charts.component.html',
  styleUrls: ['./meter-charts.component.scss']
})
export class MeterChartsComponent implements OnInit, OnDestroy  {
  public destroyed = new Subject<any>();

  constructor() {
  }
  ngOnInit(): void {  
let i =1;
  }  

  ngOnDestroy(): void {
    this.destroyed.next();
    this.destroyed.complete();
  }
}
