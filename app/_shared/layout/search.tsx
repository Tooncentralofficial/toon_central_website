import {
  Button,
  Divider,
  Input,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  Spinner,
} from "@nextui-org/react";
import { SearchIcon } from "../icons/icons";
import { useEffect, useState } from "react";
import { getRequest } from "@/app/utils/queries/requests";
import { parseArray } from "@/helpers/parsArray";
import { useQuery } from "@tanstack/react-query";
import Link from "next/link";
import { usePathname } from "next/navigation";


export interface ModalBaseProps{
  isOpen: boolean;
  onClose: () => void;
  onOpenChange: () => void;
}
//TODO:export
const SearchModal = ({
  isOpen,
  onOpenChange,
  onClose,
}: ModalBaseProps) => {
  const pathname = usePathname();
  const [filter, setFilter] = useState({
    page: 1,
    limit: 10,
    search: "",
  });
  const [searched, setSearched] = useState<any[]>([]);

  const { data, isSuccess, isLoading } = useQuery({
    queryKey: ["search", filter],
    queryFn: () =>
      getRequest(
        `/search?query=${filter.search}&page=${filter.page}&limit=${filter.limit}`
      ),
  });
  useEffect(() => {
    if (isSuccess) {
      setSearched(parseArray(data?.data?.comics));
    }
  }, [isSuccess, data, isLoading]);
  const handleSearch = (e: any) => {
    setFilter((prev) => ({
      ...prev,
      search: e.target.value,
    }));
  };
  useEffect(() => {
    onClose();
  }, [pathname]);
  return (
    <Modal isOpen={isOpen} onOpenChange={onOpenChange} placement="center">
      <ModalContent>
        {(onClose) => (
          <>
            <ModalHeader className="flex flex-col gap-1"></ModalHeader>
            <ModalBody>
              <Input
                autoFocus
                value={filter.search}
                onChange={handleSearch}
                size="lg"
                labelPlacement="outside"
                aria-label="search comic"
                endContent={isLoading ? <Spinner size="sm" /> : <SearchIcon />}
                // label="Email"
                placeholder="Search Comic"
                variant="bordered"
              />
              <Divider />
              <div className="flex flex-col gap-2 max-h-[40vh] overflow-y-auto">
                {searched.map((item, i) => (
                  <div key={i} className="h-[48px] w-full">
                    <Button
                      as={Link}
                      size="lg"
                      className="w-full"
                      href={`${
                        item?.uuid
                          ? `/comics/${item?.title}?uid=${item?.uuid}`
                          : ""
                      }`}
                    >
                      {item?.title}
                    </Button>
                  </div>
                ))}
              </div>
            </ModalBody>
            <ModalFooter></ModalFooter>
          </>
        )}
      </ModalContent>
    </Modal>
  );
};

export default SearchModal;
