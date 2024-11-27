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
    slug: "historical ",
  },
  {
    id: 8,
    name: "Historical",
    description: "",
    slug: "historical",
  },
  {
    id: 9,
    name: "Horror",
    description: "",
    slug: "horror",
  },
  {
    id: 10,
    name: "Mystery",
    description: "",
    slug: "mystery",
  },
  {
    id: 11,
    name: "Romance",
    description: "",
    slug: "romance",
  },
  {
    id: 12,
    name: "Slice of Life",
    description: "",
    slug: "slice-of-life",
  },
  {
    id: 13,
    name: "Superhero",
    description: "",
    slug: "superhero",
  },
  {
    id: 14,
    name: "Thriller",
    description: "",
    slug: "thriller",
  },
  {
    id: 15,
    name: "Sports",
    description: "",
    slug: "sports",
  },
  {
    id: 16,
    name: "Supernatural",
    description: "",
    slug: "supernatural",
  },
  {
    id: 17,
    name: "School Life",
    description: "",
    slug: "school-life",
  },
  {
    id: 18,
    name: "Teen",
    description: "",
    slug: "teen",
  },
  {
    id: 19,
    name: "Heartwarming",
    description: "",
    slug: "heartwarming",
  },
  {
    id: 20,
    name: "Coming of Age",
    description: "",
    slug: "coming-of-age",
  },
  {
    id: 21,
    name: "Crime",
    description: "",
    slug: "crime",
  },
  {
    id: 22,
    name: "Psychological",
    description: "",
    slug: "psychological",
  },
  {
    id: 23,
    name: "Tragedy",
    description: "",
    slug: "tragedy",
  },
  {
    id: 24,
    name: "Military",
    description: "",
    slug: "military",
  },
  {
    id: 25,
    name: "Martial Arts",
    description: "",
    slug: "martial-arts",
  },
  {
    id: 26,
    name: "Urban Fantasy",
    description: "",
    slug: "urban-fantasy",
  },
  {
    id: 27,
    name: "Epic Fantasy",
    description: "",
    slug: "epic-fantasy",
  },
  {
    id: 28,
    name: "Isekai/Ojemba",
    description: "",
    slug: "isekai-ojemba",
  },
  {
    id: 29,
    name: "Gaming",
    description: "",
    slug: "gaming",
  },
  {
    id: 30,
    name: "Otaku Connect",
    description: "",
    slug: "otaku-connect",
  },
  {
    id: 31,
    name: "Action Comedy",
    description: "",
    slug: "action-comedy",
  },
  {
    id: 32,
    name: "Fantasy Romance",
    description: "",
    slug: "fantasy-romance",
  },
];
