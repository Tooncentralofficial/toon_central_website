"use client";

import H2SectionTitle from "@/app/_shared/layout/h2SectionTitle";
import { useFormik } from "formik";
import * as Yup from "yup";
import { toast } from "react-toastify";
import { useMutation, useQuery } from "@tanstack/react-query";
import {
  getRequest,
  getRequestProtected,
  patchRequestProtected,
  postRequest,
  postRequestProtected,
} from "@/app/utils/queries/requests";
import {
  FlatInput,
  FlatSelect,
  FlatTextarea,
  InputSolid,
} from "@/app/_shared/inputs_actions/inputFields";
import InputPicture from "@/app/_shared/inputs_actions/inputPicture";
import { SolidPrimaryButton } from "@/app/_shared/inputs_actions/buttons";
import { Button, Select, SelectItem, useDisclosure } from "@nextui-org/react";
import { useSelector } from "react-redux";
import { selectAuthState } from "@/lib/slices/auth-slice";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { ChangeEvent, useEffect, useMemo, useState } from "react";
import { Comic, ComicFormValues } from "@/helpers/types";
import CheckCountry from "./modals/checkCountry";
import AddStrips from "./modals/addStrips";
import { parseArray } from "@/helpers/parsArray";
import { prevRoutes } from "@/lib/session/prevRoutes";
import { SELECT_ITEMS } from "@/app/utils/constants/constants";

