"use client";
import React, { useMemo } from "react";
import { Calendar } from "@/app/_shared/icons/icons";
import { dummyItems } from "@/app/_shared/data";
import ChapterLink from "../other/chapterLink";
import { ComicTab } from "../tabs";
import { SolidPrimaryButton } from "@/app/_shared/inputs_actions/buttons";
import Link from "next/link";

const Chapters = ({ uid, data, comicId }: ComicTab) => {
  const chapters: any[] = useMemo(() => data?.episodes || [], [data]);
  return (
    <div>
      <div className="flex items-center flex-wrap gap-2">
        <div className="flex gap-3">
          <Calendar />{" "}
          <span className="underline">
            Available chapters is {chapters.length}.
          </span>
        </div>
        <span className="text-xs">
          {data?.status == "ONGOING" ? (
            <>Ongoing,Bi-weekly Update({data?.updateDays || ""})</>
          ) : (
            "Completed"
          )}
        </span>
      </div>
      <div className="py-10">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {chapters?.map((item: any, i: number) => (
            <div key={i}>
              <ChapterLink
                uid={uid}
                index={i}
                image={data?.backgroundImage || ""}
                chapter={item}
              />
            </div>
          ))}
        </div>
      </div>
      <div className="flex justify-center">
        <div className="w-[400px] mt-3">
          <SolidPrimaryButton
            as={Link}
            href={`/user/library/books/addpart?uuid${uid}&comicId=${comicId}`}
          >
            Add a part
          </SolidPrimaryButton>
        </div>
      </div>

      {/* <PaginationCustom page={1} total={1} /> */}
    </div>
  );
};

export default Chapters;
