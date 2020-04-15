import { Component, OnInit } from '@angular/core';
import { PostType } from 'src/app/model/post-type';
import {SocketioService} from "../../service/socket/socketio.service";
import {User} from "../../model/user";

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  postState :PostType = PostType.HOMEPAGE_POSTS;
  user: User;
  constructor(private socketioService: SocketioService) { }

  ngOnInit() {
    this.user = JSON.parse(localStorage.getItem('active_user'))
    this.socketioService.onNotificationReceivedEvent(this.user.email)
  }



}
