"use client";

import { getRequest } from "@/app/utils/queries/requests";
import { Select, SelectItem, SelectProps } from "@nextui-org/react";
import { useQuery } from "@tanstack/react-query";
import { useMemo } from "react";

interface MobileOperatorSelectProps extends Omit<SelectProps, "children"> {
  value?: string;
  onChange?: (value: any) => void;
}

interface operator {
  id: number;
  name: string;
  slug: string;
  createdAt: string;
  updatedAt: string;
}
export const MobileOperatorSelect = ({
  value,
  onChange,
  ...props
}: MobileOperatorSelectProps) => {
  const { data: mobileOperators } = useQuery({
    queryKey: ["mobile-operators"],
    queryFn: () => getRequest("selectables/mobile-operators"),
  });
  const OperatorsList = useMemo(() => {
    return mobileOperators?.data || [];
  }, [mobileOperators]);
  console.log("@@OperatorsList", OperatorsList);
  return (
    <Select
      {...props}
      labelPlacement="outside"
      size="lg"
      variant="bordered"
      selectedKeys={value ? new Set([value]) : new Set()}
      onSelectionChange={(keys) => {
        const selectedKey = Array.from(keys)[0] as string;
        if (selectedKey) {
          onChange?.(selectedKey);
        } else {
          onChange?.("");
        }
      }}
      selectionMode="single"
      classNames={{
        innerWrapper: "bg-[var(--bg-secondary)]",
        trigger: "bg-[var(--bg-secondary)]",
        popoverContent: "bg-[var(--bg-secondary)]",
        value: "text-[#9FA6B2] text-sm",
      }}
    >
      {OperatorsList.map((operator: operator) => (
        <SelectItem key={operator.id.toString()} value={operator.id.toString()}>
          {operator.name}
        </SelectItem>
      ))}
    </Select>
  );
};
