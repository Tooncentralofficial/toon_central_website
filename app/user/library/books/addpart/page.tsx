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
} from "@/app/utils/queries/requests";
import { FlatInput } from "@/app/_shared/inputs_actions/inputFields";
import InputPicture from "@/app/_shared/inputs_actions/inputPicture";
import { SolidPrimaryButton } from "@/app/_shared/inputs_actions/buttons";
import { Button, Radio, RadioGroup, Select, SelectItem } from "@nextui-org/react";
import { useSelector } from "react-redux";
import { selectAuthState } from "@/lib/slices/auth-slice";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { generateUrl } from "@/helpers/parseImage";
import InputPictureFloating from "@/app/_shared/inputs_actions/inputPictureFloating";
import axios from "axios";
import DraggableImage from "./_shared/draggableimage";
import { prevRoutes } from "@/lib/session/prevRoutes";
import { parseArray } from "@/helpers/parsArray";
import {Switch} from "@nextui-org/react"
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

  const querykey = `comic_episode${comicId}`;
  const {
    data,
    isSuccess,
    isLoading: isepisodeLoading,
  } = useQuery({
    queryKey: [`comic_episode${chapterid}`,episodeId],
    queryFn: () =>
      getRequestProtected(
        `/my-libraries/chapters/${episodeId}/comic/${comicid}/get`,
        token,
        prevRoutes(uuid).comic
      ),
    enabled: episodeId !== null && (token !== null),
  });
  const images = useMemo(
    () => parseArray(data?.data?.comicImages).map((val) => val.image),
    [data?.data?.comicImages]
  );

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
      values.comicImages.forEach((image: any, i: number) => {
        if (typeof image === "string") {
          formData.append(`comicImage[${i}][image]`, image);
        } else if (image instanceof File) {
          formData.append(`comicImage[${i}][image]`, image);
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
    }
  };
  const moveImage = (dragIndex: number, hoverIndex: number) => {
    const newFiles = [...formik.values.comicImages];
    const draggedItem = newFiles[dragIndex];

    newFiles.splice(dragIndex, 1);
    newFiles.splice(hoverIndex, 0, draggedItem);

    formik.setFieldValue("comicImages", newFiles);
  };
  const removeImage = (index: number) => {
    formik.setFieldValue(
      "comicImages",
      formik.values.comicImages.filter((_: any, i: number) => i !== index)
    );
  };
  const addedImages = useMemo(() => {
    const images = formik.values.comicImages.map((imageFile: any) =>
      generateUrl(imageFile)
    );
    return images;
  }, [formik.values.comicImages]);
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
        updatedValues.comicImages.map((imageUrl: string, i: number) => {
          formData.append(`comicImage[${i}][image]`, imageUrl);
        });
        if (episodeId){
          editComic.mutate(formData)
        }else{
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
      if (success) {
        toast("Chapter added", {
          toastId: "add_comic",
          type: "success",
        });
        router.push(`/user/library/books?uuid=${uuid}&id=${comicId}`);
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
                  <TailwindSwitch enabled={enabled} setEnabled={setEnabled} />
                  <p>Monetize this chapter ?</p>
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

