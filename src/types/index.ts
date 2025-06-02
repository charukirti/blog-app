// theme types

export type Theme = "light" | "dark" | "system";

// auth slice types

import type { Models } from "appwrite";

export interface User {
  $id: string;
  email: string;
  name: string;
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null
}

// blog post collection types

export interface Blog extends Models.Document {
  $id: string;
  title: string;
  slug: string;
  content: string;
  description: string;
  author_id: string;
  author_name: string;
  featured_image: string;
  tags: string[];
  comments: Comments[];
  likes: number;
}

export interface Comments {
  $id: string;
  content: string;
  author_id: string;
  username: string;
  blog_id: string;
}

export interface CreateBlog  {
  $id: string;
  title: string;
  slug: string;
  content: string;
  description: string;
  author_id: string;
  author_name: string;
  featured_image: string;
  tags: string[];
}
