import {Component, OnInit} from '@angular/core';
import {ProviderService} from "../../../service/provider-service/provider.service";
import {API_TYPE} from "../../../model/apiType";
import {NotificationResponse} from "../../../model/notification-response";

@Component({
  selector: 'app-notification',
  templateUrl: './notification.component.html',
  styleUrls: ['./notification.component.css']
})
export class NotificationComponent implements OnInit {

  private readonly limit: number = 10;
  private skip: number = 0
  notificationList: Array<NotificationResponse> = []
  isLoading: boolean = true;
  constructor(private provider: ProviderService) { }

  ngOnInit() {
        this.loadNotification()
  }

  loadNotification(){
    let path = `notification`
    let queryParam = `?limit=${this.limit}&skip=${this.skip}`
    this.provider.get(API_TYPE.USER, path,queryParam)
      .subscribe((res: Array<NotificationResponse>) => {
          this.notificationList = this.notificationList.concat(res)
          this.isLoading = false
      })
  }

  loadmore($event: MouseEvent) {
    $event.preventDefault()
    this.skip += this.limit;
    this.isLoading = true
    this.loadNotification()
  }
}
