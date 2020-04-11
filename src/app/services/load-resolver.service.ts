import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs';
import { LoadService } from './load.service';
import { loadTblRow } from '../Models/IsoModels';

@Injectable({
  providedIn: 'root'
})
export class LoadResolverService implements Resolve<Array<loadTblRow>> {
  loadData: Observable<Array<loadTblRow>>;
  constructor(private LoadSvc: LoadService) { }
  resolve(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<Array<loadTblRow>> | Promise<Array<loadTblRow>> | Array<loadTblRow> {
    return this.LoadSvc.getLoad();

  }
}
