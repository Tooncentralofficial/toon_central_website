import React from 'react'
import { Appstore, Facebook, Googleplay, Insta, Linkedin, ToonCentralIcon, Twitter } from '../icons/icons';

const Mainfooter = () => {
  return (
    <div className=" w-full  bg-[#151D29] pb-5">
      <div className="px-4 sm:px-4 md:px-12  lg:px-16 xl:px-24 ">
        <div className="w-full h-full flex flex-col items-center pt-14">
          <h3 className="text-xl lg:text-[40px]">Experience True Comic Fun!</h3>
          <div className="flex gap-5 mt-5">
            <Googleplay />
            <Appstore />
          </div>
        </div>

        <div className="flex justify-between pt-16 flex-col md:flex-row gap-10 md:gap-0">
          <ToonCentralIcon />
          <div className="flex gap-3 md:gap-5 lg:gap-10 justify-center md:justify-normal text-tiny md:text-small">
            <p>About us </p>
            <p>Feedback</p>
            <p>Help</p>
            <p>Terms </p>
            <p>Privacy </p>
            <p>Contant</p>
          </div>
          <div className="flex gap-5 md:gap-5 lg:gap-10 justify-center md:justify-normal">
            <Facebook />
            <Twitter />
            <Insta />
            <Linkedin />
          </div>
        </div>
        <div className="flex justify-center pt-10">
          <p className="text-xs">
            Copyright © 2024 All Rights Reserved. v1.30.2
          </p>
        </div>
      </div>
    </div>
  );
}

export default Mainfooter