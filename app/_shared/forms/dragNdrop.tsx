import React, { useState } from "react";
import { FileUploader } from "react-drag-drop-files";


interface FileUploadProps {
  name: string;
  multiple?: boolean;
  label?: string;
  required?: boolean;
  disabled?: boolean;
  hoverTitle?: string;
  fileOrFiles?: File[] | null;
  classes?: string;
  types?: string[];
  onTypeError?: (err: any) => void;
  children?: JSX.Element | any;
  maxSize?: number;
  minSize?: number;
  onSizeError?: (file: File) => void;
  onDrop?: (file: File) => void;
  onSelect?: (file: File) => void;
  handleChange?: (file: File) => void;
  onDraggingStateChange?: (dragging: boolean) => void;
  dropMessageStyle?: React.CSSProperties;
}
function DragNDropTyped({
  name,
  multiple,
  label,
  required,
  disabled,
  hoverTitle,
  fileOrFiles,
  classes,
  types,
  onTypeError,
  children,
  maxSize,
  minSize,
  onSizeError,
  onDrop,
  onSelect,
  handleChange,
  onDraggingStateChange,
  dropMessageStyle,
}: FileUploadProps) {
  return (
    <FileUploader
      name={name}
      multiple={multiple}
      label={label}
      required={required}
      disabled={disabled}
      hoverTitle={hoverTitle}
      fileOrFiles={fileOrFiles}
      classes={classes}
      types={types}
      onTypeError={onTypeError}
      maxSize={maxSize}
      minSize={minSize}
      onSizeError={onSizeError}
      onDrop={onDrop}
      onSelect={onSelect}
      handleChange={handleChange}
      onDraggingStateChange={onDraggingStateChange}
      dropMessageStyle={dropMessageStyle}
    >
      {children}
    </FileUploader>
  );
}

export default DragNDropTyped;
