import { Injectable } from '@angular/core';
import { HttpHeaders, HttpResponse, HttpErrorResponse } from '@angular/common/http';
import { throwError, Observable } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class ConfigService {

  constructor() {
   }



  getHeaders(){
    return new HttpHeaders({
      'Content-Type':'application/json',
      'Authorization': `Bearer ${localStorage.getItem('access_token')}`
    })
  }

  getHeadersMultipart(){
    return new HttpHeaders({
      'Authorization': `Bearer ${localStorage.getItem('access_token')}`
    })

  };






  handleError(error: HttpErrorResponse){
    if (error.error instanceof ErrorEvent) {
      // A client-side or network error occurred. Handle it accordingly.
      //console.error('An error occurred:', error.error.message);
    } else {
      // The backend returned an unsuccessful response code.
      // The response body may contain clues as to what went wrong,
      // console.error(
      //   `Backend returned code ${error.status}, ` +
      //   `body was: ${error.error}`);
      // console.log(error.error)
    }

    // return an observable with a user-facing error message
    return throwError({statusCode:error.status,responseMessage:error.error,message:'Something bad happened; please try again later.'});
  }







}
