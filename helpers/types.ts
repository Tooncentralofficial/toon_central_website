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