/**
 * User Response Interface
 */

export interface User {
    _id: String;
    username: String;
    email: String;
    role: String;
    followers: Array<String>;
    following: Array<String>;
    totalVoilation: Number;
    location: Array<Number>;
    age: Number;
    isActive: Boolean;
    password: String;
    profilePicture: String;
}
