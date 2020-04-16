import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {User} from "../../model/user";

import { ProviderService } from "../../service/provider-service/provider.service";
import { API_TYPE } from "../../model/apiType";
import { map } from "rxjs/operators";
import { UserResolverService } from "../../service/user-resolver/user-resolver.service";
import { NgxPubSubService } from "@pscoped/ngx-pub-sub";


@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css'],
  providers: [UserResolverService]
})
export class ProfileComponent implements OnInit {
  currentRoute: String = 'profile';
  user: User;
  followers: number = 0;
  following: number = 0;
  constructor(private route: ActivatedRoute, private provider: ProviderService,
    private router: Router, private pubSub: NgxPubSubService) { }


  ngOnInit() {
    this.route.data.subscribe((res: any) => {
      this.user = res.user
      this.followers = this.user.followers.length;
      this.following = this.user.following.length;
      this.subscribeUserFollowedEvent()
      this.subscribeUserUnFollowedEvent()
    })

  }

  subscribeUserFollowedEvent() {
    this.pubSub.subscribe('FOLLOWED_USER_EVENT', (res) => {
      this.following += 1
    })
  }

  subscribeUserUnFollowedEvent() {
    this.pubSub.subscribe('UNFOLLOWED_USER_EVENT', (res) => {
      this.following -= 1
    })
  }



}
