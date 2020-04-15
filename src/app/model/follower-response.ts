export interface FollowerResponse {
  _id: string;
  username: string;
  followers: Array<any>;
  following: Array<any>;
  profilePicture: String;

   // field will be used determine current user relationship
   isFollowing: boolean;
}
