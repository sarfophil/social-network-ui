import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ProviderService } from 'src/app/service/provider-service/provider.service';
import { API_TYPE } from 'src/app/model/apiType';
import { HttpParams } from '@angular/common/http';
import { resolve } from 'url';
import { pipe, Observable } from 'rxjs';
import { catchError } from 'rxjs/operators';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  constructor(private router:Router,private provider:ProviderService) { }

  ngOnInit() {
    this.testApi()
  }


  login() {
    this.router.navigateByUrl('/home')
  }

  testApi(){
    let queryParam = '?user=5e8b84f61a6fc1397022ff69&page=0&limit=5'
    this.provider.get(API_TYPE.POST,'',queryParam)
      .subscribe(
        (res) => console.log(res),
        error => console.log(`${error}`)
    )
  }

}
