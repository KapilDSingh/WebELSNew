import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError} from 'rxjs/operators';
import { lmpTblRow } from '../Models/IsoModels';

@Injectable({
  providedIn: 'root'
})
export class LmpService {
LMPD:Observable<Array<lmpTblRow>> ;
  constructor(private http: HttpClient) { }
  getLmp(): Observable<Array<lmpTblRow>> {
    this.LMPD =  this.http.get<Array<lmpTblRow>>('http://localhost:33383/api/lmpTbls')
      .pipe
      (
        catchError(this.handleError<lmpTblRow[]>('getLmp', []))
      );
      return this.LMPD;
  }

  /**
 * Handle Http operation that failed.
 * Let the app continue.
 * @param operation - name of the operation that failed
 * @param result - optional value to return as the observable result
 */
  private handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {

      // TODO: send the error to remote logging infrastructure
      console.error(error); // log to console instead

      // TODO: better job of transforming error for user consumption
      console.error(`${operation} failed: ${error.message}`);

      // Let the app keep running by returning an empty result.
      return of(result as T);
    };
  }
}
