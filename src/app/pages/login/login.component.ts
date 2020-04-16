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
  selcetedValue:string;
  signUpForm:FormGroup;
  loginForm: FormGroup;
  isLoading: Boolean = false;
  user: User = JSON.parse(localStorage.getItem("active_user"))
  constructor(private router:Router,private provider:ProviderService,
              private formBuilder:FormBuilder,private snackbar:MatSnackBar,
              private dialog: MatDialog,private activeRoute: ActivatedRoute,
              private socketService: SocketioService,private pubSub: NgxPubSubService) { }

  ngOnInit() {
    this.loginForm = this.formBuilder.group({
      username: ['',Validators.required],
      password: ['',Validators.required]
       })

    this.signUpForm=this.formBuilder.group({
      username: ['',Validators.required],
      password: ['',Validators.required],
      email:['',Validators.required],
      age:['',Validators.required],
      conformpassword:['',Validators.required]
    })




  }

  // Verifies TOken before logging in
  implicitLogin(){
    if(this.user){
      this.activeRoute.data.subscribe(
        (res) => {
          this.router.navigateByUrl('/home')
        },
        (error => {
          console.log('Error Here')
        })
      )
    }
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
  let body = this.signUpForm.value;
  this.provider.post(API_TYPE.USER,'account',body)
  console.log(body)
}

  reviewForm($event: MouseEvent) {
      $event.preventDefault();
      this.dialog.open(AccountReviewComponent,{
         maxWidth: '500px',
      })
  }
}
