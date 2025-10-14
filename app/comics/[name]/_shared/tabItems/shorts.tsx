"use client"
import React from 'react'
import shortImage from "@/public/static/images/auth_bkg.png"
import Image from 'next/image';
import { PlayIcon } from '@/app/_shared/icons/icons';
import { array } from 'yup';
import { Skeleton } from '@nextui-org/react';

function ShortsTab({uid, data}: {uid:string, data:any}) {
  const [shorts, setShorts] = React.useState([]);
  const [loading, setLoading] = React.useState(true);
  React.useEffect(() => {
    // simulate loading
    const timer = setTimeout(() => {
      setShorts(data || []);
      setLoading(false);
    }, 1500);
    return () => clearTimeout(timer);
  }, [data]);
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-6 gap-4">
      {loading
        ? Array.from({ length: 6 }).map((_, index) => (
            <SkeletonShortItem key={index} />
          ))
        : shorts.length > 0
        ? shorts.map((_, index) => <ShortItem key={index} />)
        : Array.from({ length: 6 }).map((_, index) => (
            <ShortItem key={index} />
          ))}
    </div>
  );
}

const ShortItem = () => {
  return (
    <div className='h-[18.5rem] w-full relative'>
      <Image src={shortImage} alt="shortimage" width={900} height={900} style={{
        width:"100%",
        height:"100%",
        objectFit:"cover",
        objectPosition:"center center"

      }} />
      <div className='inset-0 bg-[#000] opacity-20 absolute' />
      <div className='absolute bottom-2 left-2 flex gap-2 text-white'>
        <p> <PlayIcon className="w-6 h-6 " /> </p>
        <p>100</p>
      </div>
      
    </div>
  )
}

const SkeletonShortItem = () => {
  return (
    <div className="h-[18.5rem] w-full relative rounded-xl overflow-hidden">
      <Skeleton className="w-full h-full rounded-xl" />
      <div className="absolute bottom-2 left-2 flex gap-2">
        <Skeleton className="w-6 h-6 rounded-full" />
        <Skeleton className="w-10 h-4 rounded-md" />
      </div>
    </div>
  );
};

export default ShortsTab