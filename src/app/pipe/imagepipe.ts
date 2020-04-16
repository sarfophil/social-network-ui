import { PipeTransform, Pipe } from '@angular/core';
import { environment } from 'src/environments/environment';

@Pipe({
    name:'imageUrl'
})
export class ImagePipe implements PipeTransform{
    transform(value: any, ...args: any[]) {
       return new String( environment.apiEndpoint )+'/download?imagename='+value;
    }

}