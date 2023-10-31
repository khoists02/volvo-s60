export interface PlayResponse {
  id?: string;
  ticker?: string;
  playedAt?: string;
  price?: number;
  inPrice?: number;
  lossPrice?: number;
  winPrice?: number;
  total?: number;
  done?: boolean;
  virtual?: boolean;
  doneAt?: string;
  currentPrice?: number;
  cfd?: number;
}
