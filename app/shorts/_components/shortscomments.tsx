import Image from 'next/image'
import React from 'react'
import UserImg from "@/public/static/images/shareimg.png";
import { ShortscommentLikeIcon } from '@/app/_shared/icons/icons';
import { CommentType, PaginationType } from '@/helpers/types';

const ShortsComments  = ({shortId,comment, pagination}:{shortId?: number | string | null,comment?:CommentType,pagination?:PaginationType}) => {
  const [isLiked, setIsLiked] = React.useState(true);
  console.log(comment);

  return (
    <div className="flex gap-2 justify-between ">
      <div className='flex gap-3 flex-1'>
        <div className="min-w-[3rem] h-[3rem] rounded-full">
          <Image
            src={comment?.user?.photo || UserImg}
            alt={"image of user"}
            width={50}
            height={50}
            style={{
              objectFit: "cover",
              objectPosition: "center ",
            }}
          />
        </div>
        <div className="flex flex-col text-sm">
          <h3 className="font-bold">{comment?.user?.username || ""}</h3>
          <p>{comment?.comment}</p>
        </div>
      </div>
      <div className="flex gap-1 items-start">
        <span onClick={() => setIsLiked(!isLiked)}>
          <ShortscommentLikeIcon
            className={`h-5 w-5 cursor-pointer ${
              isLiked ? "text-[#4ADD80]" : "text-[#ffffff]"
            }`}
          />
        </span>
        <span>12</span>
      </div>
    </div>
  );
}

export default ShortsComments