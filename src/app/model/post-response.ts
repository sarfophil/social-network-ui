/** Response Model for post */
export interface Like {
  _id: string
}


export class PostResponse {
    private _id: string;
    private _image: string;
    private _userId: string;
    private _createdDate: string;
    private _isHealthy: boolean;
    private _userProfilePicture:string
    private _username: string;
    private _likes: Array<Like>;
    private _content: string;
    private _downloadedImageBlob: any;

  constructor(id: string, image: string, userId: string, createdDate: string, isHealthy: boolean, userProfilePicture: string, username: string, likes: Array<Like>, content: string) {
    this._id = id;
    this._image = image;
    this._userId = userId;
    this._createdDate = createdDate;
    this._isHealthy = isHealthy;
    this._userProfilePicture = userProfilePicture;
    this._username = username;
    this._likes = likes;
    this._content = content;
  }


  get id(): string {
    return this._id;
  }

  get image(): string {
    return this._image;
  }

  get userId(): string {
    return this._userId;
  }

  get createdDate(): string {
    return this._createdDate;
  }

  get isHealthy(): boolean {
    return this._isHealthy;
  }

  get userProfilePicture(): string {
    return this._userProfilePicture;
  }

  get username(): string {
    return this._username;
  }

  get likes(): Array<Like> {
    return this._likes;
  }

  get content(): string {
    return this._content;
  }


  set downloadedImageBlob(value: any) {
    this._downloadedImageBlob = value;
  }

  get downloadedImageBlob(): any {
    return this._downloadedImageBlob;
  }
}
