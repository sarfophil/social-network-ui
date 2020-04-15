import { Component, OnInit } from '@angular/core';
import { PostType } from 'src/app/model/post-type';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  postState :PostType = PostType.HOMEPAGE_POSTS;

  constructor() { }

  ngOnInit() {
  }

  

}
