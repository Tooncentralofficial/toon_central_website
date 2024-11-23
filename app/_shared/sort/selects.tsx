import { Select, SelectProps } from "@nextui-org/react";
import { Calendar } from "../icons/icons";

const SelectFilter = ({ ...props }: SelectProps) => {
  return (
    <Select
      {...props}
      labelPlacement="outside"
      radius="sm"
      aria-label="sort by"
      placeholder={props.placeholder||"Sort"}
      className={`max-w-[150px] ${props.className}`}
      classNames={{
        trigger: "capitalize bg-[var(--bg-secondary)]",
        popoverContent: "bg-[var(--bg-secondary)]",
        ...props.classNames
      }}
      listboxProps={{
        itemClasses: {
          base: "capitalize data-[selectable=true]:focus:bg-[var(--green100)]",
        },
      }}
      
    >
      {props.children}
    </Select>
  );
};

export default SelectFilter;
