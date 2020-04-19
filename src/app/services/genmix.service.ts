import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { fuelTypeData } from '../Models/IsoModels';

@Injectable({
  providedIn: 'root'
})
export class GenmixService {


constructor(private http: HttpClient) { }

getGenmix(): Observable<Array<fuelTypeData>> {
  return this.http.get<Array<fuelTypeData>>('http://localhost:33383/api/fuelTypeDatas')
    .pipe
    (
      catchError(this.handleError<fuelTypeData[]>('getGenmix', []))
    );
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
