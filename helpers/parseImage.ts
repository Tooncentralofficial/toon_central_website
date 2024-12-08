export const generateUrl = (file: any) => {
  try {
     if (file instanceof File) {
       return URL.createObjectURL(file)
     }
     return file;
  } catch {
    return "";
  }
};

export const parseImageSrc = (
  fileUrl: any
): { src: string; isFile: boolean; generateUrl: (fileUrl: any) => string } => {
  let src = "";
  let isFile = false;

  if (typeof fileUrl === "string") {
    if (fileUrl.startsWith("https:")) {
      isFile = true;
      src = fileUrl;
    }
  } else if (fileUrl instanceof Blob || fileUrl instanceof File) {
    src = generateUrl(fileUrl);
    isFile = true;
  } else {
    // console.error("Invalid fileUrl: must be a string or a Blob/File object.");
    isFile = false;
  }
  return { src, isFile, generateUrl };
};
