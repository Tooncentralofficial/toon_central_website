import Image from 'next/image'
import React from 'react'
import UserImg from "@/public/static/images/shareimg.png";
import { ShortscommentLikeIcon } from '@/app/_shared/icons/icons';

const ShortsComments  = () => {
  const [isLiked, setIsLiked] = React.useState(true);
  return (
    <div className="flex gap-3 items-center">
      <div className="min-w-[3rem] h-[3rem] rounded-full overflow-hidden ">
        <Image
          src={UserImg}
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
        <h3 className="font-bold">Username</h3>
        <p>
          sent you a message: Meet Ethan and other new Characters to chat
          with...
        </p>
      </div>
      <div className='flex gap-1'>
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