import React, { FC } from "react";
import Blend from "../../assets/images/blend.svg";

const BlendIcon: FC<{ width: number; height: number }> = ({
  width,
  height,
}) => {
  return (
    <img
      src={Blend}
      className="border rounded-circle mr-2"
      alt="Icon"
      width={width}
      height={height}
    />
  );
};

export default BlendIcon;
