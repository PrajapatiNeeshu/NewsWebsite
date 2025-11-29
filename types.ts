export interface Post {
  id: string;
  title: string;
  category: string;
  imageUrl: string;
  content: string;
  excerpt: string;
  timestamp: number;
}

export enum Category {
  HOME = 'Home',
  NEWS = 'News',
  FASHION = 'Fashion',
  GADGETS = 'Gadgets',
  LIFESTYLE = 'Lifestyle',
  VIDEO = 'Video'
}

export interface NewPostData {
  title: string;
  category: string;
  imageFile: File | null;
  content: string;
}
