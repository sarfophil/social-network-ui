import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {ProviderService} from 'src/app/service/provider-service/provider.service';
import {API_TYPE} from 'src/app/model/apiType';
import {FormBuilder, FormGroup, Validators} from '@angular/forms'
import {state, style, trigger} from '@angular/animations';

import {MatSnackBar} from '@angular/material/snack-bar';
import {User} from 'src/app/model/user';

import {MatDialog} from "@angular/material/dialog";
import {AccountReviewComponent} from "../account-review/account-review.component";
import {SocketioService, USER_STATUS} from "../../service/socket/socketio.service";
import {NgxPubSubService} from "@pscoped/ngx-pub-sub";
import { Newuser } from 'src/app/model/newuser';



export interface LoginResponse{
   access_token: string;
   user: User
}


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
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
export class LoginComponent implements OnInit {
  signUpForm:FormGroup;
  loginForm: FormGroup;
  isLoading: Boolean = false;
  isCreatingAccount: Boolean = false
  constructor(private router:Router,private provider:ProviderService,
              private formBuilder:FormBuilder,private snackbar:MatSnackBar,
              private dialog: MatDialog,private activeRoute: ActivatedRoute,
              private socketService: SocketioService,private pubSub: NgxPubSubService,private snackBar: MatSnackBar) { }

  ngOnInit() {
    this.loginForm = this.formBuilder.group({
      username: ['',Validators.required],
      password: ['',Validators.required]
       })

    this.signUpForm=this.formBuilder.group({
      username: ['',Validators.required],
      password: ['',Validators.required],
      email:['',Validators.email],
      age:['',Validators.required]
    })
  }



  login() {

    this.isLoading = true;
    let body = this.loginForm.value;
    let response: LoginResponse;
    this.provider.post(API_TYPE.USER,'login',body)
    .subscribe({
      next:(res:LoginResponse)=> {
        res.user.password = '';
        localStorage.setItem('access_token',res.access_token)
        localStorage.setItem('active_user',JSON.stringify(res.user))
        response = res
      },
      error:(err) => {
        this.isLoading = false
        if(err.statusCode == 403) this.snackbar.open(`Invalid Username / Password`,'Ok')
        else this.snackbar.open(`${err.message}`)
      },
      complete:() => {
        this.router.navigate(['/home'])
          .then((res) => {
            console.log(`Navigation: ${res}`)
            if(!res) {
              this.snackbar.open('Oops! Your account has been deactivated', 'Ok', {
                horizontalPosition: "center",
                politeness: "assertive",
              })
              localStorage.clear()
            }else{
              console.log('Has Login Event')
              this.socketService.connect(response.user._id,USER_STATUS.ONLINE)
            }
          })
          .catch(err => console.log(err))
        this.isLoading = false
      }
    })

  }


  hasLoggedInSuccessFullyEvent(){
    this.pubSub.subscribe('HAS_LOGIN',(user) => {
      this.socketService.connect(user._id,USER_STATUS.ONLINE)
    })
  }


signUp(){
  if(this.signUpForm.valid){
    this.isCreatingAccount = true
    this.provider.post(API_TYPE.USER,'account',this.signUpForm.value).subscribe(
      (res: Array<any>) => {
        this.isCreatingAccount = false
      },
      (error) => {
        this.isCreatingAccount = false;
        this.snackbar.open(error.responseMessage,'ok',{duration: 1000})

      },
      () => {
        console.log(`Complete {}`)
        let snackRef = this.snackbar.open(`Account Created. Signing in ...`,'Login now')
        snackRef.afterDismissed().subscribe((res) => {

          this.loginForm.setValue({username: this.signUpForm.get('username').value,password: this.signUpForm.get('password').value})
          this.login();
        })

      }
    )
  }else {
    this.snackbar.open('All inputs are required','Ok',{ duration: 5000 })
  }
}

  reviewForm($event: MouseEvent) {
      $event.preventDefault();
      this.dialog.open(AccountReviewComponent,{
         maxWidth: '500px',
      })
  }
}
