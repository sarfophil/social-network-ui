import {Component, OnInit} from '@angular/core';
import {ProviderService} from "../../../service/provider-service/provider.service";
import {API_TYPE} from "../../../model/apiType";
import {User} from "../../../model/user";
import {MatSnackBar} from "@angular/material/snack-bar";
import {MatDialogRef} from "@angular/material/dialog";
import {state, style, transition, trigger} from "@angular/animations";

@Component({
  selector: 'app-profile-pic-upload',
  templateUrl: './profile-pic-upload.component.html',
  styleUrls: ['./profile-pic-upload.component.css'],
  animations: [
     trigger('uploadingTrigger',[
        state('open',style({
            display: 'block'
        })),
       state('close',style({
            display: 'none'
       }))
     ])
  ]
})
export class ProfilePicUploadComponent implements OnInit {

  imageInput: HTMLElement;
  picture: any;
  imagePreview: any = "assets/img/user.png";
  user: User;
  blobPicture$:any;
  isUploading: boolean = false;
  constructor(private provider:ProviderService,private snackbar: MatSnackBar,
              public dialogRef: MatDialogRef<ProfilePicUploadComponent>) { }

  ngOnInit() {
    this.imageInput = document.getElementById('imageInput');
    this.user =  JSON.parse(localStorage.getItem("active_user"));
  }

  changePicture() {
    this.imageInput.click()
  }

  upload() {
     if(this.picture){
        this.isUploading = true;
        let formData = new FormData();
        formData.set("picture",this.blobPicture$,'upload.jpg');
       let path = `account/profilepic/${this.user._id}`;
        this.provider.upload(API_TYPE.USER,path,formData)
          .subscribe(
            (response:Array<String>) => {
                this.isUploading = false
                this.user.profilePicture = response[0];
                localStorage.setItem('active_user',JSON.stringify(this.user))
                this.dialogRef.close()
            },
            (error)=> {
                this.isUploading = false;
                this.snackbar.open('Unable to update profile','Ok')
            })
     }
  }

  preview(files: any) {
      if(files.length === 0) return;
      let mimeType= files[0].type;
      let reader = new FileReader();
      this.blobPicture$ = files[0];
      reader.readAsDataURL(files[0]);
      reader.onload = (_event) => {
        this.imagePreview = reader.result
      }
  }
}
