import { Pipe, PipeTransform } from '@angular/core';
import * as moment from 'moment'

@Pipe({
  name: 'moment'
})
export class MomentPipe implements PipeTransform {

  transform(value: any, ...args: any[]): any {
    let period = moment(value,moment.defaultFormat).toDate()
    let format = moment(period).fromNow()
    return format.toString();
  }

}
