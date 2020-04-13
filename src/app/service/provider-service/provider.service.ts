import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { catchError, retry } from 'rxjs/operators'
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { ConfigService } from '../config/config-service';
import { API_TYPE } from 'src/app/model/apiType';
import { MatDialog } from '@angular/material/dialog';
import { LoginWidgetComponent } from 'src/app/pages/ui-components/login-widget/login-widget.component';


@Injectable({
  providedIn: 'root'
})
export class ProviderService {

  constructor(private http:HttpClient,private config: ConfigService,private dialog: MatDialog) { }


  /**
   * Performs Post request
   * @param apiType
   * @param pathName
   * @param body
   */
  post(apiType:API_TYPE,pathName,body){
    // concat url
    const url = `${environment.apiEndpoint}${apiType}${pathName}`;

    // options
    const httpOptions = {
       headers:  this.config.getHeaders()
    }

    return this.http.post(url,body,httpOptions)
          .pipe(
            catchError(this.config.handleError)
          )
  }
  formDatapost(apiType:API_TYPE,body){
    // concat url
    const url = `${environment.apiEndpoint}${apiType}`;

    // options
    const httpOptions = {
       headers:  this.config.getHeaders()
    }

    return this.http.post(url,body,httpOptions)
          .pipe(
            catchError(this.config.handleError)
          )   
  }



  put(apiType:API_TYPE,pathName,body){
    // concat url
    const url = `${environment.apiEndpoint}${apiType}${pathName}`;

    // options
    const httpOptions = {
       headers:  this.config.getHeadersMultipart()
    }

    return this.http.put(url,body,httpOptions)
          .pipe(
            catchError(this.config.handleError)
          )
  }


  /**
   *
   * @param apiType
   * @param pathName
   * @param queryParam should start with [?example=value&example2=value2]
   */
  get(apiType:API_TYPE,pathName,queryParam,httpOptions:Object = {headers:  this.config.getHeaders()}) {
    // concat url
    const url = `${environment.apiEndpoint}${apiType}${pathName}${queryParam}`;

    return this.http.get(url,httpOptions).pipe(
      retry(2), // retries 2 times when request fails
      catchError(this.config.handleError)
    )
  }




  delete(apiType:API_TYPE,pathName,queryParam,httpOptions:Object = {headers:  this.config.getHeaders()}) {
    // concat url
    const url = `${environment.apiEndpoint}${apiType}${pathName}${queryParam}`;

    // options
    // const httpOptions = {
    //    headers:  this.config.getHeaders()
    // }

    return this.http.delete(url,httpOptions).pipe(
      retry(2), // retries 2 times when request fails
      catchError(this.config.handleError)
    )  
  }

  onTokenExpired(content:string,statusCode:number): void{
    let expired = content == 'Token Expired'? true : false;
        if(expired && statusCode === 403){
            // launch Modal
            let dialogRef = this.dialog.open(LoginWidgetComponent,{
              maxWidth: '500px',
              maxHeight: '300px',
              data: this
            })

            dialogRef.afterClosed().subscribe((res) => {
              location.reload()
            })
        }
  }




}
