"use client";
import H2SectionTitle from "@/app/_shared/layout/h2SectionTitle";
import React, { useEffect, useMemo, useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { toast } from "react-toastify";
import { useMutation, useQuery } from "@tanstack/react-query";
import {
  getRequestProtected,
  postRequest,
  postRequestProtected,
  putRequestProtected,
} from "@/app/utils/queries/requests";
import { FlatInput } from "@/app/_shared/inputs_actions/inputFields";
import InputPicture from "@/app/_shared/inputs_actions/inputPicture";
import { SolidPrimaryButton } from "@/app/_shared/inputs_actions/buttons";
import {
  Button,
  Radio,
  RadioGroup,
  Select,
  SelectItem,
} from "@nextui-org/react";
import { useSelector } from "react-redux";
import { selectAuthState } from "@/lib/slices/auth-slice";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { generateUrl } from "@/helpers/parseImage";
import InputPictureFloating from "@/app/_shared/inputs_actions/inputPictureFloating";
import axios from "axios";
import DraggableImage from "./_shared/draggableimage";
import { prevRoutes } from "@/lib/session/prevRoutes";
import { parseArray } from "@/helpers/parsArray";
import { Switch } from "@nextui-org/react";
import { TailwindSwitch } from "@/app/_shared/inputs_actions/switch";
import { InfoIcon } from "@/app/_shared/icons/icons";
export default function Page({
  params,
  searchParams,
}: {
  params: { slug: string };
  searchParams: { [key: string]: string | string[] | undefined };
}) {
  const pathname = usePathname();

  const { uuid, comicId, chapterid } = searchParams;
  const { user, userType, token } = useSelector(selectAuthState);
  const comicid = new URLSearchParams(window.location.search).get("comicId");
  const uuId = new URLSearchParams(window.location.search).get("uuid");
  const episodeId = new URLSearchParams(window.location.search).get(
    "chapterid"
  );
  const [isLoading, setisLoading] = useState<boolean>(false);
  const [enabled, setEnabled] = useState<boolean>(false);
  const [panelLockStates, setPanelLockStates] = useState<boolean[]>([]);

  const querykey = `comic_episode${comicId}`;
  const {
    data,
    isSuccess,
    isLoading: isepisodeLoading,
  } = useQuery({
    queryKey: [`comic_episode${chapterid}`, episodeId],
    queryFn: () =>
      getRequestProtected(
        `/my-libraries/chapters/${episodeId}/comic/${comicid}/get`,
        token,
        prevRoutes(uuid).comic
      ),
    enabled: episodeId !== null && token !== null,
  });
  console.log("@@edit data", data);

  // Fetch comic data to get episode count for restriction check
  const { data: comicData, isSuccess: isComicDataSuccess } = useQuery({
    queryKey: [`comic_data_${comicid}`],
    queryFn: () =>
      getRequestProtected(
        `/my-libraries/comics/${comicid}/get`,
        token,
        prevRoutes(uuid).comic
      ),
    enabled: comicid !== null && token !== null,
  });

  const images = useMemo(
    () => parseArray(data?.data?.comicImages).map((val) => val.image),
    [data?.data?.comicImages]
  );

  // Memoized array of image IDs for API calls in edit mode
  const comicImageIds = useMemo(
    () => parseArray(data?.data?.comicImages).map((val) => val.id),
    [data?.data?.comicImages]
  );

  // Check if user can lock panels or enable monetization (requires at least 3 chapters)
  const canLockOrMonetize = useMemo(() => {
    const episodes = comicData?.data?.episodes || [];
    console.log("@@episodes", episodes);
    return episodes.length >= 3;
  }, [comicData?.data?.episodes]);

  // Initialize lock states when images are loaded
  useEffect(() => {
    if (data?.data?.comicImages && data.data.comicImages.length > 0) {
      const existingImages = parseArray(data?.data?.comicImages);
      setPanelLockStates((prev) => {
        // Map existing lock states from API response
        return existingImages.map((img: any) => img.is_lock === 1);
      });
    } else if (images && images.length > 0) {
      setPanelLockStates((prev) => {
        // Only initialize if the length doesn't match or if it's empty
        if (prev.length !== images.length) {
          return new Array(images.length).fill(false);
        }
        return prev;
      });
    }
  }, [data?.data?.comicImages, images]);

  // Initialize monetization switch state from API data in edit mode
  useEffect(() => {
    if (data?.data && episodeId) {
      setEnabled(data?.data?.isMonetized === 1);
    }
  }, [data?.data, episodeId]);

  const initialValues = {
    title: data?.data?.title || "",
    description: data?.data?.description || "",
    thumbnail: data?.data?.thumbnail || "",
    comicImages: images || [],
  };
  const validationSchema = Yup.object().shape({
    title: Yup.string().required(" is required"),
    description: Yup.string().required(" is required"),
    thumbnail: Yup.mixed().required("thumbnail required"),
    comicImages: Yup.array()
      .of(Yup.mixed())
      .min(1, "At least one item is required")
      .notRequired(),
  });
  const formik = useFormik({
    initialValues,
    validationSchema,
    onSubmit: async (values) => {
      const formData = new FormData();
      formData?.append("title", values.title);
      formData?.append("description", values.description);
      formData?.append("thumbnail", values.thumbnail);
      formData.append("isMonetized", enabled ? "1" : "0");
      values.comicImages.forEach((image: any, i: number) => {
        if (typeof image === "string") {
          formData.append(`comicImage[${i}][image]`, image);
          // Add lock status
          formData.append(
            `comicImage[${i}][is_lock]`,
            panelLockStates[i] ? "1" : "0"
          );
        } else if (image instanceof File) {
          formData.append(`comicImage[${i}][image]`, image);
          // Add lock status for new files
          formData.append(
            `comicImage[${i}][is_lock]`,
            panelLockStates[i] ? "1" : "0"
          );
        }
      });
      publishhh.mutate(formData);
      setisLoading(true);
    },
    enableReinitialize: true,
  });

  const addImage = (fileList: FileList) => {
    if (fileList) {
      const filesArray = Array.from(fileList);
      formik.setFieldValue("comicImages", [
        ...formik.values.comicImages,
        ...filesArray,
      ]);
      // Add lock states for new images (all unlocked by default)
      setPanelLockStates((prev) => [
        ...prev,
        ...new Array(filesArray.length).fill(false),
      ]);
    }
  };
  const moveImage = (dragIndex: number, hoverIndex: number) => {
    const newFiles = [...formik.values.comicImages];
    const draggedItem = newFiles[dragIndex];

    newFiles.splice(dragIndex, 1);
    newFiles.splice(hoverIndex, 0, draggedItem);

    formik.setFieldValue("comicImages", newFiles);

    // Reorder lock states to match panel order
    setPanelLockStates((prev) => {
      const newLockStates = [...prev];
      const draggedLockState = newLockStates[dragIndex];
      newLockStates.splice(dragIndex, 1);
      newLockStates.splice(hoverIndex, 0, draggedLockState);
      return newLockStates;
    });
  };
  const removeImage = (index: number) => {
    formik.setFieldValue(
      "comicImages",
      formik.values.comicImages.filter((_: any, i: number) => i !== index)
    );
    // Remove corresponding lock state
    setPanelLockStates((prev) => prev.filter((_, i) => i !== index));
  };
  const addedImages = useMemo(() => {
    const images = formik.values.comicImages.map((imageFile: any) =>
      generateUrl(imageFile)
    );
    return images;
  }, [formik.values.comicImages]);

  // Sync lock states with image count
  useEffect(() => {
    const imageCount = formik.values.comicImages.length;
    setPanelLockStates((prev) => {
      if (prev.length === imageCount) {
        return prev; // No change needed
      }
      if (prev.length < imageCount) {
        // Add false for new images
        return [...prev, ...new Array(imageCount - prev.length).fill(false)];
      } else {
        // Remove excess lock states
        return prev.slice(0, imageCount);
      }
    });
  }, [formik.values.comicImages.length]);

  // Toggle lock mutation for edit mode
  const toggleLockMutation = useMutation({
    mutationKey: ["toggle-comic-panel-lock"],
    mutationFn: ({ imageId, index }: { imageId: number; index: number }) =>
      putRequestProtected(
        {},
        `/my-libraries/chapters/comic-panel/${imageId}/toggle`,
        token || "",
        pathname,
        "json"
      ),
    onSuccess: (data, variables) => {
      const { success, message } = data;
      if (!success) {
        toast(message || "Failed to toggle lock", {
          toastId: "toggle-lock-error",
          type: "error",
        });
        // Revert on API failure
        setPanelLockStates((prev) => {
          const newStates = [...prev];
          newStates[variables.index] = !newStates[variables.index];
          return newStates;
        });
      }
    },
    onError: (error, variables) => {
      toast("Failed to toggle lock. Please try again.", {
        toastId: "toggle-lock-error",
        type: "error",
      });
      // Revert on error
      setPanelLockStates((prev) => {
        const newStates = [...prev];
        newStates[variables.index] = !newStates[variables.index];
        return newStates;
      });
    },
  });

  const toggleLock = (index: number) => {
    // Check if user has enough chapters to lock panels
    if (!canLockOrMonetize) {
      toast("You need at least 4 chapters before you can lock panels", {
        toastId: "lock-restriction",
        type: "info",
      });
      return;
    }

    // If in edit mode and image has an ID, call the API
    if (episodeId && comicImageIds[index]) {
      const imageId = comicImageIds[index];
      // Optimistically update the UI
      setPanelLockStates((prev) => {
        const newStates = [...prev];
        newStates[index] = !newStates[index];
        return newStates;
      });
      // Call the API with index for error handling
      toggleLockMutation.mutate({ imageId, index });
    } else {
      // In create mode or for new images without IDs, just update local state
      setPanelLockStates((prev) => {
        const newStates = [...prev];
        newStates[index] = !newStates[index];
        return newStates;
      });
    }
  };
  const router = useRouter();
  const publishChapter = useMutation({
    mutationKey: [`comic${comicid}_post_chapter`],
    mutationFn: (data: any) =>
      postRequestProtected(
        data,
        `/my-libraries/chapters/comic/${comicid}/create`,
        token || "",
        pathname,
        "form"
      ),
    onSuccess(data, variables, context) {
      setisLoading(false);
      const { success, message, data: resData } = data;
      if (success) {
        toast("Chapter added", {
          toastId: "add_comic",
          type: "success",
        });
        router.push(`/user/library/books?uuid=${uuId}&id=${comicid}`);
      } else {
        toast(message, {
          toastId: "add_comic",
          type: "error",
        });
      }
    },
    onError(error, variables, context) {
      toast("Some error occured. Contact help !", {
        toastId: "add_comic",
        type: "error",
      });
      setisLoading(false);
    },
  });
  const publishhh = useMutation({
    mutationKey: [`comic${comicId}_upload_picture`],
    mutationFn: (data: any) => axios.post("/api/upload", data),
    onSuccess(data) {
      const imageUrls = data?.data?.message;
      // setImageUrls(data?.data?.message);
      if (imageUrls) {
        const updatedValues = {
          ...formik.values,
          comicImages: [
            ...formik.values.comicImages.filter(
              (image) => typeof image === "string"
            ),
            ...imageUrls,
          ],
        };
        const formData = new FormData();
        formData?.append("title", updatedValues.title);
        formData?.append("description", updatedValues.description);
        formData?.append("thumbnail", updatedValues.thumbnail);
        formData.append("isMonetized", enabled ? "1" : "0");
        updatedValues.comicImages.map((imageUrl: string, i: number) => {
          formData.append(`comicImage[${i}][image]`, imageUrl);
          // Add lock status - ensure we have a lock state for this index
          const lockState =
            i < panelLockStates.length ? panelLockStates[i] : false;
          formData.append(`comicImage[${i}][is_lock]`, lockState ? "1" : "0");
        });
        if (episodeId) {
          editComic.mutate(formData);
        } else {
          publishChapter.mutate(formData);
        }
      }
    },
    onError(error, variables, context) {
      toast("Some error occured. Contact help !", {
        toastId: "add_Images",
        type: "error",
      });
    },
  });
  const editComic = useMutation({
    mutationKey: [`comic${episodeId}_edit_chapter`],
    mutationFn: (data: any) =>
      postRequestProtected(
        data,
        `/my-libraries/chapters/${episodeId}/comic/${comicid}/update?_method=PATCH`,
        token || "",
        pathname,
        "form"
      ),
    onSuccess(data, variables, context) {
      setisLoading(false);
      const { success, message, data: resData } = data;
      console.log("@@edit comic data", data);
      if (success) {
        toast("Chapter added", {
          toastId: "add_comic",
          type: "success",
        });
        router.push(`/user/library/books?uuid=${uuId}&id=${comicid}`);
      } else {
        toast(message, {
          toastId: "add_comic",
          type: "error",
        });
      }
    },
    onError(error, variables, context) {
      console.log("@@edit comic error", error);
      toast("Some error occured. Contact help !", {
        toastId: "add_comic",
        type: "error",
      });
      setisLoading(false);
    },
    onSettled(data, error, variables, context) {
      setisLoading(false);
    },
  });

  return (
    <main className="">
      <div className="parent-wrap min-h-dvh   py-10">
        <div className="child-wrap ">
          <H2SectionTitle title="Start creating your comic on Tooncentral" />
          <form
            onSubmit={formik.handleSubmit}
            className=" relative flex flex-col justify-between bg-[var(--bg-secondary)] min-h-[70dvh] p-6 md:p-9 rounded-[8px]"
          >
            <div>
              <div className="flex justify-between flex-col md:flex-row gap-5">
                <FlatInput
                  label={"Chapter Title"}
                  name={"title"}
                  value={formik.values.title}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  error={Boolean(formik.errors.title && formik.touched.title)}
                />
                <FlatInput
                  label={"Chapter Description"}
                  name={"description"}
                  value={formik.values.description}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  error={Boolean(
                    formik.errors.description && formik.touched.description
                  )}
                />
              </div>
              <div className=" mt-10">
                <label className="">Thumbnail</label>
                <div className="mt-2 flex max-w-[300px] ">
                  <InputPicture
                    formik={formik}
                    maxSize={0.5}
                    fieldError={Boolean(
                      formik.errors.comicImages && formik.touched.comicImages
                    )}
                    fieldName={"thumbnail"}
                    variant="add"
                    emptyPlaceholder={
                      <div className="flex flex-col sm:gap-2 text-[#000000]">
                        <p className="text-center">
                          {" "}
                          <span className=" text-[var(--green100)]">
                            Upload thumbnail file
                          </span>{" "}
                        </p>

                        <p className="text-center">
                          Recommended size is{" "}
                          <span className="font-semibold">1080 x 1080</span>{" "}
                        </p>
                        <p className="text-center text-xs">
                          Only JPG, JPEG, and PNG formats are allowed.
                        </p>
                      </div>
                    }
                  />
                </div>
              </div>
              <div className=" mt-10">
                <label className="">Comic content</label>
                <div className="mt-2 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6">
                  <div className="hidden sm:block">
                    <InputPicture
                      formik={formik}
                      fieldError={Boolean(
                        formik.errors.comicImages && formik.touched.comicImages
                      )}
                      multiple
                      onChange={(file: any) => addImage(file)}
                      fieldName={"comicImages"}
                      variant="add"
                      emptyPlaceholder={
                        <div className="flex flex-col gap-3 text-[#000000]">
                          <p className="text-center">
                            {" "}
                            <span className=" text-[var(--green100)]">
                              Upload image file
                            </span>{" "}
                          </p>

                          <p className="text-center">
                            Recommended size is{" "}
                            <span className="font-semibold">160 x 151</span>{" "}
                          </p>
                        </div>
                      }
                    />
                  </div>

                  {addedImages.map((value: any, i: number) => (
                    <div key={i}>
                      <DraggableImage
                        value={value}
                        removeImage={removeImage}
                        i={i}
                        moveImage={moveImage}
                        isLocked={panelLockStates[i] || false}
                        onToggleLock={toggleLock}
                        canLockOrMonetize={canLockOrMonetize}
                      />
                    </div>
                    // <div
                    //   key={i}
                    //   className="relative h-[260px] md:h-[312px]  w-full rounded-[8px] overflow-hidden"
                    // >
                    //   <img
                    //     src={value}
                    //     alt=""
                    //     className="w-full h-full object-cover"
                    //   />
                    //   <div
                    //     onClick={() => removeImage(i)}
                    //     className="cursor-pointer absolute top-0 right-0 bg-[#ffffff] rounded-[50%] p-2 w-[20px] h-[20px] flex items-center justify-center text-[#000000]"
                    //   >
                    //     x
                    //   </div>
                    // </div>
                  ))}
                </div>
              </div>
              <div className=" flex flex-col gap-5 mt-8">
                <h3>Monetization</h3>
                <div className="flex gap-5">
                  <TailwindSwitch
                    enabled={enabled}
                    setEnabled={(value: boolean) => {
                      if (!canLockOrMonetize) {
                        toast(
                          "You need at least 4 chapters before you can enable monetization",
                          {
                            toastId: "monetization-restriction",
                            type: "info",
                          }
                        );
                        return;
                      }
                      setEnabled(value);
                    }}
                    disabled={!canLockOrMonetize}
                  />
                  <div className="flex flex-col">
                    <p>Monetize this chapter ?</p>
                    {!canLockOrMonetize && (
                      <p className="text-sm text-gray-400 mt-1">
                        You need at least 4 chapters to enable monetization
                      </p>
                    )}
                  </div>
                </div>

                <div className="border-1 border-[#3D434D] rounded-lg py-8 px-10 flex flex-col gap-5">
                  <RadioGroup color="success">
                    <Radio
                      value="Ads"
                      description="Ads will appear alongside your work"
                    >
                      Monetize with Ads
                    </Radio>
                    <Radio
                      value="credits"
                      description="Fans unlock with credits"
                    >
                      Monetize with Credits
                    </Radio>
                  </RadioGroup>

                  <div className="flex gap-5">
                    <InfoIcon className="w-5 h-5 text-[#FF4444]" />
                    <p>Monitization is only available from chapter 4 onwards</p>
                  </div>
                </div>
              </div>
            </div>
            {/* <InputPictureFloating
              formik={formik}
              fieldError={Boolean(formik.errors.comicImages)}
              onChange={(file) => addImage(file)}
              fieldName={"comicImages"}
            /> */}
            <div className="flex mt-10 gap-5">
              <SolidPrimaryButton
                className="w-full"
                isLoading={isLoading}
                type="submit"
              >
                Add Chapter
              </SolidPrimaryButton>
              <Button
                // onPress={goBack}
                className="w-full  rounded-lg"
                size="lg"
              >
                Cancel
              </Button>
            </div>
          </form>
        </div>
      </div>
    </main>
  );
}
