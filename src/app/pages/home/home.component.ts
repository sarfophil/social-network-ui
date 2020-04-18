import { Component, OnInit } from '@angular/core';
import { PostType } from 'src/app/model/post-type';
import {SocketioService} from "../../service/socket/socketio.service";
import {User} from "../../model/user";
import {API_TYPE} from "../../model/apiType";
import {NotificationResponse} from "../../model/notification-response";
import {ProviderService} from "../../service/provider-service/provider.service";
import {MatSnackBar} from "@angular/material/snack-bar";
import {NotificationComponent} from "../ui-components/notification/notification.component";
import {MatDialog} from "@angular/material/dialog";
import { Howl } from 'howler';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  postState :PostType = PostType.HOMEPAGE_POSTS;
  user: User;
  sound = new Howl({
    src: ['assets/sound/filling-your-inbox.mp3']
  })
  constructor(private socketioService: SocketioService,private provider: ProviderService,private snackbar: MatSnackBar,private dialog: MatDialog) { }

  ngOnInit() {
    this.user = JSON.parse(localStorage.getItem('active_user'))
    this.socketioService.onNotificationReceivedEvent(this.user.email)
    this.checkNotification()
  }


  checkNotification(){
    let path = `check_notification`
    this.provider.get(API_TYPE.USER, path,'')
      .subscribe((res:Array<any>) => {
         if(res.length > 0){

            let snackbarRef = this.snackbar.open(`You have ${res.length} new messages`,'View Notification')
           snackbarRef.afterOpened().subscribe((res) => this.sound.play())
           snackbarRef.afterDismissed().subscribe((res) => {
              let dialogRef = this.dialog.open(NotificationComponent,{
                minWidth: '400px',
                minHeight: '30%'
              })
            })
         }
      })
  }


}
