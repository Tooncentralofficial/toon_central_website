import { getRequestProtected } from "@/app/utils/queries/requests";
import { selectAuthState } from "@/lib/slices/auth-slice";
import { useQuery } from "@tanstack/react-query";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import NotFound from "./notFound";
import { formatDate, parseArray } from "@/helpers/parsArray";
import Image from "next/image";
import { optimizeCloudinaryUrl } from "@/app/utils/imageUtils";
import { SolidPrimaryButton } from "@/app/_shared/inputs_actions/buttons";
import Link from "next/link";
import PaginationCustom from "@/app/_shared/sort/pagination";
import LoadingLibraryItems from "./loadingLibraryItem";
import { usePathname } from "next/navigation";
const MyFavourites = () => {
  const [loading, setLoading] = useState(true);
  const pathname = usePathname();
  const [comics, setComics] = useState<any[]>([]);
  const [pagination, setPagination] = useState({ page: 1, total: 1 });
  const { token } = useSelector(selectAuthState);
  // const { data, isLoading, isFetching, isSuccess } = useQuery({
  //   queryKey: [`my_library`, pagination],
  //   queryFn: () =>
  //     getRequestProtected(
  //       `/my-libraries/comics?page=${pagination.page}&limit=6`,
  //       token,
  //       pathname
  //     ),
  //   enabled: token !== null,
  // });
  const { data, isLoading, isFetching, isSuccess } = useQuery({
    queryKey: [`my_likes`],
    queryFn: () => getRequestProtected(`/user-likes`, token, pathname),
    enabled: token !== null,
    refetchOnWindowFocus: true,
  });
  useEffect(() => {
    if (isSuccess) {
      setComics(parseArray(data?.data));
      setPagination((prevState) => ({
        page: data?.data?.pagination?.currentPage || 1,
        total: data?.data?.pagination?.totalPages || 1,
      }));
    }
  }, [isFetching, isLoading, data]);
  const changePage = (page: number) => {
    setPagination((prevState) => ({
      ...prevState,
      page: page,
    }));
  };

  useEffect(() => {
    !isLoading && setTimeout(() => setLoading(false), 500);
  }, [isLoading, isFetching]);
  return (
    <div>
      <div className="flex items-center h-full justify-between lg:justify-end gap-6 mb-[60px]">
        <div className="flex flex-col h-full w-full items-center justify-center">
          {loading && <LoadingLibraryItems />}
          {!loading && comics.length != 0 && (
            <>
              <div className="w-full flex flex-col gap-8 ">
                {comics?.map((item: any, i: number) => (
                  <div
                    key={i}
                    className="flex flex-col gap-[18px] bg-[var(--bg-secondary)] rounded-[8px] p-6 lg:p-9"
                  >
                    <div className=" flex gap-6">
                      <div className="base:w-full sm:w-[30%] min-w-[120px] max-w-[241px] h-[140px] md:h-[271px] rounded-lg overflow-hidden">
                        <Image
                          src={optimizeCloudinaryUrl(
                            item?.comic?.cover_image ??
                              item?.comic?.background_image ??
                              ""
                          )}
                          alt={`${item?.comic?.title || "toon_central"}`}
                          width={200}
                          height={271}
                          style={{
                            objectFit: "cover",
                            maxWidth: "100%",
                            width: "100%",
                            height: "100%",
                          }}
                        />
                      </div>
                      <div className="w-[80%] ">
                        <p className="text-gray font-bold mb-2">
                          Continue reading
                        </p>
                        <p className="text-2xl font-semibold lg:text-4xl uppercase">
                          {item?.comic?.title}
                        </p>
                        <div className="flex flex-col sm:flex-row text-gray text-xs md:text-base gap-1 sm:gap-6 justify-between w-full max-w-[460px] py-3">
                          <span>
                            {" "}
                            Published : {formatDate(item?.comic?.created_at)}
                          </span>
                          <span>
                            {" "}
                            Published : {formatDate(item?.comic?.updated_at)}
                          </span>
                          {/* <span>
                            {" "}
                            Episodes :{" "}
                            {parseArray(item?.comic?.episodes).length}
                          </span> */}
                        </div>

                        <div className="hidden md:block ">
                          <p className="text-gray text-lg mb-7">
                            {item?.comic?.description}
                          </p>
                          <SolidPrimaryButton
                            className="w-max bg-gradient-to-r from-[#00A96E] to-[#22C55E] lg:w-[13rem]"
                            disabled={item?.comic?.uuid}
                            as={Link}
                            href={`/comics/${item?.comic?.uuid}`}
                          >
                            Read
                          </SolidPrimaryButton>
                        </div>
                      </div>
                    </div>
                    <div className="md:hidden ">
                      <p className="text-gray text-base mb-7">
                        {item?.comic?.description}
                      </p>
                      <SolidPrimaryButton
                        className="w-max"
                        disabled={item?.comic?.uuid}
                        as={Link}
                        href={`/user/library/books?uuid=${item?.comic?.uuid}&id=${item?.comic?.id}`}
                      >
                        Add EPISODE
                      </SolidPrimaryButton>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}
          {!loading && comics.length == 0 && <NotFound />}
        </div>
      </div>
      <PaginationCustom
        onChange={changePage}
        total={pagination.total}
        page={pagination.page}
      />
    </div>
  );
};

export default MyFavourites;
