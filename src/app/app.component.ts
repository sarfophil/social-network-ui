import { Component, OnInit } from '@angular/core';
import { SocketioService } from './service/socket/socketio.service';
import { ViewportScroller } from '@angular/common';
import {User} from "./model/user";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit{
  title = 'social-network';
  user: User = JSON.parse(localStorage.getItem("active_user"))
  constructor(private socketioService:SocketioService,private viewportScroller: ViewportScroller){}


  ngOnInit(): void {
   if(this.user){
     this.socketioService.initiazeSocketClient()
     this.socketioService.onNotificationReceivedEvent()
   }
  }

  scrollUp(){
   this.viewportScroller.scrollToPosition([0,0])
  }

}
