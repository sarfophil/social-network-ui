import { Component, OnInit } from '@angular/core';
import {state,transition, trigger, style, animate} from '@angular/animations';
import {User} from "../../../../model/user";
import {MatDialog} from "@angular/material/dialog";
import {ProfilePicUploadComponent} from "../../profile-pic-upload/profile-pic-upload.component";
import {Router} from "@angular/router";

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

  currentuser: User = JSON.parse(localStorage.getItem("active_user"));
  profilePicture: any;

  constructor(private dialog: MatDialog,private router: Router) { }

  ngOnInit() {
    this.loadData()
    this.profilePicture = this.currentuser.profilePicture;
  }

  loadData(){
    setTimeout(() => this.showPlaceholder = false , 3000)
  }

  uploadPhoto() {
      let imageElement: HTMLElement =  document.getElementById('home-profilePhoto');
      let dialogRef = this.dialog.open(ProfilePicUploadComponent,{
          maxHeight: '500px',
          maxWidth: '500px'
      });

  }

}
