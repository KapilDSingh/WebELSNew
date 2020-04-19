import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs';
import { GenmixService } from './Genmix.service';
import { fuelTypeData } from '../Models/IsoModels';


@Injectable({
  providedIn: 'root'
})

  export class GenmixResolverService implements Resolve<Array<fuelTypeData>> {
    GenmixData: Observable<Array<fuelTypeData>>;
    constructor(private GenmixSvc: GenmixService) { }
    resolve(
      route: ActivatedRouteSnapshot,
      state: RouterStateSnapshot
    ): Observable<Array<fuelTypeData>> | Promise<Array<fuelTypeData>> | Array<fuelTypeData> {
      return this.GenmixSvc.getGenmix();
  
    }
  }