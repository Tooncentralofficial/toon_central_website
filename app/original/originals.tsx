"use client";

import { Select, SelectItem, Tab, Tabs } from "@nextui-org/react";
import CardTitleOutside from "../_shared/cards/cardTitleOutside";
import PaginationCustom from "../_shared/sort/pagination";
import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { getRequest } from "../utils/queries/requests";
import { dummyItems } from "../_shared/data";
import LoadingTitleOutside from "../_shared/cards/loadingTitleOutside";
import { Filters, SelectFilters } from "../_shared/sort/filters";
import SelectFilter from "../_shared/sort/selects";

export default function Originals() {
  const [pagination, setPagination] = useState({ page: 1, total: 1 });
  const [filter, setFilter] = useState<Filters>("all");
  const categories = [
    {
      label: "Completed",
    },
    {
      label: "Ongoing",
    },
  ];
  const [comics, setComics] = useState([]);
  const { data, isLoading, isFetching, isSuccess } = useQuery({
    queryKey: ["all_originals", pagination.page, filter],
    queryFn: () =>
      getRequest(
        `/originals/pull/all?filter=${filter}&page=${pagination.page}&limit=30`
      ),
  });
  useEffect(() => {
    if (isSuccess) {
      setComics(data?.data?.comics || []);
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
  const handleSelectionChange = (e: any) => {
    setFilter(e.target.value);
  };
  return (
    <div className="parent-wrap py-10">
      <div className="child-wrap min-h-screen  w-full">
        <div className="flex items-center justify-end lg:justify-between gap-5 lg:gap-6">
          <div>
            <Tabs
              aria-label="genres_tab"
              items={categories}
              classNames={{
                tabList: "bg-[var(--bg-secondary)] px-2.5 py-2.5 ",
                tab: "text-[#FCFCFD] h-[40px]",
                base: "hidden lg:inline-flex",
                cursor:
                  "w-full h-full group-data-[selected=true]:bg-[var(--bg-tab-cursor)]",
                tabContent: "px-4 py-0",
                // tabContent: "group-data-[selected=true]:text-[#06b6d4]"
              }}
              // onSelectionChange={(tab: React.Key) => {
              //   console.log(tab);
              // }}
            >
              {categories.map((item, i) => (
                <Tab className="p-0" key={item.label} title={item.label} />
              ))}
            </Tabs>
          </div>
          <SelectFilter
            className="lg:hidden"
            selectedKeys={[filter]}
            onChange={handleSelectionChange}
          >
            {categories.map((filter, i) => (
              <SelectItem key={filter.label}>{filter.label}</SelectItem>
            ))}
          </SelectFilter>
          <SelectFilter
            selectedKeys={[filter]}
            onChange={handleSelectionChange}
          >
            {SelectFilters.map((filter, i) => (
              <SelectItem key={filter}>{filter}</SelectItem>
            ))}
          </SelectFilter>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-5 mt-5 mb-[60px]">
          {isLoading ? (
            dummyItems.map((item, i) => <LoadingTitleOutside key={i} />)
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
                dummyItems.map((item, i) => <LoadingTitleOutside key={i} />)
              )}
            </>
          )}
        </div>
        <PaginationCustom
          onChange={changePage}
          total={pagination.total}
          page={pagination.page}
        />
      </div>
    </div>
  );
}
