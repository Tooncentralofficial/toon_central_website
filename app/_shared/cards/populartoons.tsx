import Image from 'next/image';
import React from 'react'
import image from "@/public/static/images/comics/new_0.png";
import { Comic } from '@/helpers/types';
import Link from 'next/link';
const PopularToonscard = ({item,index}:{item:Comic,index:number}) => {
  return (
    <Link href={`${item?.uuid ? `/comics/${item?.uuid}` : ""}`}>
      <div className="flex gap-5">
        <p
          className={`${
            index === 0 && "bg-[#05834B] rounded-[50%]"
          } h-[1.5rem] w-[1.5rem] flex items-center justify-center`}
        >
          {index + 1}
        </p>
        <div className="w-[45px] h-[45px] overflow-hidden rounded-[6px]">
          <Image
            src={item.coverImage}
            layout="responsive"
            width={40}
            height={40}
            alt={`item`}
            style={{
              objectFit: "cover",
              width: "100%",
              minHeight: "100%",
            }}
          />
        </div>
        <div>
          <p>{item?.genre?.name} </p>
          <p className="font-bold">{item?.title}</p>
        </div>
      </div>
    </Link>
  );
}

export default PopularToonscard