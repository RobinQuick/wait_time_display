export interface Product {
  id: string;
  name: string;
  image: string;
  offer: string;
}

export interface WaitTimeData {
  waitTime: number;
  offer: string;
  hasOffer: boolean;
}

export interface ApiResponse<T = any> {
  ok: boolean;
  data?: T;
  error?: string;
}