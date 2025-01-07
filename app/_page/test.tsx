"use client";
import React, { useEffect, useState } from "react";
import InfiniteScroll from "react-infinite-scroll-component";
import H2SectionTitle from "../_shared/layout/h2SectionTitle";
import image from "@/public/static/images/comics/new_0.png";
import { useQuery } from "@tanstack/react-query";
import { getRequest } from "../utils/queries/requests";
import { Comic } from "@/helpers/types";

const HorizontalScroll = () => {
  const [actionItems, setActionItems] = useState([]);

  const fetchMoreData = () => {
    // Simulate API call
    setTimeout(() => {
      setActionItems((prevItems) => [...prevItems]);
    }, 1500);
  };
  const { data:genreList } = useQuery({
    queryKey: ["all_genres"],
    queryFn: () => getRequest("/genres/pull/list"),
  });

  const { data, isLoading, isFetching, isSuccess } = useQuery({
    queryKey: [`genre_action`],
    queryFn: () => getRequest(`/genres/comic/1/all?page=${1}&limit${2}`),
  });
  console.log(data)
  // jnfv
  useEffect(() => {
    if (isSuccess) {
      setActionItems(data?.data?.comics || []);
    }
  }, [isFetching, isLoading, data]);
  console.log(actionItems)
  return (
    <div className="parent-wrap py-10 block md:hidden " >
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
              hasMore={true}
              scrollableTarget="scrollable-div"
              loader={<h4>Loading...</h4>} // Add a loader
              className="horizontal-scroll"
            >
              {actionItems.map((_:Comic, index) => (
                <div
                  key={index}
                  className={`scroll-item`}
                  style={{
                    backgroundImage: `url(${_?.coverImage})`,
                    backgroundRepeat: "no-repeat",
                    backgroundSize: "cover",
                    backgroundPosition:"center"
                  }}
                ></div>
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
              dataLength={actionItems.length}
              next={fetchMoreData}
              hasMore={true}
              scrollableTarget="scrollable-div"
              loader={<h4>Loading...</h4>} // Add a loader
              className="horizontal-scroll"
            >
              {actionItems.map((_:Comic, index) => (
                <div
                  key={index}
                  className={`scroll-item`}
                  style={{
                    backgroundImage: `url(${image.src})`,
                    backgroundRepeat: "no-repeat",
                    backgroundSize: "cover",
                  }}
                ></div>
              ))}
            </InfiniteScroll>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HorizontalScroll;
