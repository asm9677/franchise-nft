import React, { FC } from "react";

interface BannerCardProps {
  src: string;
  title: string;
  description: string;
  color: string;
}

const BannerCard: FC<BannerCardProps> = ({
  src,
  title,
  description,
  color,
}) => {
  return (
    <div className="relative h-[500px]">
      <div className={`pl-64 flex flex-col justify-center  h-full ${color}`}>
        <span className="text-[48px] font-bold">{title} </span>
        <span className="text-[24px]  ">{description}</span>
      </div>
      <img
        src={src}
        className="w-full h-full object-cover absolute top-0 left-0 -z-10"
      />
    </div>
  );
};

export default BannerCard;
