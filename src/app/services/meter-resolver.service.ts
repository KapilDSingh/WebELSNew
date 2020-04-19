import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs';
import { MeterService } from './meter.service';
import { MeterData } from '../Models/MeterModel';

@Injectable({
  providedIn: 'root'
})

export class MeterResolverService implements Resolve<Array<MeterData>> {

  constructor(private MeterSvc: MeterService) { }

  resolve(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<Array<MeterData>> | Promise<Array<MeterData>> | Array<MeterData> {
    return this.MeterSvc.getMeterData();

  }
}
