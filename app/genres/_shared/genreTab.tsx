import CardTitleOutside from "@/app/_shared/cards/cardTitleOutside";
import LoadingTitleOutside from "@/app/_shared/cards/loadingTitleOutside";
import PaginationCustom from "@/app/_shared/sort/pagination";
import { dummyItems } from "@/app/_shared/data";
import { getRequest } from "@/app/utils/queries/requests";
import { Tab, Tabs } from "@nextui-org/react";
import { useQuery } from "@tanstack/react-query";
import React, { useEffect, useState } from "react";

const GenreTab = ({ selectedTab }: { selectedTab: number | null }) => {
  const [comics, setComics] = useState([]);
  const [pagination, setPagination] = useState({ page: 1, total: 1 });
  const { data, isLoading, isFetching, isSuccess } = useQuery({
    queryKey: [`genre_${selectedTab}`, selectedTab, pagination.page],
    queryFn: () => getRequest(`/genres/comic/${selectedTab}/all?page=${pagination.page}&limit=10`),
    enabled: selectedTab !== null,
  });

  // Reset to page 1 when genre changes
  useEffect(() => {
    setPagination({ page: 1, total: 1 });
  }, [selectedTab]);

  useEffect(() => {
    if (isSuccess) {
      setComics(data?.data?.comics || []);
      setPagination((prev) => ({
        ...prev,
        total: data?.data?.pagination?.totalPages || 1,
      }));
    }
  }, [isFetching, isLoading, data, selectedTab]);
  const categories = [
    {
      label: "Completed",
    },
    {
      label: "Ongoing",
    },
  ];

  return (
    <div>
      <div className="flex items-center justify-between lg:justify-end gap-6">
        <div>
          {/* <Tabs
          aria-label="genres_tab"
          items={categories}
          classNames={{
            tabList: "bg-[var(--bg-secondary)] px-2.5 py-2.5 ",
            tab: "text-[#FCFCFD] h-[40px]",
            cursor: "w-full h-full group-data-[selected=true]:bg-[var(--bg-tab-cursor)]",
            tabContent: "px-4 py-0",
          }}
          onSelectionChange={(tab: React.Key) => {
            console.log(tab);
          }}
        >
          {categories.map((item, i) => (
            <Tab className="p-0" key={item.label} title={item.label} />
          ))}
        </Tabs> */}
        </div>
        <div></div>
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-5 mt-5">
        {isLoading ? (
          dummyItems.map((item: number, i: number) => <LoadingTitleOutside key={i} />)
        ) : (
          <>
            {comics?.length > 0 ? (
              <>
                {" "}
                {comics.map((item: any, i: number) => (
                  <div key={i}>
                    <CardTitleOutside cardData={item} index={i} />
                  </div>
                ))}
              </>
            ) : (
              dummyItems.map((item: number, i: number) => <LoadingTitleOutside key={i} />)
            )}
          </>
        )}
      </div>
      {pagination.total > 1 && (
        <PaginationCustom
          className="mt-[60px]"
          onChange={(page: number) => setPagination((prev) => ({ ...prev, page }))}
          total={pagination.total}
          page={pagination.page}
        />
      )}
    </div>
  );
};

export default GenreTab;
