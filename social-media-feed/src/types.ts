export interface User {
  id: string;
  name: string;
  handle: string;
  avatarUrl?: string;
}

export interface Comment {
  id: string;
  author: User;
  body: string;
  createdAt: string;
}

export interface Post {
  id: string;
  author: User;
  content: string;
  images: string[];
  createdAt: string;
  likes: number;
  liked: boolean;
  comments: Comment[];
}
