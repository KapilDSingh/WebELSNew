import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs';
import { LmpService } from './lmp.service';
import { lmpTblRow } from '../Models/IsoModels';

@Injectable({
  providedIn: 'root'
})
export class LmpResolverService implements Resolve<Array<lmpTblRow>> {
  LmpData: Observable<Array<lmpTblRow>>;
  constructor(private lmpSvc: LmpService) { }
  resolve(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<Array<lmpTblRow>> | Promise<Array<lmpTblRow>> | Array<lmpTblRow> {
    this.LmpData= this.lmpSvc.getLmp();
    return this.LmpData;
  }
}