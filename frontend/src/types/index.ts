export interface User {
  id: string;
  username: string;
  email: string;
}

export interface Article {
  id: string;
  title: string;
  content: string;
  tags: string[];
  created_at: string;
  updated_at: string;
  user_id: string;
}

export type LoginCredentials = {
  email: string;
  password: string;
};

export type SignupCredentials = {
  username: string;
  email: string;
  password: string;
};

export type CreateArticleData = {
  title: string;
  content: string;
  tags: string[];
};

export type UpdateArticleData = {
  id: string;
} & CreateArticleData;