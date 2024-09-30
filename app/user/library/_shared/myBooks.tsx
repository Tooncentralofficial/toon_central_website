
import { getRequestProtected } from "@/app/utils/queries/requests";
import { selectAuthState } from "@/lib/slices/auth-slice";
import { useQuery } from "@tanstack/react-query";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import NotFound from "./notFound";
import { formatDate, parseArray } from "@/helpers/parsArray";
import Image from "next/image";
import { SolidPrimaryButton } from "@/app/_shared/inputs_actions/buttons";
import Link from "next/link";
import PaginationCustom from "@/app/_shared/sort/pagination";

const MyBooksTab = () => {
  const [comics, setComics] = useState<any[]>([]);
  const [pagination, setPagination] = useState({ page: 1, total: 1 });
  const { token } = useSelector(selectAuthState);
  const { data, isLoading, isFetching, isSuccess } = useQuery({
    queryKey: [`my_library`,pagination],
    queryFn: () => getRequestProtected(`/my-libraries/comics?page=${pagination.page}&limit=6`, token),
    enabled:token!==null
  });
  
  useEffect(() => {
    if (isSuccess) {
      setComics(parseArray(data?.data?.comics ));
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
  return (
    <div>
      <div className="flex items-center h-full justify-between lg:justify-end gap-6 mb-[60px]">
        <div className="flex h-full w-full items-center justify-center">
          {comics?.length <= 0 ? (
            <NotFound />
          ) : (
            <div className="w-full flex flex-col gap-8 ">
              {comics?.map((item, i) => (
                <div key={i} className="bg-[var(--bg-secondary)] rounded-sm p-6 lg:p-9">
                  <div
                    className=" flex gap-6"
                  >
                    <div className="base:w-full sm:w-[30%] min-w-[120px] max-w-[241px] max-h-[120px] sm:max-h-unset rounded-lg overflow-hidden">
                      <Image
                        src={`${
                          item?.backgroundImage || item?.coverImage || ""
                        }`}
                        alt={`${item?.title || "toon_central"}`}
                        width={200}
                        height={271}
                        style={{
                          objectFit: "cover",
                          maxWidth: "100%",
                          width: "100%",
                          height: "100%",
                        }}
                        unoptimized
                      />
                    </div>
                    <div className="w-[80%] ">
                      <p className="text-gray font-bold mb-2">
                        Continue writing
                      </p>
                      <p className="text-2xl font-semibold lg:text-4xl uppercase">
                        {item?.title}
                      </p>
                      <div className="hidden sm:flex flex-col sm:flex-row text-gray gap-1 sm:gap-6 justify-between w-full max-w-[460px] py-3">
                        <span> Published : {formatDate(item?.createdAt)}</span>
                        <span> Published : {formatDate(item?.updatedAt)}</span>
                        <span>
                          {" "}
                          Episodes : {parseArray(item?.episodes).length}
                        </span>
                      </div>

                      <div className="hidden lg:block text-lg">
                        <p className="text-gray">{item?.description}</p>
                      </div>
                    </div>
                  </div>

                  <div className="flex sm:hidden text-gray gap-1 sm:gap-6 justify-between w-full max-w-[460px] pt-3">
                    <span> Published : {formatDate(item?.createdAt)}</span>
                    <span> Published : {formatDate(item?.updatedAt)}</span>
                    <span> Episodes : {parseArray(item?.episodes).length}</span>
                  </div>

                  <div className="block lg:block text-lg mt-3">
                    <p className="text-gray">{item?.description}</p>
                    <div className="w-[100px] mt-3">

                    <SolidPrimaryButton disabled={item?.uuid} as={Link} href={`/user/library/books?uuid=${item.uuid}&id=${item.id}`}>Add a part</SolidPrimaryButton></div>
                  </div>
                </div>
              ))}
            </div>
          )}
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

export default MyBooksTab;
