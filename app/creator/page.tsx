"use client";

import { Button } from "@nextui-org/react";
import Image from "next/image";
import Link from "next/link";
import { Steps, Steps2 } from "../_shared/icons/icons";
import Footer from "../_shared/layout/footer";
import { useSelector } from "react-redux";
import { selectAuthState } from "@/lib/slices/auth-slice";

const Page = () => {
const { token } = useSelector(selectAuthState);
const tokenState = token === undefined
  return (
    <div>
      <div className="parent-wrap pt-10">
        <div className="child-wrap flex w-full flex-col items-center">
          <h2 className="text-3xl">Endless Comics, Endless stories.</h2>
          <p className="mt-4">
            Read Anywhere. Create Anytime. Get started with us to unlock a world
            of comics and creativity
          </p>
          <div className="hidden md:flex gap-5 mt-8">
            <Button
              as={Link}
              href="/auth/signup"
              radius="sm"
              className="bg-[var(--green100)]"
            >
              Get Started
            </Button>
            {tokenState ? (
              <Button
              as={Link}
                radius="sm"
                className="bg-[var(--gray100)]"
                href="/auth/signup"
              >
                Publish
              </Button>
            ) : (
              <Button as={Link} radius="sm" className="bg-[var(--gray100)]" href="/creator/new">
                Publish
              </Button>
            )}
          </div>
        </div>
      </div>
      <div className="parent-wrap pb-10 mt-8">
        <div className="max-w-[1536px] md:px-6 flex w-full flex-col items-center gap-6">
          <div className="w-full overflow-hidden">
            <Image
              src={`/static/images/creators.svg`}
              width={200}
              height={200}
              alt={"creators"}
              style={{
                objectFit: "cover",
                minHeight: "160px",
                width: "100%",
              }}
              priority
            />
          </div>
          <div className="flex md:hidden flex gap-5">
            <Button radius="sm" className="bg-[var(--green100)]">
              Get Started
            </Button>
            <Button radius="sm" className="bg-[var(--gray100)]">
              Publish
            </Button>
          </div>
        </div>
      </div>
      <div className="parent-wrap py-10">
        <div className="child-wrap relative flex w-full flex-col items-center">
          <div className="mt-[150px] sm:mt-[120px] md:mt-[60px] lg:mt-[unset] "></div>
          <Steps2 />
          <div className="absolute top-0 right-0 flex flex-col gap-2 px-6">
            <h2 className="text-2xl">How it works </h2>
            <p className=" max-w-[300px] font-bold text-[#969AA0]">
              Start publishing on Toon Central with the following steps
            </p>
            <div className="w-min">
              <Button radius="sm" className="bg-[var(--green100)]">
                Publish
              </Button>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Page;
