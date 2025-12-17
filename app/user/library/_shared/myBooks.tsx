import {
  deleteRequestProtected,
  getRequestProtected,
} from "@/app/utils/queries/requests";
import { selectAuthState } from "@/lib/slices/auth-slice";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import NotFound from "./notFound";
import { formatDate, parseArray } from "@/helpers/parsArray";
import Image from "next/image";
import { SolidPrimaryButton } from "@/app/_shared/inputs_actions/buttons";
import Link from "next/link";
import PaginationCustom from "@/app/_shared/sort/pagination";
import LoadingLibraryItems from "./loadingLibraryItem";
import { usePathname } from "next/navigation";
import { Button } from "@nextui-org/react";
import { toast } from "react-toastify";
import IconLoader from "@/app/_shared/icon_loader";
import { DeleteIcon } from "@/app/_shared/icons/icons";

const MyBooksTab = ({tabName}: {tabName: string}) => {
  const [loading, setLoading] = useState(true);
  const pathname = usePathname();
  const [comics, setComics] = useState<any[]>([]);
  const [pagination, setPagination] = useState({ page: 1, total: 1 });
  const [deletingComic, setDeletingComic] = useState<string | null>(null);
  const { token } = useSelector(selectAuthState);
  const queryKey = "delete_comic"
  const queryClient = useQueryClient()
  const { data, isLoading, isFetching, isSuccess } = useQuery({
    queryKey: [`my_library`, pagination],
  queryFn: () =>
      getRequestProtected(
        `/my-libraries/comics?page=${pagination.page}&limit=6`,
        token,
        pathname
      ),
    enabled: !!token,
  });

  const { mutate: deleteComic} = useMutation({
    mutationKey: [queryKey],
    mutationFn: (id) =>
      deleteRequestProtected(
        `/my-libraries/comics/${id}/delete`,
        token,
        pathname
      ),
    onSuccess(data, variables, context) {
      const { success, message, data: resData } = data;
      if (success) {
        toast(message, {
          toastId: "comic_Delete",
          type: "success",
        });
        queryClient.invalidateQueries({
          queryKey: ['my_library'],
        });
        return
      } else {
        toast(message, {
          toastId: "comic_delete",
          type: "error",
        });
      }
    },
    onError(error, variables, context) {
      toast("Some error occured. Contact help !", {
        toastId: "comic_delete",
        type: "error",
      });
    },
    onSettled(){
      setDeletingComic(null)
    }
  });
  useEffect(() => {
    if (isSuccess) {
      setComics(parseArray(data?.data?.comics));
      setPagination((prevState) => ({
        page: data?.data?.pagination?.currentPage || 1,
        total: data?.data?.pagination?.totalPages || 1,
      }));
    }
  }, [isFetching, isLoading, data, tabName]);
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
                {comics?.map((item, i) => (
                  <div
                    key={i}
                    className="flex flex-col gap-[18px] bg-[var(--bg-secondary)] rounded-[8px] p-6 lg:p-9"
                  >
                    <div className=" flex gap-6">
                      <div className="base:w-full sm:w-[30%] min-w-[120px] max-w-[241px] h-[140px] md:h-[271px] rounded-lg overflow-hidden">
                        <Image
                          src={`${
                            item?.coverImage || item?.backgroundImage || ""
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
                      <div className="w-[80%] relative">
                        <p className="text-gray font-bold mb-2">
                          {tabName === "books"
                            ? "Continue Editing"
                            : "Continue reading"}
                        </p>
                        <p className="text-2xl font-semibold lg:text-4xl uppercase">
                          {item?.title}
                        </p>
                        <div className="flex flex-col sm:flex-row text-gray text-xs md:text-base gap-1 sm:gap-6 justify-between w-full max-w-[460px] py-3">
                          <span>
                            {" "}
                            Published : {formatDate(item?.createdAt)}
                          </span>
                          <span>
                            {" "}
                            Published : {formatDate(item?.updatedAt)}
                          </span>
                          <span>
                            {" "}
                            Episodes : {parseArray(item?.episodes).length}
                          </span>
                        </div>

                        <div className="hidden md:block ">
                          <p className="text-gray text-lg mb-7">
                            {item?.description}
                          </p>
                          <div className="flex gap-14">
                            <SolidPrimaryButton
                              className="w-max bg-gradient-to-r from-[#00A96E] to-[#22C55E] lg:w-[13rem]"
                              disabled={item?.uuid}
                              as={Link}
                              href={`/user/library/books?uuid=${item.uuid}&id=${item.id}`}
                            >
                              Add Episode
                            </SolidPrimaryButton>
                            <SolidPrimaryButton
                              className="w-max bg-gradient-to-r from-[#00A96E] to-[#22C55E] lg:w-[13rem]"
                              disabled={item?.uuid}
                              as={Link}
                              href={`/user/library/books?uuid=${item.uuid}&id=${item.id}`}
                            >
                              Add Shorts
                            </SolidPrimaryButton>
                          </div>
                        </div>
                        <div
                          className=" absolute top-2 right-2"
                          id="deleteButton"
                        >
                          <button
                            className="bg-[#20324C] p-3 rounded-lg flex items-center justify-center"
                            onClick={() => {
                              setDeletingComic(item.id);
                              deleteComic(item?.id);
                            }}
                          >
                            {deletingComic === item?.id ? (
                              <IconLoader />
                            ) : (
                              <DeleteIcon className="w-6 h-6 text-[#FF1010]" />
                            )}
                          </button>
                        </div>
                      </div>
                    </div>
                    <div className="md:hidden ">
                      <p className="text-gray text-base mb-7">
                        {item?.description}
                      </p>
                      <div>
                        <SolidPrimaryButton
                          className="w-max"
                          disabled={item?.uuid}
                          as={Link}
                          href={`/user/library/books?uuid=${item.uuid}&id=${item.id}`}
                        >
                          Add EPISODE
                        </SolidPrimaryButton>
                      </div>
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

export default MyBooksTab;
