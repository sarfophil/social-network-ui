import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import {User} from "../../model/user";
import { PostType } from 'src/app/model/post-type';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {

  currentRoute:String = 'profile';
  user: User;
  postState: PostType = PostType.USER_POSTS

  constructor(private route:ActivatedRoute) { }

  ngOnInit() {
    this.renderPage()
    this.user = JSON.parse(localStorage.getItem("active_user"));
  }

  renderPage(){
    console.log(this.route.pathFromRoot)
  }

}
