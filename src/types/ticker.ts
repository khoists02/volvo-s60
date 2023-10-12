export interface ITickerInfo {
    marketCap: string;
    currentPrice: string;
    shortName: string;
    longName: string;
    icon?: React.ReactElement;
    previousClose: string;
    symbol?: string;
}
