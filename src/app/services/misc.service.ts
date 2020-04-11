import { Injectable } from '@angular/core';
import { MinMaxDate } from '../Models/MiscModels';

@Injectable({
  providedIn: 'root'
})
export class MiscService {

  constructor() { }
  public GetMinMaxdate(chartData: Array<any>) {
    const minmaxDate: MinMaxDate = new MinMaxDate();

    minmaxDate.MinDate = new Date(chartData[0][0]);
    minmaxDate.MaxDate = new Date(chartData[chartData.length - 1][0]);
    return minmaxDate;
  }
}
