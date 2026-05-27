import React from 'react'
import { VerifiedIcon } from '../icons/icons'
import Image from 'next/image'
import KebleBgImage from "@/public/static/images/events/keble/keble.png"

const kebleCard = () => {
  return (
    <div className="rounded-medium h-[350px] md:h-[320px] cursor-pointer relative overflow-hidden"
    > <Image src={KebleBgImage} alt="keble" width={200} height={200} className="object-cover w-full h-full" />
    <div className="absolute inset-0 z-10 pointer-events-none bg-[#000000]/50 "/>
    <div className="absolute top-2 left-2 z-30 flex items-center gap-1">
        <p className="text-[10px] md:text-xs text-white font-medium">Sponsored</p>
        <VerifiedIcon className="w-3 h-3" />
    </div>
    {/* eslint-disable-next-line @next/next/no-img-element */}
    <img src="/static/svg/keble/keblelogo.svg" alt="Keble" className="z-30 absolute bottom-8 left-2 w-20 sm:w-24 md:w-20 h-auto" />
    
    <a
      href="https://keble.com"
      target="_blank"
      rel="noopener noreferrer sponsored"
      className="absolute bottom-0 left-0 right-0 z-30 bg-gradient-to-r from-[#1E6C45] to-[#35D284] flex items-center justify-between px-2 sm:px-4 py-1.5 sm:py-2"
    >
      <span className="text-white text-[7px] sm:text-[10px] md:text-xs font-medium">
        Start investing using Keble today
      </span>
      <svg
        width="16"
        height="16"
        viewBox="0 0 24 24"
        fill="none"
        className="w-3 h-3 sm:w-4 sm:h-4 flex-shrink-0"
      >
        <path
          d="M7 17L17 7M17 7H7M17 7V17"
          stroke="white"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </a>
     </div>
  )
}

export default kebleCard