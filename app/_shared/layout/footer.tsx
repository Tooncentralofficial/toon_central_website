"use client";

import Image from "next/image";
import Link from "next/link";
import NumCircle from "../ellipse/circles";
import { Button } from "@nextui-org/react";

const Footer = () => {
  return (
    <div className="parent-wrap py-10">
      <div className="child-wrap h-full">
        <div className="relative h-full">
         
          <div className="relative z-10 w-full h-max flex flex-col sm:flex-row gap-8 justify-between items-start rounded-md bg-[#FCFCFD1A] px-[40px] py-[52px]">
            <div>
              <p className="text-xl lg:text-[40px]">
                Start Creating With ToonCentral Today!
              </p>
              <p className="mt-2">Want to Tell a story, get started with Us .</p>
            <div className="hidden sm:block">
            <Button
                radius="sm"
                as={Link}
                href="/creator"
                variant="bordered"
                 className="border-[var(--cursor-color)] text-[var(--cursor-color)] h-[60px] mt-9"
                size="lg"
              >
                Start Publishing
              </Button>
            </div>
            </div>
            <div>
              <p className="">Join Tooncentral Now!!</p>
              <div className="flex flex-col gap-6 mt-8">
                <div className="flex items-center gap-4">
                  <NumCircle number={1} />
                  <span>
                    Create An account with <br></br>Tooncentral
                  </span>
                </div>
                <div className="flex items-center gap-4">
                  <NumCircle number={1} />
                  <span>
                    Click Publish and start <br></br>Publishing
                  </span>
                </div>
              </div>
              <div className=" sm:hidden">
            <Button
                radius="sm"
                as={Link}
                href="/creator"
                variant="bordered"
                className="border-[var(--cursor-color)] text-[var(--cursor-color)] h-[60px] mt-9"
                size="lg"
              >
                Start Publishing
              </Button>
            </div>
            </div>
          </div>
          <div className="absolute top-0 left-0 blur-md h-full w-full flex justify-center items-center">
            <div className="w-full">

            <Image
              src="/static/images/toon_lg.png"
              width={200}
              height={240}
              alt={"campaign"}
              className=""
              style={{
                objectFit: "cover",
                width: "100%",
                height: "100%",
              }}
              unoptimized
            />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Footer;
