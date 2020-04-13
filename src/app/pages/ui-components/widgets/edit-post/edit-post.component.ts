import { Component, OnInit, Input, Output, EventEmitter, ViewChild } from '@angular/core';
import { PostType } from 'src/app/model/post-type';
import { ProviderService } from 'src/app/service/provider-service/provider.service';
import { API_TYPE } from 'src/app/model/apiType';
import { NgForm, FormGroup, FormBuilder, FormControl, Validators } from '@angular/forms'
import { Post } from '../../../../model/post';
import { error } from 'util';
import { elementAt } from 'rxjs/operators';
import { ViewEncapsulation } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ConfigService } from 'src/app/service/config/config-service';

@Component({
  selector: 'app-edit-post',
  templateUrl: './edit-post.component.html',
  styleUrls: ['./edit-post.component.css']
})
export class EditPostComponent implements OnInit {
  private editForm: FormGroup;
  private isShow = true;
  private post;
  private users = [];
  private userId = JSON.parse(localStorage.getItem('active_user'))._id;
  private imageName;
  private imageUrl;
  private deleteImage = false;
  @Input() _postId: { pid: null };
  @Output() closeModalEvent = new EventEmitter<boolean>();
  @ViewChild('closebutton',{static: false}) closebutton;

  constructor(private config: ConfigService, private snackBar: MatSnackBar, private http: HttpClient, private formBuilder: FormBuilder, private providerService: ProviderService) {
    this.editForm = this.formBuilder.group({
      content: [''],
      avatar: [null],
      minAge: [''],
      maxAge: [''],
      notifyFollowers: [''],
      deleteImg:['']
    })
  }
  ngOnInit() {

  }


  get postId(): any {
    return this._postId;
  }

  @Input()
  set postId(val: any) {
    console.log(val);
    this._postId = val;
    this.onChanges();
    this.imageUrl=null;
    
    this.editForm.get('avatar').setValue(null);
  }



  async onChanges() {



    if (this._postId != null) {
      await this.providerService.get(API_TYPE.POST, this.postId.pid, '').subscribe(
        (res: any) => {
          this.post = res;
          console.log("res", res)
        },
        (error) => {
          console.log("error", error);
        },
        () => {

          this.populateData();
        }

      )
      console.log("Post", this.post);
    }
  }


  async populateData() {
    console.log(`Complete {}`)
    this.editForm.setValue({
      content: this.post.content,
      avatar: null,
      minAge: this.post.audienceCriteria.age.min,
      maxAge: this.post.audienceCriteria.age.max,
      notifyFollowers: this.post.notifyFollowers,
      deleteImg:false
    });

    this.imageName = this.post.imageLink?this.post.imageLink[0]:null;
    let audienceFollowers = this.post.audienceFollowers;
    console.log("audience followers", audienceFollowers);

    await this.providerService.get(API_TYPE.USER, '/followers', '').subscribe((Listusers: Array<any>) => {
      this.users = Listusers;
      for (var i = 0; i < this.users.length; i++) {
        let flag = false;
        for (let j = 0; j < audienceFollowers.length; j++) {
          if (audienceFollowers[j].user == this.users[i].userId._id) {
            flag = true
            this.users[i].checked = true;
            console.log("and users", this.users);
          }
          return;
        }
        if (!flag) {
          this.users[i].checked = false;
        }
      }
    });



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
    let ageGroupTarget = { age: { min: this.editForm.get('minAge').value, max: this.editForm.get('maxAge').value } }
    var formData: any = new FormData();
    formData.append("content", this.editForm.get('content').value);
    formData.append("imageLink", this.editForm.get('avatar').value);
    formData.append("targetFollowers", JSON.stringify(audienceFollowers));
    formData.append('ageGroupTarget', JSON.stringify(ageGroupTarget)?JSON.stringify(ageGroupTarget):'');
    formData.append("notifyFollowers", new String(this.editForm.get('notifyFollowers').value)!=""?this.editForm.get('notifyFollowers').value:'false');
   formData.append("deleteImg",this.deleteImage);
    console.log(this.editForm.get('avatar').value)

    const httpOptions = {
      headers: this.config.getHeadersMultipart()
    }

    this.http.put('http://localhost:3000/posts/' + this.postId.pid, formData, httpOptions).subscribe((data: Post) => {
      this.snackBar.open('post edited successfully', 'Ok')
      this.loadNewData();
    }, error => {
      this.snackBar.open(error.errorMessage, 'Ok')
    });

    this.editForm.reset()
    this.deleteImage=false;
    this.closebutton.nativeElement.click();
    this.snackBar.dismiss();
  }

  uploadFile(event) {
    const file = (event.target as HTMLInputElement).files[0];
    this.editForm.patchValue({
      avatar: file
    });

  var mimeType = file.type;
  if (mimeType.match(/image\/*/) == null) {
    this.snackBar.open('only images are allowed','Ok')
    return;
  }

  var reader = new FileReader();
  reader.readAsDataURL(file); 
  reader.onload = (_event) => { 
    this.imageUrl = reader.result; 
  }
  }


  toggleDisplay() {
    this.isShow = !this.isShow;
  }

  @Output("loadNewData") someEvent = new EventEmitter<string>();

  loadNewData(): void {
    this.someEvent.next();
  }

Imagedelete(){

  this.deleteImage =!this.deleteImage;
  console.log(this.deleteImage);
  return this.deleteImage;
}

}