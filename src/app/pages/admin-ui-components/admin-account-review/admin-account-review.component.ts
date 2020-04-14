import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-admin-account-review',
  templateUrl: './admin-account-review.component.html',
  styleUrls: ['./admin-account-review.component.css']
})
export class AdminAccountReviewComponent implements OnInit {

  constructor(private router :Router) { }

  ngOnInit() {
  }
  reviewAccount(id){
    this.router.navigate([`/profile/${id}/timeline`])
  }

  activateAccount(){
      
  }
}
