import {S} from '@angular/cdk/keycodes/typings';
import { Injectable } from '@angular/core';
import {ProviderService} from'./service/provider-service/provider.service'
import { from } from 'rxjs';
import {API_TYPE} from './model/apiType'

@Injectable({
  providedIn: 'root'
})
export class PostService {

  constructor(private providerService:ProviderService) { }

  createPost(body){
    return this.providerService.post(API_TYPE.POST,'',body).subscribe((data) => {return data});
  }
  getPost(uid){
    return this.providerService.get(API_TYPE.POST,'',uid).subscribe((data) => {return data});
  }
  deletPost(){

  }
  getPosts(limit,page){

  }
  getLikes(){

  }
  
}
