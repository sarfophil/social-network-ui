import { Injectable } from '@angular/core';
import * as io from 'socket.io-client';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class SocketioService {

  socket:any;

  constructor() { }

  initiazeSocketClient(){
    this.socket = io(environment.socketEndpoint)
  }
  
  demoBroadcast() {
    this.socket.on('userDemo', (data) => console.log(`Socket Broadcastted ${data}`))
  }
  

}
