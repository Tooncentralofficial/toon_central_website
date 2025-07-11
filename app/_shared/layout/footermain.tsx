"use client";
import React, { useEffect, useState } from "react";
import {
  Appstore,
  Facebook,
  Googleplay,
  Insta,
  Linkedin,
  ToonCentralIcon,
  Twitter,
} from "../icons/icons";
import Link from "next/link";

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
            <Link href={"/about"}>About us </Link>
            <p>Feedback</p>
            <Link href={"/terms"}>
              <p>Terms </p>
            </Link>
            <Link href={"/policies"}>
              <p>Privacy </p>
            </Link>
            <Link href={"/contactus"}>
              <p>Contact</p>
            </Link>
          </div>
          <div className="flex gap-5 md:gap-5 lg:gap-10 justify-center md:justify-normal">
            <Link
              href={"https://www.facebook.com/share/18wVBfGfLe/"}
              target="_blank"
            >
              <Facebook />
            </Link>
            <Link href={"https://x.com/tooncentralhq?s=21"} target="_blank">
              <Twitter />
            </Link>
            <Link
              href={"https://www.instagram.com/tooncentralofficial/"}
              target="_blank"
            >
              <Insta />
            </Link>
            <Link
              href={"https://www.linkedin.com/company/toon-central-hub/"}
              target="_blank"
            >
              <Linkedin />
            </Link>
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
};
const MainfooterWithDelay = ({ delay = 2000 }: { delay?: number }) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, delay);

    return () => clearTimeout(timer);
  }, [delay]);

  return isVisible ? <Mainfooter /> : null;
};

export default MainfooterWithDelay;
