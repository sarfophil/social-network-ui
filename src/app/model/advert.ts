/** Advert Response Model */
import {SafeUrl} from "@angular/platform-browser";

export interface Advert {
    _id: string;
    content: string;
    link: string;
    createdDate: string;
    banner: Array<string>
    bannerImageUrl: any;
}
