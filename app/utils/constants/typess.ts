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