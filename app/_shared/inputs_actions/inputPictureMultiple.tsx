"use client"
import React, { useRef, useState } from 'react'
import DragNDropTyped from '../forms/dragNdrop';
import { RoundUploadIcon } from '../icons/icons';

const InputPictureMultiple = () => {
  const [selectedFiles,setSelectedFiles] = useState<any[]>([])
  const fileInputref  = useRef<any>()
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if ( files) {
      setSelectedFiles((prevFiles: any) => [
        ...prevFiles,
        ...Array.from(files),
      ]);
    }
  };
  return (
    <div
      className="grid
    justify-between
    justify-items-center
    gap-4
    overflow-hidden
    grid-cols-1
    sm:grid-cols-2
    md:grid-cols-3
    lg:grid-cols-4
    xl:grid-cols-4"
    >
      {selectedFiles.map((file, index) => (
        <div
          key={index}
          className=" w-full rounded-[8px] border h-[350px] flex-1 flex max-w-[250px] min-w-[250px]"
        >
          <img
            src={file?.size ? URL.createObjectURL(file) : file?.secure_url}
            alt={`Preview-${index + 1}`}
            style={{
              width: "auto",
              height: "100%",
              objectFit: "contain",
              maxWidth: "100%",
              maxHeight: "100%",
            }}
          />
        </div>
      ))}
      <div>
        <input
          type="file"
          className="hidden"
          multiple
          accept="image/*"
          ref={fileInputref}
          id="fileInput"
          onChange={handleChange}
        />

        <label htmlFor="fileInput">
          <div
            className={`bg-[#D9D9D9] outline w-full rounded-[8px] border h-[350px] flex-1 flex max-w-[250px] min-w-[250px] `}
          >
            <div
              className={`w-full h-full p-[24px_40px] flex flex-col items-center justify-center `}
            >
              <RoundUploadIcon />
              {/* <Camera />  */}
              <div className={` text-[#05834B] mt-2`}>Upload Image file</div>
            </div>
          </div>
        </label>
      </div>
    </div>
  );
}

export default InputPictureMultiple