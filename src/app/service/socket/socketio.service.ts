import { Injectable } from '@angular/core';
import * as io from 'socket.io-client';
import { environment } from 'src/environments/environment';
import { User } from 'src/app/model/user';
import { NotificationCode } from 'src/app/model/notificationcode';
import { MatSnackBar } from '@angular/material/snack-bar';
import {  Router } from '@angular/router';
import { Howl } from 'howler';
import {NgxPubSubService} from "@pscoped/ngx-pub-sub";

export interface SocketResponse {
   reason: NotificationCode;
   follower: User
}

@Injectable({
  providedIn: 'root'
})
export class SocketioService {

  socket:io = io(environment.socketEndpoint);
  user: User;

  sound = new Howl({
    src: ['assets/sound/filling-your-inbox.mp3']
  })

  constructor(private snackbar: MatSnackBar,private router: Router,private pubSub: NgxPubSubService) { }

  initiazeSocketClient(){

  }

  demoBroadcast() {
    this.socket.on('userDemo', (data) => console.log(`Socket Broadcastted ${data}`))
  }

  onNotificationReceivedEvent(topic: String): void{
    this.socket.on(`${topic}`,(data: SocketResponse) => {
        switch(data.reason){
           case NotificationCode.FOLLOW:
              let followSnackRef = this.snackbar.open(`${data.follower.username} followed you`,'View Follower',
                    {politeness:"polite",horizontalPosition: "center",verticalPosition: "top"})


                followSnackRef.onAction().subscribe((action) => {
                  this.router.navigateByUrl(`/profile/${data.follower._id}/timeline`)
              })
           break;
           case NotificationCode.UNFOLLOW:
              let unfollowSnackRef = this.snackbar.open(`${data.follower.username} followed you`,'View Follower',
              {politeness:"polite",horizontalPosition: "center",verticalPosition: "top"})

              unfollowSnackRef.onAction().subscribe((action) => {
                  this.router.navigateByUrl(`/profile/${data.follower._id}/timeline`)
              })
           break;
           case NotificationCode.NEWPOST:
              let postSnackRef = this.snackbar.open(`New post Available`, 'View')

              postSnackRef.onAction().subscribe((action) => this.router.navigateByUrl('/home'))
           break;
           case NotificationCode.POST_VERIFIED:
            let verifiedSnackRef = this.snackbar.open(`Your post has been reviewed and post`, 'View')

            verifiedSnackRef.onAction().subscribe((action) => this.router.navigateByUrl('/home'))
           break;
           case NotificationCode.ACCOUNT_BLOCKED:
             this.router.navigateByUrl('/login')
            this.snackbar.open(`Sorry your Account has been blocked.Please contact Administrator to review your account`)
           break;

          case NotificationCode.PROFILE_PIC_UPDATE:
            this.snackbar.open(`Profile Pic Updated`);
            this.pubSub.publishEvent('PROFILE_CHANGED')
            break;
          default:
              console.log(`Emiitted`)
            break
        }
        this.sound.play()
    })

  }


  connect(): void{
    this.socket.emit('loggedIn',{data: 'Phili'})
  }

  disconnect():void{
    this.socket.disconnect(() =>{
        console.log('Disconnected')
    })
  }

}
