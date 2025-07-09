import Image from 'next/image'
import React from 'react'
import img from "@/public/static/images/events/image_2.png";

export default function NotificationPanel() {
  return (
    <div className='flex justify-between items-center'>
      <div className='flex gap-4 items-center'>
        <div className="w-[3rem] h-[3rem] rounded-full overflow-hidden">
          <Image src={img.src} width={500} height={500} alt={"image"} />
        </div>

        <div>
          <p className="text-[#969AA0] text-xs">
            Tuesday September 11, 2022 10:36 AM
          </p>
          <p className="text-[1rem]">
            Tooncentral Updated Chapter for Red Devils
          </p>
        </div>
      </div>
      <div className='w-[3.5rem] h-[3.5rem] bg-[#D9D9D9] rounded-[8px] ' ></div>
    </div>
  );
}
