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
import { useEffect, useRef, useState } from "react";
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
  const [searchInput, setSearchInput] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [searched, setSearched] = useState<any[]>([]);
  const debounceRef = useRef<NodeJS.Timeout>();

  const handleSearch = (e: any) => {
    const value = e.target.value;
    setSearchInput(value);
    clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      setDebouncedSearch(value);
    }, 300);
  };

  const { data, isSuccess, isLoading } = useQuery({
    queryKey: ["search", debouncedSearch],
    queryFn: () =>
      getRequest(
        `/search?query=${debouncedSearch}&page=1&limit=10`
      ),
    enabled: debouncedSearch.length >= 2,
  });
  useEffect(() => {
    if (isSuccess) {
      setSearched(parseArray(data?.data?.comics));
    }
    if (debouncedSearch.length < 2) {
      setSearched([]);
    }
  }, [isSuccess, data, isLoading, debouncedSearch]);
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
                value={searchInput}
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
                {searched.map((item: any, i: number) => (
                  <div key={i} className="h-[48px] w-full">
                    <Button
                      as={Link}
                      size="lg"
                      className="w-full"
                      href={`${
                        item?.uuid
                          ? `/comics/${item?.uuid}`
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
