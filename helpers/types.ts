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

interface User {
  id: number;
  first_name: string;
  last_name: string;
  email: string;
  username: string;
  photo:string
  // Add any other relevant fields if needed
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
  statusId: string;
  title: string;
  updatedAt: string;
  user: User;
  userId: string;
  uuid: string;
  socialMediaHandle:string
}

export interface ComicComment {
  id: number;
  comicId: number;
  userId: number;
  comment: string;
  createdAt: string; // ISO date string
  updatedAt: string; // ISO date string
  user: User;
}