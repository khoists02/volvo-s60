export interface PlayResponse {
  id?: string;
  ticker?: string;
  playedAt?: string;
  price?: number;
  inPrice?: number;
  total?: number;
  done?: boolean;
  virtual?: boolean;
}
