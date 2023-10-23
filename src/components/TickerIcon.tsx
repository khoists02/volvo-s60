import React, { FC } from "react";

interface ITickerIcon {
  size: "sm" | "lg";
  symbol: string;
  backgroundColor?: string;
}

const getRandomNumber = (maxNum: number) => {
  return Math.floor(Math.random() * maxNum);
};

export const randomColor = () => {
  const h = getRandomNumber(360);
  const s = getRandomNumber(100);
  const l = getRandomNumber(100);
  return `hsl(${h}deg, ${s}%, ${l}%)`;
};

export const TickerIcon: FC<ITickerIcon> = ({
  size,
  symbol,
  backgroundColor = "#d1d1d1",
}) => {
  return (
    <div
      className="rounded-circle d-flex align-items-center justify-content-center text-white"
      style={{
        width: size === "sm" ? 50 : 70,
        height: size === "sm" ? 50 : 70,
        backgroundColor: backgroundColor,
      }}
    >
      {symbol}
    </div>
  );
};
