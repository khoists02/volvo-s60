export interface INotification {
  id?: string;
  per: number;
  close: number;
  updatedAt?: string;
  ticker: string;
  read: boolean;
}

export interface IBidAsk {
  id?: string;
  updatedAt?: string;
  ticker: string;
  ask: number;
  askSize: number;
  bid: number;
  bidSize: number;
}
