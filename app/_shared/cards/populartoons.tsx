import Image from 'next/image';
import React from 'react'
import image from "@/public/static/images/comics/new_0.png";
import { Comic } from '@/helpers/types';
import Link from 'next/link';
const PopularToonscard = ({item,index}:{item:Comic,index:number}) => {
  return (
    <Link href={`${item?.uuid ? `/comics/${item?.uuid}` : ""}`}>
      <div className="flex gap-5">
        <p className="pr-2">{index + 1}</p>
        <div className="w-[60px] h-[60px] overflow-hidden rounded-[6px]">
          <Image
            src={item.coverImage}
            layout="responsive"
            width={60}
            height={60}
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
          <p className="font-extrabold">{item?.title}</p>
        </div>
      </div>
    </Link>
  );
}

export default PopularToonscard