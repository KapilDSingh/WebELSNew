import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { MeterData } from '../Models/MeterModel';

@Injectable({
  providedIn: 'root'
})
export class MeterService {

meterData : Observable<Array<MeterData>> ;

constructor(private http: HttpClient) { }

getMeterData(): Observable<Array<MeterData>> {
  this.meterData =  this.http.get<Array<MeterData>>('http://localhost:33383/api/MeterTbls')
    .pipe
    (
      catchError(this.handleError<MeterData[]>('getMeterData', []))
    );
    return this.meterData;
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

