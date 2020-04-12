import { User } from './user';

/** Comment Http Response Model */
export interface Comment{
    _id: String;
    content: String
    createdDate: String
    postId: String
    user: User,
    likes: Array<User>
}
