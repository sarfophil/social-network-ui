import { Component, OnInit } from '@angular/core';
import { SocketioService } from './service/socket/socketio.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit{
  title = 'social-network';
  constructor(private socketioService:SocketioService){}


  ngOnInit(): void {
    this.socketioService.initiazeSocketClient()
    this.socketioService.demoBroadcast()
  }

}
