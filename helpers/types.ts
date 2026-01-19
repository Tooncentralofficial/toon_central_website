interface Country {
  id: number;
  name: string;
  dial_code: string;
  alias: string;
  flag: string;
}

interface Genre {
  id: number;
  name: string;
  description: string;
  slug: string;
  created_at: string;
}

export interface User {
  id: number;
  first_name: string;
  last_name: string;
  email: string;
  username: string;
  photo: string;
  phone: string;
  country_id: number;
  currency_id: number;
  user_type_id: number;
  is_blocked: boolean;
  is_email_verified: boolean;
  is_official_user: boolean;
  is_suspended: boolean;
  created_at: string; // ISO date string
  updated_at: string; // ISO date string
  deleted_at: string | null;
  welcome_note: string;
  
}

export interface Comic {
  addToToonCentralCollection: string;
  backgroundImage: string;
  country: Country;
  countryId: string;
  coverImage: string;
  createdAt: string;
  description: string;
  episodes: Array<any>; // You can replace `any` with a specific episode interface if you have one
  genre: Genre;
  genreId: string;
  status:string;
  updateDays:string;
  id: number;
  likesAndViews: any; // You can replace `any` with the specific type if you have one
  publishedByToonCentral: string;
  genres:ComicGenre[]
  statusId: string;
  title: string;
  updatedAt: string;
  user: User;
  userId: string;
  uuid: string;
  socialMediaHandle:string
}

interface ComicGenre {
  id: number; // Unique ID for this genre entry
  comic_id: number; // ID of the comic this genre belongs to
  genre_id: number; // ID of the genre
  genre: {
    id: number; // ID of the genre
    name: string; // Name of the genre
  };
}

export interface ComicComment {
  id: number;
  comicId: number;
  userId: number;
  comment: string;
  createdAt: string;
  updatedAt: string; 
  user: User;
  created_at:string
}
export interface ComicFormValues {
  backgroundImage: File | string;
  coverImage: File | string;
  title: string;
  description: string;
  genreId: string[];
  status: string;
  updateDays: string;
  socialMediaHandle: string;
  genres: ComicGenre[];
}

export interface ShortsType {
  id: number;
  uuid: string;
  title: string;
  description: string;
  upload: string;
  coverImage: string;
  amount: number;
  audienceId: number;
  isMonetized: number;
  statusId: number;
  userId: number;
  createdAt: string;
  updatedAt: string;
  comments: any[];
  likesAndViews: ShortsLikesAndViews;
  user :Partial<User>
}

export interface ShortsResponse {
  success: boolean;
  message: string;
  data: {
    pagination: PaginationInfo;
    shorts: ShortsType[];
  };
}

export interface PaginationInfo {
  total: number;
  count: number;
  perPage: number;
  currentPage: number;
  totalPages: number;
}

export interface CommentType {
  id: number;
  comment: string;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
  short_id: number;
  user_id: number;
  user: User
}

export interface PaginationType {
  page: number;
  limit: number;
  perPage: number;
  currentPage: number;
  totalPages: number;
}
export interface shortLike {
  user_id: number;
}

export interface LikesAndViewsItem {
  id: number;
  short_id: number;
  dislikes: shortLike[];
  views: number | null;
  likes: shortLike[];
  created_at: string;
  updated_at: string;
}

export type ShortsLikesAndViews = LikesAndViewsItem[];