interface NewUpload {
  uuid: string | null;
  comicId: string | null;
}
export default function Page({
  params,
  searchParams,
}: {
  params: { slug: string };
  searchParams: { [key: string]: string | string[] | undefined };
}) {
  const { user, userType, token } = useSelector(selectAuthState);
  const router = useRouter();
  const { comicId }: any = searchParams;
  const pathname = usePathname();

  const isEdit = useMemo(() => pathname.includes("edit"), [pathname]);

  //chck for edit
  useEffect(() => {
    if (pathname.includes("/edit") && !comicId) {
      router.push("/user/library");
    }
  }, [pathname, comicId]);

  const BANNER_SIZE = "1952 x 587";
  const COMIC_SIZE = "1080 x 1080";

  const UPDATE_DAYS = [
    { id: "Monday" },
    { id: "Tuesday" },
    { id: "Wednesday" },
    { id: "Thursday" },
    { id: "Friday" },
    { id: "Saturday" },
    { id: "Sunday" },
  ];
  const COMIC_STATUS = [
    {
      id: "ONGOING",
      name: "Ongoing",
    },
    {
      id: "COMPLETED",
      name: "Completed",
    },
  ];

  const [comicData, setComicData] = useState<Comic | null>();
  const [genreData, setgenreData] = useState([]);
  const { onClose, isOpen, onOpen, onOpenChange } = useDisclosure();
  const {
    onClose: onAddClose,
    isOpen: isAddOpen,
    onOpen: onAddOpen,
    onOpenChange: onAddOpenChange,
  } = useDisclosure();
  // useEffect(() => {
  //   setTimeout(() => {
  //     if (!user?.country_id) {
  //       onOpen();
  //     } else {
  //       onClose();
  //     }
  //   }, 2000);
  // }, [user?.country_id]);
  const {
    data: genreResponse,
    isSuccess: genreSuccess,
    isLoading: genreLoading,
  } = useQuery({
    queryKey: [`fetch_genre`],
    queryFn: () => getRequest(`genres/pull/list`),
  });

  const {
    data: comicResponse,
    isSuccess: iscomicSuccess,
    isLoading: iscomicLoading,
  } = useQuery({
    queryKey: [`fetchcomic_${comicId}`],
    queryFn: () =>
      getRequestProtected(
        `my-libraries/comics/${comicId}/get`,
        token,
        prevRoutes().library
      ),
    enabled: (isEdit && token!== null),
  });
  useEffect(() => {
    console.log(formik.values.genreId)
    if (genreSuccess && genreResponse?.data) {
      setgenreData(genreResponse.data);
    }
  }, [genreSuccess, genreResponse]);
  useEffect(() => {
    if (iscomicSuccess) {
      setComicData(comicResponse?.data);
      // console.log(comicResponse?.data);
      // formik.setValues({
      //   backgroundImage: comicData?.backgroundImage || "",
      //   coverImage: comicData?.coverImage || "",
      //   title: comicData?.title || "",
      //   description: comicData?.description || "",
      //   genreId: comicData?.genreId || "",
      //   status: comicData?.status|| "",
      //   updateDays: comicData?.updateDays|| "",
      // });
    }
    return () => {
      formik.resetForm();
      setComicData(null);
    };
  }, [comicId, iscomicLoading, iscomicSuccess, comicResponse]);
  const initialValues = {
    backgroundImage: comicData?.backgroundImage || "",
    coverImage: comicData?.coverImage || "",
    title: comicData?.title || "",
    description: comicData?.description || "",
    // genreId: comicData?.genreId || [],
    genreId: Array.isArray(comicData?.genres.map((item) => item.genre_id))
      ? comicData?.genres.map((item) => item.genre_id.toString())
      : [],
    status: comicData?.status || "",
    updateDays: comicData?.updateDays || "",
    socialMediaHandle: comicData?.socialMediaHandle || "",
  };
  console.log(comicData?.genres.map((item) => item.genre_id));
  const validationSchema = Yup.object().shape({
    backgroundImage: Yup.mixed().required(" is required"),
    coverImage: Yup.mixed().required(" is required"),
    title: Yup.string().required(" is required"),
    description: Yup.string().required(" is required"),
    genreId: Yup.array().required(" is required"),
    status: Yup.string().required(" is required"),
    updateDays: Yup.string().required(" is required"),
    socialMediaHandle: Yup.string().required(" is required"),
  });
  const { data } = useQuery({
    queryKey: ["countries"],
    queryFn: () => getRequest("/selectables/countries"),
  });
  const formik = useFormik({
    initialValues,
    validationSchema,
    onSubmit: (values: any) => {
      isEdit ? editComic.mutate({ values }) : addNew.mutate({ values });
    },
    enableReinitialize: true,
  });

  const [newUpload, setNewUpload] = useState<null | NewUpload>(null);

  const uploadComicAssets = async (
    coverImage: unknown,
    backgroundImage: unknown
  ): Promise<{ coverImageUrl?: string; backgroundImageUrl?: string }> => {
    const hasCoverFile =
      coverImage instanceof File && coverImage.size > 0;
    const hasBackgroundFile =
      backgroundImage instanceof File && backgroundImage.size > 0;
    if (!hasCoverFile && !hasBackgroundFile) return {};

    const formData = new FormData();
    if (hasCoverFile) formData.append("coverImage", coverImage as File);
    if (hasBackgroundFile)
      formData.append("backgroundImage", backgroundImage as File);

    const res = await fetch("/api/upload/comic-assets", {
      method: "POST",
      body: formData,
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err?.error || "Image upload failed");
    }
    return res.json();
  };

  const buildBackendFormData = (
    values: any,
    urls: { coverImageUrl?: string; backgroundImageUrl?: string }
  ) => {
    console.log(values,urls)
    const formData = new FormData();
    const coverUrl =
      urls.coverImageUrl ??
      (typeof values.coverImage === "string" ? values.coverImage : "");
    const backgroundUrl =
      urls.backgroundImageUrl ??
      (typeof values.backgroundImage === "string" ? values.backgroundImage : "");
    formData.append("coverImage", coverUrl);
    formData.append("backgroundImage", backgroundUrl);
    formData.append("title", values.title);
    formData.append("description", values.description);
    formData.append("status", values.status);
    formData.append("updateDays", values.updateDays);
    formData.append("socialMediaHandle", values.socialMediaHandle);
    values?.genreId?.map((val: any, i: number) => {
      formData.append(`genreId[${i}]`, val);
    });
    return formData;
  };

  const addNew = useMutation({
    mutationKey: ["post_comic"],
    mutationFn: async (data: { values: any }) => {
      const urls = await uploadComicAssets(
        data.values.coverImage,
        data.values.backgroundImage
      );
      const formData = buildBackendFormData(data.values, urls);
      return postRequestProtected(
        formData,
        "/my-libraries/comics/create",
        token || "",
        prevRoutes().library,
        "form"
      );
    },
    onSuccess(data, variables, context) {
      const { success, message, data: resData } = data;
      console.log(data)
      if (success) {
        toast("Comic added", {
          toastId: "add_comic",
          type: "success",
        });
        if (resData?.uuid && resData?.id) {
          // if(parseArray(comicData?.episodes).length>0){

          //   addMoreStrips({ comicId: resData.id, uuid: resData.uuid });
          // }
          addPart(resData.uuid, resData.id);
        }
      } else {
        toast(message, {
          toastId: "add_comic",
          type: "error",
        });
      }
    },
    onError(error, variables, context) {
      console.log(error)
      toast("Some error occured. Contact help !", {
        toastId: "add_comic",
        type: "error",
      });
    },
  });

  const editComic = useMutation({
    mutationKey: ["patch_comic"],
    mutationFn: async (data: { values: any }) => {
      const urls = await uploadComicAssets(
        data.values.coverImage,
        data.values.backgroundImage
      );
      const formData = buildBackendFormData(data.values, urls);
      return postRequestProtected(
        formData,
        `/my-libraries/comics/${comicId}/update?_method=PATCH`,
        token || "",
        prevRoutes().library,
        "form"
      );
    },
    onSuccess(data, variables, context) {
      const { success, message, data: resData } = data;
      if (success) {
        toast(message, {
          toastId: "add_comic",
          type: "success",
        });
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

  // function addMoreStrips(data: NewUpload) {
  //   setNewUpload({ comicId: data.comicId, uuid: data.uuid });
  //   if (data?.comicId && data?.uuid) onAddOpen();
  // }

  const goBack = () => router.back();
  function addPart(uid: string, comicId: string) {
    router.push(`/user/library/books/addpart?uuid=${uid}&comicId=${comicId}`);
  }
  // if (userType !== "user") {
  //   router.push("/creator");
  //   return <div></div>;
  // } else {

  // }
  return (
    <>
      <div className="min-h-dvh">
        <div className="parent-wrap py-10">
          <div className="child-wrap w-full">
            <H2SectionTitle title="Start creating your comic on Tooncentral" />
            <form
              onSubmit={formik.handleSubmit}
              className="bg-[var(--bg-secondary)] p-6 md:p-9 rounded-[8px]"
            >
              <div className="flex flex-col xl:flex-row gap-6 xl:gap-10">
                <div className="w-full xl:w-[60%] flex flex-col gap-6">
                  <FlatInput
                    label={"Comic Title"}
                    name={"title"}
                    value={formik.values.title}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    error={Boolean(formik.errors.title && formik.touched.title)}
                    isDisabled={addNew.isPending}
                  />

                  <FlatTextarea
                    label={"Comic Description"}
                    name={"description"}
                    value={formik.values.description}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    error={Boolean(
                      formik.errors.description && formik.touched.description
                    )}
                    isDisabled={addNew.isPending}
                  />

                  <div className="flex flex-col sm:flex-row gap-6">
                    <FlatSelect
                      name="genreId"
                      label="Genre"
                      placeholder="Select genre"
                      onChange={(option: ChangeEvent<HTMLSelectElement>) =>
                        formik.setFieldValue(
                          "genreId",
                          option.target.value.split(",")
                        )
                      }
                      onBlur={formik.handleBlur}
                      selectionMode="multiple"
                      isInvalid={Boolean(
                        formik.errors.genreId && formik.touched.genreId
                      )}
                      selectedKeys={formik.values.genreId}
                      value={formik.values.genreId}
                      isDisabled={genreLoading}
                    >
                      {genreData.map((item: any) => (
                        <SelectItem key={item?.id} value={item?.id.toString()}>
                          {item?.name}
                        </SelectItem>
                      ))}
                    </FlatSelect>
                    <FlatSelect
                      name="status"
                      label="Status"
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      placeholder="Select status"
                      isInvalid={Boolean(
                        formik.errors.status && formik.touched.status
                      )}
                      selectedKeys={[formik.values.status]}
                      isDisabled={addNew.isPending}
                    >
                      {COMIC_STATUS.map((item) => (
                        <SelectItem key={item.id} value={item.id.toString()}>
                          {item.name}
                        </SelectItem>
                      ))}
                    </FlatSelect>
                  </div>
                  <FlatSelect
                    label="Update Days"
                    name="updateDays"
                    placeholder="Select day"
                    selectedKeys={[formik.values.updateDays]}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    isInvalid={Boolean(
                      formik.errors.updateDays && formik.touched.updateDays
                    )}
                    isDisabled={addNew.isPending}
                  >
                    {UPDATE_DAYS.map((item) => (
                      <SelectItem key={item.id} value={item.id.toString()}>
                        {item.id}
                      </SelectItem>
                    ))}
                  </FlatSelect>

                  <FlatInput
                    label={"Social Media Handle"}
                    name={"socialMediaHandle"}
                    value={formik.values.socialMediaHandle}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    error={Boolean(
                      formik.errors.socialMediaHandle &&
                        formik.touched.socialMediaHandle
                    )}
                    isDisabled={addNew.isPending}
                  />
                </div>

                <div className="w-full xl:w-[40%] flex flex-col gap-1.5">
                  <label className="">Comic Cover</label>
                  <InputPicture
                    formik={formik}
                    fieldName={"coverImage"}
                    variant="upload"
                    emptyPlaceholder={
                      <div className="flex flex-col gap-3 text-[#000000]">
                        <p>
                          {" "}
                          <span className="text-[var(--green100)]">
                            Upload image file
                          </span>{" "}
                          or drag and drop
                        </p>

                        <p>
                          Recommended size is{" "}
                          <span className="font-semibold">{COMIC_SIZE}</span>{" "}
                        </p>
                      </div>
                    }
                    placeholder={
                      <div className="flex flex-col gap-3 text-[#000000]">
                        <p>
                          {" "}
                          <span className="text-[var(--green100)]">
                            Add new image
                          </span>{" "}
                          or drag and drop
                        </p>

                        <p>
                          Recommended size is{" "}
                          <span className="font-semibold">{COMIC_SIZE}</span>{" "}
                        </p>
                      </div>
                    }
                  />
                </div>
              </div>
              <div className="mt-5 flex flex-col gap-1.5">
                <label className="">Comic Banner</label>
                <InputPicture
                  formik={formik}
                  fieldName={"backgroundImage"}
                  emptyPlaceholder={
                    <div className="flex flex-col gap-3 text-[#000000]">
                      <p>
                        {" "}
                        <span className="text-[var(--green100)]">
                          Upload image file
                        </span>{" "}
                        or drag and drop
                      </p>

                      <p>
                        Recommended size is{" "}
                        <span className="font-semibold">{BANNER_SIZE}</span>{" "}
                      </p>
                    </div>
                  }
                  placeholder={
                    <div className="flex flex-col gap-3 text-[#000000]">
                      <p>
                        {" "}
                        <span className="text-[var(--green100)]">
                          Add new image
                        </span>{" "}
                        or drag and drop
                      </p>

                      <p>
                        Recommended size is{" "}
                        <span className="font-semibold">{BANNER_SIZE}</span>{" "}
                      </p>
                    </div>
                  }
                />
              </div>
              {/* <InputPicture formik={formik} fieldName={""} /> */}
              <div className="flex mt-10 gap-5">
                <SolidPrimaryButton
                  className="w-full"
                  isLoading={addNew.isPending || editComic.isPending}
                  type="submit"
                >
                  {isEdit ? "Update" : "Create"}
                </SolidPrimaryButton>
                <Button
                  onPress={goBack}
                  className="w-full  rounded-lg"
                  size="lg"
                >
                  Cancel
                </Button>
              </div>
            </form>
          </div>
        </div>
      </div>
      <CheckCountry
        isOpen={isOpen}
        onClose={onClose}
        onOpenChange={onOpenChange}
      />
      <AddStrips
        comicId={newUpload?.comicId || null}
        uuid={newUpload?.uuid || null}
        isOpen={isAddOpen}
        onClose={onAddClose}
        onOpenChange={onAddOpenChange}
      />
    </>
  );
}
