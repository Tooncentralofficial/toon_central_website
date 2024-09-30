import { parseImageSrc } from "@/helpers/parseImage";
import DragNDropTyped from "../forms/dragNdrop";
import { UploadIcon } from "../icons/icons";
import { RoundUploadIcon } from "../icons/icons";
import { Skeleton } from "@nextui-org/react";
import { useState } from "react";
const fileTypes = ["PNG", "jpeg", "JPEG", "JPG"];
const InputPicture = ({
  formik,
  fieldName,
  fieldError,
  submitOnChange,
  isLoading,
  onChange,
  variant = "empty",
  emptyPlaceholder = "Upload Image file or drag and drop",
  placeholder = "Add new",
}: {
  formik: any;
  fieldName: any;
  submitOnChange?: boolean;
  onChange?: (file: File) => void;
  isLoading?: boolean;
  fieldError?: boolean;
  variant?: "empty" | "add" | "upload";
  emptyPlaceholder?: React.ReactNode;
  placeholder?: React.ReactNode;
}) => {
  const MAX_SIZE = 5;
  const [sizeError,setSizeError]=useState(false)
  const { src, isFile } = parseImageSrc(formik.values[fieldName]);
  // let src = formik.values[fieldName]
  //   ? typeof formik.values[fieldName] === "string" &&
  //     formik.values[fieldName]?.startsWith("https:")
  //     ? formik.values[fieldName]
  //     : URL.createObjectURL(formik.values[fieldName])
  //   : "";

  const handleChange = (file: any) => {
    setSizeError(false)
    if (onChange) {
      onChange(file);
    } else {
      formik.setFieldValue(fieldName, file);
    }
    if (submitOnChange) {
      formik.handleSubmit();
    }
  };
  const isError = fieldError ? fieldError : Boolean(formik?.errors[fieldName]);
  const Icon = () => {
    switch (variant) {
      case "empty":
        return "";
      case "add":
        return <RoundUploadIcon />;
      case "upload":
        return <UploadIcon />;
      default:
        return "";
    }
  };
  const SizeWarning = () => <span className={`text-sm  ${sizeError?"text-danger":"text-gray"}`}>Max size is {MAX_SIZE}MB</span>;

  return (
    <DragNDropTyped
      handleChange={handleChange}
      name="image"
      types={fileTypes}
      maxSize={MAX_SIZE}
      onSizeError={() => setSizeError(true)}
    >
      <div
        className={`bg-[#D9D9D9] outline w-full rounded-[8px] border h-[250px] flex-1 flex overflow-hidden ${
          isError && " outline-danger"
        } `}
      >
        {isFile ? (
          <div className="overflow-hidden w-full relative">
            <img
              src={src}
              alt="Preview"
              width={250}
              height={250}
              style={{ width: "100%", height: "auto", objectFit: "cover" }}
            />
            <div className="w-full h-full flex flex-col items-center justify-center gap-4 absolute left-0 top-0 bg-[#5959627b] text-white cursor-pointer">
              <UploadIcon />
              {placeholder}
              <SizeWarning />
            </div>
          </div>
        ) : (
          <div
            className={`w-full h-full p-[24px_40px] flex flex-col items-center justify-center gap-4 text-[var(--black100)] cursor-pointer ${
              variant == "add" && "text-[#05834B]"
            }`}
          >
            <Icon />
            <div className={`${variant == "add" && "text-[#05834B]"}`}>
              {emptyPlaceholder}
            </div>
            <SizeWarning />
          </div>
        )}
      </div>
    </DragNDropTyped>
  );
};

export default InputPicture;
