import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { Router } from '@angular/router';
import { ProviderService } from 'src/app/service/provider-service/provider.service';
import { PostType } from 'src/app/model/post-type';

@Component({
  selector: 'app-admin-account-review',
  templateUrl: './admin-account-review.component.html',
  styleUrls: ['./admin-account-review.component.css']
})
export class AdminAccountReviewComponent implements OnInit {

  private postState : PostType = PostType.UNHELATHY_POST
  private accountreview =false;
  private userId =''
  @ViewChild('modal',{static:false}) modal : ElementRef;

  constructor(private router :Router, private service :ProviderService) { }

  ngOnInit() {
  }

  reviewAccount(id){
  this.accountreview=true
  this.userId=id;
  }

  activateAccount(){
          
  }
}
