import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { Router } from '@angular/router';
import { ProviderService } from 'src/app/service/provider-service/provider.service';
import { PostType } from 'src/app/model/post-type';
import { API_TYPE } from 'src/app/model/apiType';
import { User } from 'src/app/model/user';
import { error } from 'protractor';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ok } from 'assert';

@Component({
  selector: 'app-admin-account-review',
  templateUrl: './admin-account-review.component.html',
  styleUrls: ['./admin-account-review.component.css']
})
export class AdminAccountReviewComponent implements OnInit {

  private postState: PostType = PostType.ACCOUNT_REVIEW
  private accountreview = false;
  private userId = ''
  private blockedAccounts;
  private blockedAccount;

  limit = 10;
  @ViewChild('modal', { static: false }) modal: ElementRef;

  constructor(private router: Router, private service: ProviderService, private snackBar: MatSnackBar) {
    this.load();
  }

  ngOnInit() {
  }

  reviewAccount(id, blockedAccount) {
    this.blockedAccount = blockedAccount;
    this.accountreview = true;
    this.userId = id;
  }
  load() {
    this.accountreview = false
    this.service.get(API_TYPE.ADMIN, 'accounts/reviews', `?limit=${this.limit}`).subscribe(
      (blockedAccount) => {
        this.blockedAccounts = blockedAccount;
        console.log(this.blockedAccounts);
      },
      (err) => {
        console.log(err)
      },
      () => {

        console.log("complete")
      })
  }
  activateAccount(reviewId) {
    this.service.put(API_TYPE.ADMIN, `/accounts/reviews/${reviewId}`, '').subscribe((res: { error: boolean, message: string }) => {
      console.log(res.message);
      this.snackBar.open("account activated", '', {
        duration: 3000
      })
      this.load();
    }, (err) => {
      console.log(err)
    }, () => {
      console.log("complate");
    })
  }

  reject(reviewId) {
    this.service.put(API_TYPE.ADMIN, `accounts/reviews/${reviewId}/reject`, '').subscribe((res: { error: boolean, message: string }) => {
      console.log(res.message);
      this.snackBar.open("Account activation Rejected", '', {
        duration: 3000
      })
      this.load();
    }, (err) => {
      console.log(err)
    }, () => {
      console.log("Complete");
    })
  }
}
