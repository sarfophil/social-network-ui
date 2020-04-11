import { User } from './user';

/** Comment Http Response Model */
export interface Comment{
    content: String
    createdDate: String
    postId: String
    user: User,
    likes: Number
}