"use client";
import H2SectionTitle from "@/app/_shared/layout/h2SectionTitle";
import React, { useMemo } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { toast } from "react-toastify";
import { useMutation, useQuery } from "@tanstack/react-query";
import { postRequestProtected } from "@/app/utils/queries/requests";
import { FlatInput } from "@/app/_shared/inputs_actions/inputFields";
import InputPicture from "@/app/_shared/inputs_actions/inputPicture";
import { SolidPrimaryButton } from "@/app/_shared/inputs_actions/buttons";
import { Button, Select, SelectItem } from "@nextui-org/react";
import { useSelector } from "react-redux";
import { selectAuthState } from "@/lib/slices/auth-slice";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { generateUrl } from "@/helpers/parseImage";
import InputPictureFloating from "@/app/_shared/inputs_actions/inputPictureFloating";
export default function Page({
  params,
  searchParams,
}: {
  params: { slug: string };
  searchParams: { [key: string]: string | string[] | undefined };
}) {
  const pathname = usePathname();
  const { user, userType, token } = useSelector(selectAuthState);
  const { comicId, uuid }: any = searchParams;
  const initialValues = {
    title: "",
    description: "",
    thumbnail: "",
    comicImages: [],
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
    onSubmit: (values) => {
      const formData = new FormData();
      formData?.append("title", values.title);
      formData?.append("description", values.description);
      formData?.append("thumbnail", values.thumbnail);
      values.comicImages.map((image, i) => {
        formData.append(`comicImage[${i}][image]`, image);
      });
      publishChapter.mutate(formData);
    },
    enableReinitialize: true,
  });
  const addImage = (file: File) => {
    formik.setFieldValue("comicImages", [...formik.values.comicImages, file]);
  };

  const removeImage = (index: number) => {
    formik.setFieldValue(
      "comicImages",
      formik.values.comicImages.filter((_, i) => i !== index)
    );
  };
  const addedImages = useMemo(() => {
    const images = formik.values.comicImages.map((imageFile) =>
      generateUrl(imageFile)
    );
    return images;
  }, [formik.values.comicImages]);
  const router = useRouter();
  const publishChapter = useMutation({
    mutationKey: [`comic${comicId}_post_chapter`],
    mutationFn: (data: any) =>
      postRequestProtected(
        data,
        `/my-libraries/chapters/comic/${comicId}/create`,
        token || "",
        pathname,
        "form"
      ),
    onSuccess(data, variables, context) {
      const { success, message, data: resData } = data;
      if (success) {
        toast("Chapter added", {
          toastId: "add_comic",
          type: "success",
        });
        router.push("/user/library");
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
                <div className="mt-2 flex ">
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
                      onChange={(file) => addImage(file)}
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

                  {addedImages.map((value, i) => (
                    <div
                      key={i}
                      className="relative h-[260px] md:h-[312px]  w-full rounded-[8px] overflow-hidden"
                    >
                      <img
                        src={value}
                        alt=""
                        className="w-full h-full object-cover"
                      />
                      <div
                        onClick={() => removeImage(i)}
                        className="cursor-pointer absolute top-0 right-0 bg-[#ffffff] rounded-[50%] p-2 w-[20px] h-[20px] flex items-center justify-center text-[#000000]"
                      >
                        x
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            <InputPictureFloating
              formik={formik}
              fieldError={Boolean(formik.errors.comicImages)}
              onChange={(file) => addImage(file)}
              fieldName={"comicImages"}
            />
            <div className="flex mt-10 gap-5">
              <SolidPrimaryButton
                className="w-full"
                isLoading={publishChapter.isPending}
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
