import {Component, OnInit} from '@angular/core';
import {PostType} from "../../../model/post-type";
import {ActivatedRoute, Routes} from "@angular/router";
import {User} from "../../../model/user";

@Component({
  selector: 'app-timeline',
  templateUrl: './timeline.component.html',
  styleUrls: ['./timeline.component.css']
})
export class TimelineComponent implements OnInit {
  postState: PostType = PostType.USER_POSTS;
  user: User;
  username: String;
  constructor(private route: ActivatedRoute) { }

  ngOnInit() {
    this.route.parent.data.subscribe((obj) =>{
      this.user = obj.user;
      this.username = this.user.username;
    })
  }

}
