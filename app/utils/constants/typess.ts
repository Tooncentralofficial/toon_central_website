export type ReqResponseType = {
  success: boolean;
  data?: any;
  message: string;
};

export type SubPlansType = {
  type: string;
  price: number;
  title: string;
  content: string[];
};
export type CreditPlansType = {
  type: string;
  price: number;
  credits: number;
};

export type CreatorDashboardStats = {
  total_views: number;
  total_views_change: number | null;
  subscribers: number;
  subscribers_change: number | null;
  total_likes: number;
  total_likes_change: number | null;
  total_earnings: number;
  total_earnings_change: number | null;
};

export type RecentComicPerformance = {
  comic_title: string;
  episode_title: string;
  episode_number: number;
  status: "Published" | "Scheduled";
  views: number;
  likes: number;
  created_at: string;
};