import { Component, OnInit } from '@angular/core';
import { PostType } from 'src/app/model/post-type';
import {SocketioService} from "../../service/socket/socketio.service";
import {User} from "../../model/user";
import {API_TYPE} from "../../model/apiType";
import {NotificationResponse} from "../../model/notification-response";
import {ProviderService} from "../../service/provider-service/provider.service";

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  postState :PostType = PostType.HOMEPAGE_POSTS;
  user: User;
  constructor(private socketioService: SocketioService,private provider: ProviderService) { }

  ngOnInit() {
    this.user = JSON.parse(localStorage.getItem('active_user'))
    this.socketioService.onNotificationReceivedEvent(this.user.email)
    this.checkNotification()
  }


  checkNotification(){
    let path = `check_notification`
    this.provider.get(API_TYPE.USER, path,'')
      .subscribe((res) => {})
  }


}
