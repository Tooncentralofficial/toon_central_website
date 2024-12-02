import { ReqResponseType } from "./typess";

const SuccessResponse = (data?: any, message?: string): ReqResponseType|any => ({
  success: true,
  message: message || "",
  data,
});

const FailedResponse = (message?: string, data?: any): ReqResponseType => ({
  success: false,
  message: message || "",
  data,
});
export { SuccessResponse, FailedResponse };
export const SELECT_ITEMS = [
  {
    id: 1,
    name: "Action",
    description: "",
    slug: "action",
  },
  {
    id: 2,
    name: "Comedy",
    description: "",
    slug: "comedy",
  },
  {
    id: 3,
    name: "Sci-Fi",
    description: "",
    slug: "sci_fi",
  },
  {
    id: 4,
    name: "Adventure",
    description: "",
    slug: "adventure",
  },
  {
    id: 5,
    name: "Drama",
    description: "",
    slug: "drama",
  },
  {
    id: 6,
    name: "Fantasy",
    description: "",
    slug: "fantasy",
  },
  {
    id: 7,
    name: "Historical",
    description: "",
    slug: "historical",
  },
  {
    id: 8,
    name: "Horror",
    description: "",
    slug: "horror",
  },
  {
    id: 9,
    name: "Mystery",
    description: "",
    slug: "mystery",
  },
  {
    id: 10,
    name: "Romance",
    description: "",
    slug: "romance",
  },
  {
    id: 11,
    name: "Slice of Life",
    description: "",
    slug: "slice-of-life",
  },
  {
    id: 12,
    name: "Superhero",
    description: "",
    slug: "superhero",
  },
  {
    id: 13,
    name: "Thriller",
    description: "",
    slug: "thriller",
  },
  {
    id: 14,
    name: "Sports",
    description: "",
    slug: "sports",
  },
  {
    id: 15,
    name: "Supernatural",
    description: "",
    slug: "supernatural",
  },
  {
    id: 16,
    name: "School Life",
    description: "",
    slug: "school-life",
  },
  {
    id: 17,
    name: "Teen",
    description: "",
    slug: "teen",
  },
  {
    id: 18,
    name: "Heartwarming",
    description: "",
    slug: "heartwarming",
  },
  {
    id: 19,
    name: "Coming of Age",
    description: "",
    slug: "coming-of-age",
  },
  {
    id: 20,
    name: "Crime",
    description: "",
    slug: "crime",
  },
  {
    id: 21,
    name: "Psychological",
    description: "",
    slug: "psychological",
  },
  {
    id: 22,
    name: "Tragedy",
    description: "",
    slug: "tragedy",
  },
  {
    id: 23,
    name: "Military",
    description: "",
    slug: "military",
  },
  {
    id: 24,
    name: "Martial Arts",
    description: "",
    slug: "martial-arts",
  },
  {
    id: 25,
    name: "Urban Fantasy",
    description: "",
    slug: "urban-fantasy",
  },
  {
    id: 26,
    name: "Epic Fantasy",
    description: "",
    slug: "epic-fantasy",
  },
  {
    id: 27,
    name: "Isekai/Ojemba",
    description: "",
    slug: "isekai-ojemba",
  },
  {
    id: 28,
    name: "Gaming",
    description: "",
    slug: "gaming",
  },
  {
    id: 29,
    name: "Otaku Connect",
    description: "",
    slug: "otaku-connect",
  },
  {
    id: 30,
    name: "Action Comedy",
    description: "",
    slug: "action-comedy",
  },
  {
    id: 31,
    name: "Fantasy Romance",
    description: "",
    slug: "fantasy-romance",
  },
];