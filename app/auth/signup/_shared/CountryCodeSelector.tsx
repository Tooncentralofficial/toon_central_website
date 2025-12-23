"use client";

import { Select, SelectItem, SelectProps } from "@nextui-org/react";
import Image from "next/image";

interface Country {
  id: number;
  name: string;
  dial_code: string;
  flag: string;
}

interface CountryCodeSelectorProps extends Omit<SelectProps, "children"> {
  countries: Country[];
  value?: string | number;
  onChange?: (value: any) => void;
}

export const CountryCodeSelector = ({
  countries = [],
  value,
  onChange,
  ...props
}: CountryCodeSelectorProps) => {
  const selectedCountry = countries.find(
    (country) => country.id.toString() === value?.toString()
  );


  return (
    <div className="relative">
      <Select
        {...props}
        labelPlacement="outside"
        size="lg"
        variant="bordered"
        selectedKeys={value ? new Set([value.toString()]) : new Set()}
        onSelectionChange={(keys) => {
          const selectedKey = Array.from(keys)[0] as string;
          if (selectedKey) {
            onChange?.(selectedKey);
          } else {
            onChange?.("");
          }
        }}
        classNames={{
          innerWrapper: "bg-[var(--bg-secondary)]",
          trigger: "bg-[var(--bg-secondary)]",
          popoverContent: "bg-[var(--bg-secondary)]",
          value: selectedCountry ? "opacity-0" : "text-[#9FA6B2] text-sm",
        }}
        selectionMode="single"
      >
        {countries.map((country) => (
          <SelectItem
            key={country.id.toString()}
            value={country.id.toString()}
            textValue={`${country.name} ${country.dial_code}`}
          >
            <div className="flex items-center gap-2">
              {/* {country.flag && (
                <Image
                  src={country.flag}
                  alt={country.name}
                  width={20}
                  height={15}
                  className="object-contain rounded-full"
                />
              )} */}
              <span>{country.name}</span>
              <span className="text-[#9FA6B2] ml-auto">
                {country.dial_code}
              </span>
            </div>
          </SelectItem>
        ))}
      </Select>
      {selectedCountry && (
        <div className="absolute left-3 top-1/2 -translate-y-1/2 flex items-center gap-2 pointer-events-none z-10">
          {/* {selectedCountry.flag && (
            <Image
              src={selectedCountry.flag}
              alt={selectedCountry.name}
              width={20}
              height={15}
              className="object-contain rounded-full"
            />
          )} */}
          <span className="text-[#9FA6B2] text-sm">
            {selectedCountry.dial_code}
          </span>
        </div>
      )}
    </div>
  );
};
