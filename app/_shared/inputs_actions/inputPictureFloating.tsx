import { parseImageSrc } from "@/helpers/parseImage";
import DragNDropTyped from "../forms/dragNdrop";
import { UploadIcon } from "../icons/icons";
import { RoundUploadIcon } from "../icons/icons";
import { Skeleton } from "@nextui-org/react";
const fileTypes = ["PNG", "jpeg", "JPEG", "JPG"];
const InputPictureFloating = ({
  formik,
  fieldName,
  fieldError,
  submitOnChange,
  isLoading,
  onChange,
}: {
  formik: any;
  fieldName: any;
  submitOnChange?: boolean;
  onChange?: (file: File) => void;
  isLoading?: boolean;
  fieldError?: boolean;
}) => {

  const handleChange = (file: any) => {
    if (onChange) {
      onChange(file);
    } else {
      formik.setFieldValue(fieldName, file);
    }
    if (submitOnChange) {
      formik.handleSubmit();
    }
  };
  const isError=fieldError?fieldError:Boolean(formik?.errors[fieldName])
  return (
    <div className={`flex md:hidden fixed bottom-[25%] right-[50px] bg-[#ffffff] p-3 rounded-full outline ${
      isError && " outline-danger"
    }`}>
      <DragNDropTyped
        handleChange={handleChange}
        name="image"
        types={fileTypes}
      >
        <div className="flex items-center gap-1">
          <div className="w-[40px] h-[40px]">
            <RoundUploadIcon />
          </div>

          <div className={`text-[#05834B]`}>Add</div>
        </div>
      </DragNDropTyped>
    </div>
  );
};

export default InputPictureFloating;
