"use client";
import { Input, InputProps, Select, SelectProps } from "@nextui-org/react";
import { useFormikContext } from "formik";

export const InputOutline = ({ ...InputProps }: InputProps) => {
  return (
    <Input
      {...InputProps}
      variant="bordered"
      size="lg"
      classNames={{
        innerWrapper: "bg-[var(--bg-secondary)]",
        input: "text-[#9FA6B2] bg-[var(--bg-secondary)] text-sm",
      }}
    />
  );
};

export const InputSolid = ({ ...InputProps }: InputProps) => {
  return (
    <Input
      {...InputProps}
      variant="flat"
      size="lg"
      classNames={{
        inputWrapper: "bg-[#D9D9D9]",
        input: "text-black bg-[#D9D9D9] text-sm",
      }}
    />
  );
};

export const ProfileInputLg = ({ ...InputProps }: HTMLInputElement) => {
  return (
    <div className="flex justify-between items-center bg-[#FBFBFB] p-4 rounded-[12px]">
      <div className="flex flex-col gap-2 min-w-[50%]">
        <label className="text-[#272727]">Username</label>
        <input
          name="username"
          aria-label="username"
          placeholder="Enter username"
          className="text-[#000000] bg-[#FBFBFB] outline-none"
        />
      </div>

      {/* <Button
      variant="bordered"
      className="border-[#EAEAEA] text-[#272727]"
    >
      Edit
    </Button> */}
    </div>
  );
};
// export const SelectSolid = ({ ...InputProps }: InputProps) => {
//   return <Select {...InputProps} variant="flat" size="lg" classNames={{
//     inputWrapper:"bg-[#D9D9D9]",
//     input:"text-[#000000] bg-[#D9D9D9] text-sm"
//   }} >
//     {InputProps.children}
//   </Select>;
// };

interface CustomInputProps {
  label: string;
  name: string;
  type?: string;
  placeholder?: string;
  value: any;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onBlur?: (e: React.FocusEvent<HTMLInputElement>) => void;
  error?:boolean;
}

export const FlatInput: React.FC<CustomInputProps> = ({
  label,
  name,
  type = "text",
  placeholder = `Add ${label.toLowerCase()}`,
  value,
  onChange,
  onBlur,
  error,
}) => {
  return (
    <div  className="w-full flex flex-col gap-1.5">
      <label>{label}</label>
      <div
        className={`w-full rounded-[8px] overflow-hidden border ${
          error ? "border-danger" : "border-transparent"
        }`}
      >
        <input
          type={type}
          name={name}
          value={value}
          onChange={onChange}
          onBlur={onBlur}
          className={`w-full py-[10px] px-6 bg-[#D9D9D9] rounded-[8px] text-[#8C8C8C] focus:text-[#000000]`}
          placeholder={placeholder}
        />
      </div>
      {/* {Boolean(error) && <div className="text-danger">{error}</div>} */}
    </div>
  );
};

interface CustomTextareaProps {
  label: string;
  name: string;
  placeholder?: string;
  value: any; // Type for the textarea value
  onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void; // onChange handler
  onBlur?: (e: React.FocusEvent<HTMLTextAreaElement>) => void; // onBlur handler (optional)
  error?: boolean; // Error message (optional)
}

export const FlatTextarea: React.FC<CustomTextareaProps> = ({
  label,
  name,
  placeholder = `Add ${label.toLowerCase()}`,
  value,
  onChange,
  onBlur,
  error,
}) => {
  return (
    <div className="flex flex-col gap-1.5">
      <label>{label}</label>
      <div
        className={`w-full rounded-[8px] overflow-hidden border ${
          error ? 'border-danger' : 'border-transparent'
        }`}
      >
        <textarea
          name={name}
          value={value}
          onChange={onChange}
          onBlur={onBlur}
          className={`w-full py-[10px] px-6 bg-[#D9D9D9] align-top rounded-[8px] text-[#8C8C8C] focus:text-[#000000]`}
          placeholder={placeholder}
          style={{ maxHeight: '180px', minHeight: '120px', resize: 'vertical' }}
        />
      </div>
      {/* {error && <div className="text-danger">{error}</div>} */}
    </div>
  );
};

export const FlatSelect = ({ ...props }: SelectProps) => {
  return (
    <Select
      {...props}
      labelPlacement="outside"
      size="lg"
      radius="sm"
      classNames={{
        innerWrapper: "bg-[#D9D9D9]",
        listboxWrapper: "bg-[#D9D9D9]",
        trigger: "bg-[#D9D9D9] ",
        value:"group-data-[has-value=true]:text-[#000000]"

      }}
      listboxProps={{
        itemClasses: {
          base: ["text-[#000]"],
        },
      }}
    >
      {props.children}
    </Select>
  );
};