import { Component, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ProviderService } from 'src/app/service/provider-service/provider.service';
import { API_TYPE } from 'src/app/model/apiType';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { User } from 'src/app/model/user';

@Component({
  selector: 'app-admin-login',
  templateUrl: './admin-login.component.html',
  styleUrls: ['./admin-login.component.css'],
encapsulation:ViewEncapsulation.None
})
export class AdminLoginComponent implements OnInit {

  @ViewChild('f',{static:false}) signInForm :NgForm;
  constructor(private service: ProviderService, private snackbar:MatSnackBar, private router : Router ) { }

  ngOnInit() {
  }

  onSubmit(){
    this.service.post(API_TYPE.ADMIN,'login',this.signInForm.value).subscribe((res:{access_token:string})=>{
      localStorage.setItem("access_token",res.access_token)
      localStorage.setItem("isAdmin",'true');

      function user(user:User){
        return user;
      }

      let userr  = user({
        "_id": "String",
        "username": "String",
        "email": "String",
        "role": "String",
        "followers": [],
        "following": [],
        "totalVoilation": 0,
        "location": [],
        "age": 100,
        "isActive": true,
        "password": "String",
        "profilePicture": "String",
      });
      localStorage.setItem("active_user",JSON.stringify(userr));


      this.snackbar.open("looged insuccessfully","ok",{
        duration: 2000
      });
      this.router.navigate(['admin','dashboard'])

    },(err)=>{
      this.snackbar.open("unable to login",'',{
        duration: 2000
      });
    },()=>{
      console.log("complete")
    })
  }
}
