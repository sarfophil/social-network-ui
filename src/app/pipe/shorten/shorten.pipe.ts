import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'shorten'
})
export class ShortenPipe implements PipeTransform {

  transform(value: any, ...args: any[]): any {
    if(args.length != 0){
      return value.substring(0,args[0]).concat(' ...')
    }else {
      console.log('Im here')
      if(value.length <= 200) return value;
      return value.substring(0,200).concat('...');
    }
  }

}
