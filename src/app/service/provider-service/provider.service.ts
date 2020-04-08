import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { catchError, retry } from 'rxjs/operators'
import { HttpClient } from '@angular/common/http';
import { ConfigService } from '../config/config-service';
import { API_TYPE } from 'src/app/model/apiType';


@Injectable({
  providedIn: 'root'
})
export class ProviderService {

  constructor(private http:HttpClient,private config: ConfigService) { }


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


  put(apiType:API_TYPE,pathName,body){
    // concat url
    const url = `${environment.apiEndpoint}${apiType}${pathName}`;

    // options
    const httpOptions = {
       headers:  this.config.getHeaders()
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
  get(apiType:API_TYPE,pathName,queryParam) {
    // concat url
    const url = `${environment.apiEndpoint}${apiType}${pathName}${queryParam}`;

    // options
    const httpOptions = {
       headers:  this.config.getHeaders()
    }

    return this.http.get(url,httpOptions).pipe(
      retry(2), // retries 2 times when request fails
      catchError(this.config.handleError)
    )  
  }


}
