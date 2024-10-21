"use client";
import React, { useMemo } from "react";
import { Pagination } from "@nextui-org/react";
import { Calendar } from "@/app/_shared/icons/icons";
import { dummyItems } from "@/app/_shared/data";
import ChapterLink from "../other/chapterLink";
import PaginationCustom from "../../../../_shared/sort/pagination";
import { ComicTab } from "../tabs";

const Chapters = ({uid, data }: ComicTab) => {
  const chapters:any[] = useMemo(() => data?.episodes || [], [data]);
  return (
    <div>
      <div className="flex items-center flex-wrap gap-2">
        <div className="flex gap-3">
          <Calendar />{" "}
          <span className="underline">Available chapters is {chapters.length}.</span>
        </div>
        <span className="text-xs">Ongoing,Bi-weekly Update(Mon & Sun)</span>
      </div>
      <div className="py-10">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {chapters?.map((item:any, i:number) => (
            <div key={i}>
              <ChapterLink uid={uid} index={i}  image={item?.thumbnail ||data?.backgroundImage||""} chapter={item} />
            </div>
          ))}
        </div>
      </div>

      {/* <PaginationCustom page={1} total={1} /> */}
    </div>
  );
};

export default Chapters;
