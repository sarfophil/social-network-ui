import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AnimationService {

  constructor() { }

  /**
   * 
   * @param element 
   */
  slideToggle(element:any){
     element.setAttribute('style','display:block,overflow:hidden;height: 15px')
  } 
}
