import { Component, OnInit } from '@angular/core';
import {trigger,state,style,transition,animate} from '@angular/animations';

@Component({
  selector: 'app-posts',
  templateUrl: './posts.component.html',
  styleUrls: ['./posts.component.css'],
  animations: [
    trigger('loadingPlaceholder',[
      state('open',style({
          display: 'show',
          animation: 'fadeIn ease-in 0.2s'
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
export class PostsComponent implements OnInit {

  /** Useful when making a request to the server */
  showPlaceholder:Boolean = false;

  constructor() { }

  ngOnInit() {
    this.loadPosts()
  }

  loadPosts(){
    setTimeout(() => this.showPlaceholder = true,3000)
  }

}
