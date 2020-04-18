import {Component, OnInit} from '@angular/core';
import {state, style, trigger} from "@angular/animations";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {ProviderService} from "../../service/provider-service/provider.service";
import {API_TYPE} from "../../model/apiType";
import {MatSnackBar} from "@angular/material/snack-bar";
import {MatDialogRef} from "@angular/material/dialog";

@Component({
  selector: 'app-account-review',
  templateUrl: './account-review.component.html',
  styleUrls: ['./account-review.component.css'],
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
export class AccountReviewComponent implements OnInit {
  reviewForm: FormGroup;
  isLoading: boolean = false;

  constructor(private fb: FormBuilder,public dialogRef: MatDialogRef<AccountReviewComponent>,
              private provider: ProviderService,private snackbar: MatSnackBar) { }

  ngOnInit() {
      this.reviewForm = this.fb.group(
        {
           email: ['',Validators.required]
        }
      )
  }

  submit() {
      let path = `report`;
      let body = this.reviewForm.value;
      this.isLoading = true
      this.provider.post(API_TYPE.USER,path,body)
        .subscribe(
          (res) => {
              this.isLoading = false;
              this.snackbar.open('Request sent! You will recieve an email','Ok');
              this.dialogRef.close()
          },
          (error => {
            this.isLoading = false;
            this.snackbar.open('Sorry,Your Account has not been blocked','Ok')
          })
        )
  }
}
