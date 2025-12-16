import PaginationCustom from '@/app/_shared/sort/pagination';
import React, { useEffect, useState } from 'react'
import NotFound from './notFound';
import { SolidPrimaryButton } from '@/app/_shared/inputs_actions/buttons';
import { Button } from '@nextui-org/react';
import { usePathname } from 'next/navigation';
import { useSelector } from 'react-redux';
import { selectAuthState } from '@/lib/slices/auth-slice';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { deleteRequestProtected, getRequestProtected } from '@/app/utils/queries/requests';
import { toast } from 'react-toastify';
import { formatDate, parseArray } from '@/helpers/parsArray';
import LoadingLibraryItems from './loadingLibraryItem';
import Image from 'next/image';
import Link from 'next/link';
import { DeleteIcon, PlayIcon } from '@/app/_shared/icons/icons';
import { Butterfly_Kids } from 'next/font/google';
import Loading from '@/app/loading';
import IconLoader from '@/app/_shared/icon_loader';

function LibraryShorts({ tabName }: { tabName: string }) {
 const [loading, setLoading] = useState(true);
  const pathname = usePathname();
  const [shorts, setShorts] = useState<any[]>([]);
  const [pagination, setPagination] = useState({ page: 1, total: 1 });
  const [deletingShort, setDeletingShort] = useState<string | null>(null);
  const { token } = useSelector(selectAuthState);
  const queryKey = "delete_short"
  const queryClient = useQueryClient()
  const { data, isLoading, isFetching, isSuccess } = useQuery({
    queryKey: [`my_shorts`, pagination, tabName],
    queryFn: () => getRequestProtected(`my-libraries/shorts`, token, pathname),
    enabled: token !== null,
  });

  const { mutate: deleteShort } = useMutation({
    mutationKey: [queryKey],
    mutationFn: (shortId: string) =>
      deleteRequestProtected(
        `/my-libraries/shorts/${shortId}/delete`,
        token,
        pathname
      ),
    onSuccess(data, variables, context) {
      console.log(data);
      const { success, message, data: resData } = data;
      if (success) {
        toast(message, {
          toastId: "comic_Delete",
          type: "success",
        });
        queryClient.invalidateQueries({
          queryKey: ["my_shorts", pagination, tabName],
        });
        return;
      } else {
        toast(message, {
          toastId: "comic_delete",
          type: "error",
        });
      }
    },
    onError(error, variables, context) {
      console.log(error);
      toast("Some error occured. Contact help !", {
        toastId: "comic_delete",
        type: "error",
      });
    },
    onSettled() {
      setDeletingShort(null);
    },
  });
  useEffect(() => {
    if (isSuccess) {
      setShorts(parseArray(data?.data?.shorts));
      setPagination((prevState) => ({
        page: data?.data?.pagination?.currentPage || 1,
        total: data?.data?.pagination?.totalPages || 1,
      }));
    }
  }, [isFetching, isLoading, data,tabName]);
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
          {!loading && shorts.length != 0 && (
            <>
              <div className="w-full flex flex-col gap-8 ">
                {shorts?.map((item: any, i: number) => (
                  <div
                    key={i}
                    className="flex flex-col gap-[18px] bg-[var(--bg-secondary)] rounded-[8px] p-6 lg:p-9"
                  >
                    <div className=" flex gap-6">
                      <div className="base:w-full sm:w-[30%] min-w-[120px] max-w-[241px] h-[140px] md:h-[271px] rounded-lg overflow-hidden relative">
                        <div className="absolute top-0 left-0 w-full h-full  inset-0 flex justify-center items-center">
                          <PlayIcon className="w-10 h-10 text-white opacity-70" />{" "}
                        </div>
                        <video
                          src={item?.upload}
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
                      <div className="w-[80%]  relative">
                        <p className="text-gray font-bold mb-2">
                          {tabName === "shorts"
                            ? "Continue Uplpoading"
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
                              className="w-max bg-gradient-to-r from-[#00A96E] to-[#22C55E] "
                              disabled={item?.uuid}
                              as={Link}
                              href={`/user/library/books?uuid=${item.uuid}&id=${item.id}`}
                            >
                              Add Shorts
                            </SolidPrimaryButton>
                            {/* <Button
                              onClick={() => {
                                setDeletingComic(item.id);
                                deleteComic(item?.id);
                              }}
                              className=" rounded-lg bg-default-300"
                              size="lg"
                              isLoading={deletingComic === item?.id}
                            >
                              Delete
                            </Button> */}
                          </div>
                        </div>
                        <div
                          className=" absolute top-2 right-2"
                          id="deleteButton"
                        >
                          <button
                            className="bg-[#20324C] p-3 rounded-lg flex items-center justify-center"
                            onClick={() => {
                              console.log(item.uuid);
                              setDeletingShort(item.id);
                              deleteShort(item?.uuid);
                            }}
                          >
                            {deletingShort === item?.id ? (
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
                          className="w-max bg-gradient-to-r from-[#00A96E] to-[#22C55E] lg:w-[13rem]"
                          disabled={item?.uuid}
                          as={Link}
                          href={`/user/library/books?uuid=${item.uuid}&id=${item.id}`}
                        >
                          Add Shorts
                        </SolidPrimaryButton>
                      </div>
                      <div className="">
                        <Button
                          onClick={() => {
                            console.log(item.uuid);
                            setDeletingShort(item.id);
                            deleteShort(item?.uuid);
                          }}
                          className=" rounded-lg bg-default-300 "
                          isLoading={deletingShort === item?.id}
                        >
                          <DeleteIcon className="w-6 h-6 text-[#FF1010]" />
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}
          {!loading && shorts.length == 0 && <NotFound />}
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


export default LibraryShorts