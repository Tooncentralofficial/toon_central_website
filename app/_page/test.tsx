"use client";
import React, { useEffect, useState } from "react";
import InfiniteScroll from "react-infinite-scroll-component";
import H2SectionTitle from "../_shared/layout/h2SectionTitle";
import image from "@/public/static/images/comics/new_0.png";
import { useQuery } from "@tanstack/react-query";
import { getRequest } from "../utils/queries/requests";
import { Comic } from "@/helpers/types";
import Link from "next/link";
import Image from "next/image";

const HorizontalScroll = () => {
  const [actionItems, setActionItems] = useState<Comic[]>([]);
  const [ComedyItems, setComedyItems] = useState<Comic[]>([]);
  const [page, setPage] = useState<number>(1);
  const [comedyPage, setComedyPage] = useState<number>(1);
  const fetchMoreData = () => {
    setPage((prev) => prev + 1);
  };
  console.log(page)
  const fetchMoreComedyData = () => {
    setComedyPage((prev) => prev + 1);
  };
  const { data: genreList } = useQuery({
    queryKey: ["all_genres"],
    queryFn: () => getRequest("/genres/pull/list"),
  });

  const { data, isLoading, isFetching, isSuccess } = useQuery({
    queryKey: [`genre_action`, page],
    queryFn: () => getRequest(`/genres/comic/1/all?page=${page}&limit=${6}`),
  });
  const {
    data: comedyData,
    isLoading: comedyIsLoading,
    isFetching: comedyIsFetching,
    isSuccess: comedyIsSuccess,
  } = useQuery({
    queryKey: [`genre_comedy`, comedyPage],
    queryFn: () =>
      getRequest(`/genres/comic/3/all?page=${comedyPage}&limit=${5}`),
  });
  
  console.log(data);
  useEffect(() => {
    if (isSuccess) {
      setActionItems((prev) => [...prev, ...data.data.comics]);
    }
  }, [isFetching, isLoading, data]);
  useEffect(() => {
    if (comedyIsSuccess) {
      setComedyItems((prev) => [...prev, ...comedyData.data.comics]);
    }
  }, [comedyIsLoading, comedyIsFetching, comedyIsSuccess]);
  console.log(data?.data?.pagination?.totalPages);
  return (
    <div className="parent-wrap py-10 block md:hidden ">
      <div className="child-wrap">
        <H2SectionTitle title="Favourites Genre" />
        <div className=" bg-[#151D29] rounded-lg p-5">
          <h3 className="mb-5 ml-5">Action</h3>
          <div
            id="scrollable-div"
            style={{
              display: "flex",
              overflowX: "auto",
              whiteSpace: "nowrap",
              padding: "10px",
            }}
          >
            <InfiniteScroll
              dataLength={actionItems.length}
              next={fetchMoreData}
              hasMore={page < data?.data?.pagination?.totalPages}
              scrollableTarget="scrollable-div"
              loader={<h4>Loading...</h4>}
              className="horizontal-scroll"
            >
              {actionItems.map((actionComic: Comic, index) => (
                <Link
                  key={index}
                  href={`${
                    actionComic?.uuid ? `/comics/${actionComic?.uuid}` : ""
                  }`}
                >
                  <div className="scroll-item overflow-hidden">
                    <img
                      src={actionComic?.backgroundImage}
                      alt="sdp"
                      style={{
                        width: "100%",
                        height: "100%",
                        objectFit: "cover",
                      }}
                    />
                  </div>
                </Link>
              ))}
            </InfiniteScroll>
          </div>
        </div>
        <div className=" bg-[#151D29] rounded-lg p-5 mt-8">
          <h3 className="mb-5 ml-5">Comedy</h3>
          <div
            id="scrollable-div"
            style={{
              display: "flex",
              overflowX: "auto",
              whiteSpace: "nowrap",
              padding: "10px",
            }}
          >
            <InfiniteScroll
              dataLength={ComedyItems.length}
              next={fetchMoreComedyData}
              hasMore={comedyPage < comedyData?.data?.pagination?.totalPages}
              scrollableTarget="scrollable-div"
              loader={<h4>Loading...</h4>}
              className="horizontal-scroll"
            >
              {ComedyItems.map((comedyComic: Comic, index) => (
                <Link
                  href={`${
                    comedyComic?.uuid ? `/comics/${comedyComic?.uuid}` : ""
                  }`}
                  key={index}
                >
                  <div className="scroll-item overflow-hidden">
                    <img
                      src={comedyComic?.backgroundImage}
                      alt="sdp"
                      style={{
                        width: "100%",
                        height: "100%",
                        objectFit: "cover",
                      }}
                    />
                  </div>
                </Link>
              ))}
            </InfiniteScroll>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HorizontalScroll;
