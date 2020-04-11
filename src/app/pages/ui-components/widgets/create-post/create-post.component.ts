import { Component, OnInit, Input } from '@angular/core';
import { PostType } from 'src/app/model/post-type';
import { ProviderService } from 'src/app/service/provider-service/provider.service';
import { API_TYPE } from 'src/app/model/apiType';
import { NgForm, FormGroup, FormBuilder, FormControl, Validators } from '@angular/forms'
import { Post } from '../../../../model/post';
import { error } from 'util';
import { elementAt } from 'rxjs/operators';
import { ViewEncapsulation } from '@angular/core';
import { HttpClient } from '@angular/common/http';


@Component({
  selector: 'app-create-post',
  templateUrl: './create-post.component.html',
  styles: [`a{
    color: #dc4734;
}`],
  encapsulation: ViewEncapsulation.None

})
export class CreatePostComponent implements OnInit {
  isCreated = false;
  users: Array<any>;
  isShow = true;
  imageSrc: string;
  myForm: FormGroup;



  @Input("pageType") pageType: PostType = PostType.HOMEPAGE_POSTS

  isSearchPage: Boolean;
  errorMessage: string;
  uploadForm: FormGroup;



  constructor(private http: HttpClient, private formBuilder: FormBuilder, private providerService: ProviderService) {
    this.myForm = this.formBuilder.group({
      content: [''],
      avatar: [null],
      minAge: [''],
      maxAge: [''],
      notifyFollowers: ['']
    })
  }

  ngOnInit() {

    this.isSearchPage = this.pageType === PostType.SEARCH_POSTS;
    this.providerService.get(API_TYPE.USER, '/5e8bac83e37a22312b353ccc/followers', '').subscribe((Listusers: Array<any>) => {
      console.log("Listusers", Listusers)
      this.users = Listusers;

      for (var i = 0; i < this.users.length; i++) {
        console.log("rendered", this.users[i]);

        this.users[i].checked = false;
      }
    }, err => {
      this.errorMessage = err.responseMessage;
    })
  }



  

  toggleDisplay() {
    this.isShow = !this.isShow;
  }

  onFileSelect(event) {
    if (event.target.files.length > 0) {
      const file = event.target.files[0];
      this.uploadForm.get('profile').setValue(file);
    }
  }

  get f() {
    return this.myForm.controls;
  }

  onFileChange(event) {
    const reader = new FileReader();

    if (event.target.files && event.target.files.length) {
      const [file] = event.target.files;
      reader.readAsDataURL(file);

      reader.onload = () => {

        this.imageSrc = reader.result as string;

        this.myForm.patchValue({
          fileSource: reader.result
        });

      };

    }
  }

  submit() {
    let audienceFollowers = [];

    for (var i = 0; i < this.users.length; i++) {
      if (this.users[i].checked == true) {
        audienceFollowers.push({ user: this.users[i].userId._id })
      }
      else if (this.users[i].checked == false) {

      }
    }

    console.log(audienceFollowers);
  let  ageGroupTarget=  { age: { minAge: this.myForm.get('minAge').value, maxAge: this.myForm.get('maxAge').value } }
    var formData: any = new FormData();
    formData.append("content", this.myForm.get('content').value);
     formData.append("imageLink", this.myForm.get('avatar').value);
    formData.append("targetFollowers", JSON.stringify(audienceFollowers));
    formData.append('ageGroupTarget', JSON.stringify(ageGroupTarget));
     formData.append("notifyFollowers", new String(this.myForm.get('notifyFollowers').value));
console.log(this.myForm.get('avatar').value)

    this.http.post('http://localhost:3000/posts', formData).subscribe((data: Post) => {
      this.isCreated = true
      console.log(this.isCreated)
    }, error => {
      this.errorMessage = error.responseMessage;
      console.log(this.errorMessage)
    });
  }

  uploadFile(event) {
    const file = (event.target as HTMLInputElement).files[0];
    this.myForm.patchValue({
      avatar: file
    });
    this.myForm.get('imageLink').updateValueAndValidity()

    console.log(file)
  }


   
  
}

