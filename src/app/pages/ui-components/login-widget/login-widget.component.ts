import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { trigger, state, style } from '@angular/animations';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { LoginResponse } from '../../login/login.component';
import { API_TYPE } from 'src/app/model/apiType';
import { ProviderService } from 'src/app/service/provider-service/provider.service';
import { Route } from '@angular/compiler/src/core';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-login-widget',
  templateUrl: './login-widget.component.html',
  styleUrls: ['./login-widget.component.css'],
  animations: [
    trigger('loadingState',[
      state('open',style({
         display: 'block'
      })),
      state('close',style({
        display: 'none'
      }))
    ])
  ]
})
export class LoginWidgetComponent implements OnInit {
  loginForm: FormGroup;
  isLoading: Boolean = false;
  constructor(public dialogRef: MatDialogRef<LoginWidgetComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,private formBuilder: FormBuilder,private provider: ProviderService,private router: Router,private snackbar: MatSnackBar) { }

  ngOnInit() {
    this.dialogRef.disableClose = true;
    this.loginForm = this.formBuilder.group({
      username: ['',Validators.required],
      password: ['',Validators.required]
    })
  }

  login() {
    this.isLoading = true;
    let body = this.loginForm.value;
    this.provider.post(API_TYPE.USER,'login',body)
    .subscribe({      
      next:(res:LoginResponse)=> {     
        res.user.password = '';
        localStorage.setItem('access_token',res.access_token)
        localStorage.setItem('active_user',JSON.stringify(res.user))
        this.dialogRef.close()
      },
      error:(err) => {
        this.isLoading = false
        if(err.statusCode == 403) this.snackbar.open(`Invalid Username / Password`,'Ok')
        else this.snackbar.open(`${err.message}`)
      },
      complete: () => this.isLoading = false
    })
    
  }

}
