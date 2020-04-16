import { Component, OnInit, Input } from '@angular/core';
import { API_TYPE } from 'src/app/model/apiType';
import { PostType } from 'src/app/model/post-type';

@Component({
  selector: 'app-post-review',
  templateUrl: './post-review.component.html',
  styleUrls: ['./post-review.component.css']
})
export class PostReviewComponent implements OnInit {

  private postState: PostType = PostType.POST_REVIEW;
  private userId = '*';
  constructor() { }

  ngOnInit() {
  }

  accept(){
  }

}
