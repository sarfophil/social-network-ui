import { Pipe, PipeTransform } from '@angular/core';
import {ProviderService} from "../../service/provider-service/provider.service";
import {Words} from "../../pages/admin-ui-components/keyword/keyword.component";
import {DomSanitizer} from "@angular/platform-browser";

@Pipe({
  name: 'wordsHighlighter'
})
export class WordsHighlighterPipe implements PipeTransform {

  bannedWords: Array<Words> = JSON.parse(localStorage.getItem('bannedWords'))

  constructor(private sanitizer: DomSanitizer) {

  }

  transform(value: any, ...args: any[]): any {
    if(this.bannedWords && this.bannedWords.length > 0){
      let transformed = '';
      let content = value as String
      let contentArr = content.split(" ")
      for(let word of contentArr){
        let lookup = this.bannedWords.find((w) => w.word.toLowerCase() === word.toLowerCase())
        if(lookup){
          transformed += ` <mark style="background: #dc4734; color: #fff">${word}</mark>`
        }else {
          transformed += ` ${word}`
        }

      }

      return this.sanitizer.bypassSecurityTrustHtml(transformed);
    }

    return value;
  }

}
