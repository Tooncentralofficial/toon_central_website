import { AddBox } from "@/app/_shared/icons/icons";
import Image from "next/image";

const TrendingItem = ({ data }: { data: any }) => {
  return (
    <div className="flex items-center gap-4 justify-between">
      <div className="flex items-center gap-4">
        <div className="w-[60px] h-[60px] overflow-hidden rounded-[6px]">
          <Image
            src={`${data?.coverImage || ""}`}
            layout="responsive"
            width={60}
            height={60}
            alt={`${data?.title || "toon_central"}`}
            style={{
              objectFit: "cover",
              width: "100%",
              minHeight: "100%",
            }}
          />
        </div>
        <span>{data.title} </span>
      </div>
      <AddBox />
    </div>
  );
};

export default TrendingItem;
