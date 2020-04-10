import { Component, OnInit, Input } from '@angular/core';
import { PostType } from 'src/app/model/post-type';
import { ProviderService } from 'src/app/service/provider-service/provider.service';
import { API_TYPE } from 'src/app/model/apiType';
import { NgForm } from '@angular/forms'
import { Post } from '../../../../model/post';
import { error } from 'util';
// import { ViewEncapsulation } from '@angular/core';


@Component({
  selector: 'app-create-post',
  templateUrl: './create-post.component.html',
  styles: [`a{
    color: #dc4734;
}`],
  // encapsulation: ViewEncapsulation.None

})
export class CreatePostComponent implements OnInit {
  isCreated = false;
  users = [{ name: 'yome fisseha', '_id': "1234567890", checked: false }, { name: 'yome fisseha', '_id': "123456890", checked: false }];
  isShow = true;
  @Input("pageType") pageType: PostType = PostType.HOMEPAGE_POSTS

  isSearchPage: Boolean;
  errorMessage: string;

  constructor(private providerService: ProviderService) { }

  ngOnInit() {
    this.isSearchPage = this.pageType === PostType.SEARCH_POSTS;
  }

  onCreatePost(form: NgForm) {
    console.log(form);
    const value = form.value;

    const post = new Post(value.content, value.audiencecriteria, value.audienceFollowers, value.notifyFollowers);

    this.providerService.post(API_TYPE.POST, '', post).subscribe((data: Post) => {
      this.isCreated = true
      console.log(this.isCreated)
    }, error => {
      this.errorMessage = error.responseMessage;
      console.log(this.errorMessage)
    });
  }

  toggleDisplay() {
    this.isShow = !this.isShow;
  }


}

