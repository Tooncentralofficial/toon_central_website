import { Select, SelectProps } from "@nextui-org/react";
import { Calendar } from "../icons/icons";

const SelectFilterClone = ({ ...props }: SelectProps) => {
  return (
    <Select
      {...props}
      labelPlacement="outside"
      radius="sm"
      aria-label="sort by"
      placeholder="Days"
      className="max-w-[150px]"
      classNames={{
        trigger: "capitalize bg-[var(--bg-secondary)]",
        popoverContent: "bg-[var(--bg-secondary)]",
      }}
      listboxProps={{
        itemClasses: {
          base: "capitalize data-[selectable=true]:focus:bg-[var(--green100)]",
        },
      }}
      startContent={
        <div>
          <Calendar />
        </div>
      }
    >
      {props.children}
    </Select>
  );
};

export default SelectFilterClone;
