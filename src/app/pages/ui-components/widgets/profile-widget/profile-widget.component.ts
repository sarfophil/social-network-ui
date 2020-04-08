import { Component, OnInit } from '@angular/core';
import {state,transition, trigger, style, animate} from '@angular/animations';

@Component({
  selector: 'app-profile-widget',
  templateUrl: './profile-widget.component.html',
  styleUrls: ['./profile-widget.component.css'],
  animations: [
    trigger('loadingPlaceholder',[
      state('open',style({
        display: 'show'
      })),
      state('close',style({
        display: 'none'
      })),
      transition('open => close', [
        animate('0s 1s ease-out')
      ])
    ])
  ]
})
export class ProfileWidgetComponent implements OnInit {

  /** Useful when making a request to the server */
  showPlaceholder:Boolean = true;

  constructor() { }

  ngOnInit() {
    this.loadData()
  }

  loadData(){
    setTimeout(() => this.showPlaceholder = false , 3000)
  }

}
