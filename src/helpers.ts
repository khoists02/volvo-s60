import { CSSProperties } from "react";

export const convertToInternationalCurrencySystem = (labelValue?: string) => {
  if (!labelValue) return "";

  // Nine Zeroes for Billions
  return Math.abs(Number(labelValue)) >= 1.0e9
    ? (Math.abs(Number(labelValue)) / 1.0e9).toFixed(2) + "B"
    : // Six Zeroes for Millions
    Math.abs(Number(labelValue)) >= 1.0e6
    ? (Math.abs(Number(labelValue)) / 1.0e6).toFixed(2) + "M"
    : // Three Zeroes for Thousands
    Math.abs(Number(labelValue)) >= 1.0e3
    ? (Math.abs(Number(labelValue)) / 1.0e3).toFixed(2) + "K"
    : Math.abs(Number(labelValue));
};

export const getStyleStock = (
  close: number,
  previousClose: number,
): CSSProperties => {
  const x = 10;
  if (close === previousClose) {
    // light
    return { backgroundColor: "#f0f2f5" };
  }

  if (close < previousClose) {
    const per = ((previousClose - close) / close) * x;
    return {
      color: per > 0.6 ? "#ffffff" : "#333333",
      backgroundColor: `rgb(239 83 80 / ${per >= 1 ? 1 : per.toFixed(2)})`,
    };
  }

  if (close > previousClose) {
    const per = ((close - previousClose) / close) * x;
    return {
      color: per > 0.6 ? "#ffffff" : "#333333",
      backgroundColor: `rgb(37 179 114 / ${per >= 1 ? 1 : per.toFixed(2)}) `,
    };
  }

  return {};
};
