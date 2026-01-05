"use client";
import BackButton from "@/app/_shared/layout/back";
import H2SectionTitle from "@/app/_shared/layout/h2SectionTitle";
import Image from "next/image";
import React, { ChangeEvent, useMemo, useState } from "react";
import img from "@/public/static/images/shortsupload.png";
import { generateUrl } from "@/helpers/parseImage";
import { Radio, RadioGroup, Select, SelectItem } from "@nextui-org/react";
import {
  CautionIcon,
  Copyicon,
  CopyrightCheckIcon,
  FacebookShortsIcon,
  ForwardShortsIcon,
  InfoIcon,
  TelegramShortsIcon,
  WhatsappshortsIcon,
} from "@/app/_shared/icons/icons";
import Link from "next/link";
import { FacebookShareButton, TelegramShareButton } from "react-share";
import * as Yup from "yup";
import { ErrorMessage, Form, Formik } from "formik";
import { TailwindSwitch } from "@/app/_shared/inputs_actions/switch";
import { useMutation, useQuery } from "@tanstack/react-query";
import { toast } from "react-toastify";
import {
  getRequestProtected,
  postRequestProtected,
} from "@/app/utils/queries/requests";
import { selectAuthState } from "@/lib/slices/auth-slice";
import { useSelector } from "react-redux";
import { prevRoutes } from "@/lib/session/prevRoutes";
import { useRouter } from "next/navigation";

const stepsSchema = [
  Yup.object({
    url: Yup.string().required("Please select a video before proceeding"),
  }),

  // Step 2 (Details)
  Yup.object({
    title: Yup.string()
      .required("Title is required")
      .max(100, "Title must be 100 characters or less"),
    description: Yup.string().required("Description is required"),
    isForKids: Yup.string().required("You must select audience type"),
    comicId: Yup.string().optional(),
    belongToComic: Yup.string().optional(),
  }),

  // Step 3 (Checks)
  Yup.object({}),

  // Step 4 (Visibility)
  Yup.object({
    visibility: Yup.string().required("Please choose a visibility option"),
  }),
];

function Page() {
  const router = useRouter();
  const { user, userType, token } = useSelector(selectAuthState);
  const [formStep, setFormStep] = useState(0);
  const [title, setTitle] = useState("");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [overlayFile, setOverlayFile] = useState<File | null>(null);
  const [overlayPreview, setOverlayPreview] = useState<string | null>(null);
  const [uploadedUrl, setUploadedUrl] = useState<string | null>(null);
  const [enabled, setEnabled] = useState(false);

  // Fetch user's comics for selection
  const { data: comicsData, isLoading: isLoadingComics } = useQuery({
    queryKey: ["comics-for-shorts"],
    queryFn: () =>
      getRequestProtected(
        "selectables/comic-for-shorts",
        token as string,
        prevRoutes().library
      ),
    enabled: !!token,
  });
  console.log(comicsData);

  const comics = useMemo(() => comicsData?.data || [], [comicsData]);

  const initialValues = {
    url: "",
    overlayUrl: "",
    title: "",
    description: "",
    isForKids: "",
    visibility: "",
    comicId: "",
    belongToComic: "0",
  };
  const uploadShortMutation = useMutation({
    mutationFn: async (file: File) => {
      const formData = new FormData();
      formData.append("short", file);

      const response = await fetch("/api/upload/short", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error("Upload failed");
      }

      const data = await response.json();
      return data.message;
    },
    onSuccess: (url) => {
      // store uploaded video url in local state as well
      setUploadedUrl(url);
    },
  });

  const uploadImageMutation = useMutation({
    mutationFn: async (file: File) => {
      const formData = new FormData();
      // backend route 'app/api/upload/route.ts' expects keys named `comicImage`
      formData.append("comicImage", file);

      const response = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) throw new Error("Image upload failed");
      const data = await response.json();
      // route returns { message: resultArray }
      const url = Array.isArray(data.message) ? data.message[0] : data.message;
      return url;
    },
    onSuccess: (url) => {
      setOverlayPreview(url);
      toast.success("Overlay uploaded", { toastId: "overlay-success" });
    },
    onError: () => {
      toast.error("Failed to upload overlay", { toastId: "overlay-error" });
    },
  });

  const steps = ["Step 1", "Step 2", "Step 3"];

  const handleFile = (
    e: ChangeEvent<HTMLInputElement>,
    validateForm: any,
    setErrors: any,
    setFormStep: any,
    setFieldValue: any
  ) => {
    const { files } = e.target;

    if (files && files.length > 0) {
      const file = files[0];
      setSelectedFile(file);
      uploadShortMutation.mutate(file, {
        onSuccess: async (url) => {
          await setFieldValue("url", url);

          toast.success("Video uploaded successfully!", {
            toastId: "upload-success",
          });

          setTimeout(async () => {
            const errors = await validateForm();
            if (Object.keys(errors).length === 0) {
              setFormStep((prev: number) => prev + 1);
            } else {
              setErrors(errors);
            }
          }, 100);
        },
        onError: () => {
          toast.error("Failed to upload video", { toastId: "upload-error" });
        },
      });
    }
  };

  const handleOverlayFile = (
    e: ChangeEvent<HTMLInputElement>,
    setFieldValue: any
  ) => {
    const { files } = e.target;
    if (!files || files.length === 0) return;
    const file = files[0];
    setOverlayFile(file);
    // local preview immediately
    setOverlayPreview(generateUrl(file));

    uploadImageMutation.mutate(file, {
      onSuccess: (url) => {
        // write returned overlay url into formik
        setFieldValue("overlayUrl", url);
      },
    });
  };

  const CreateShort = useMutation({
    mutationFn: async (data: any) => {
      const response = await postRequestProtected(
        data,
        "my-libraries/shorts/create",
        token as string,
        prevRoutes().library,
        "json"
      );
      return response;
    },
  });
  const handleNext = async (
    validateForm: any,
    setErrors: any,
    setFormStep: any
  ) => {
    const errors = await validateForm();
    if (Object.keys(errors).length === 0) {
      setFormStep((prev: number) => prev + 1);
    } else {
      setErrors(errors);
    }
  };
  return (
    <div className="min-h-dvh">
      <div className="parent-wrap py-10">
        <div className="child-wrap w-full ">
          <div className="flex gap-10">
            <BackButton />
            <H2SectionTitle title="Upload Shorts " />
          </div>
          <Formik
            initialValues={initialValues}
            validationSchema={stepsSchema[formStep]}
            onSubmit={(values) => {
              const finaleValues = {
                title: values.title,
                description: values.description,
                videoLink: values.url,
                audienceId: parseInt(values.isForKids),
                visibility: values.visibility,
                coverImage: values.overlayUrl,
                comicId: values.comicId
                  ? isNaN(Number(values.comicId))
                    ? values.comicId
                    : parseInt(values.comicId)
                  : null,
                belongToComic: values.belongToComic === "1" ? 1 : 0,
              };
              console.log(finaleValues);
              CreateShort.mutate(finaleValues, {
                onSuccess: (response) => {
                  console.log(response);
                  toast.success("Short uploaded successfully!", {
                    toastId: "upload-success",
                  });
                  setTimeout(() => {
                    router.push(prevRoutes().library);
                  }, 1000);
                },
                onError: () => {
                  toast.error("Failed to upload short", {
                    toastId: "upload-error",
                  });
                },
              });
            }}
          >
            {({ values, setFieldValue, validateForm, setErrors }) => (
              <Form>
                {/* Step 1 */}
                {formStep === 0 && (
                  <div className="w-full h-full flex justify-center pt-10">
                    <div className="flex flex-col gap-10 items-center ">
                      <div className="w-[20rem] h-[16rem] sm:w-[26rem] sm:h-[20rem] overflow-hidden">
                        <Image
                          src={img}
                          alt="shortUpload"
                          height={700}
                          width={700}
                          style={{
                            width: "100%",
                            height: "100%",
                            objectFit: "contain",
                            objectPosition: "center",
                          }}
                        />
                      </div>
                      <p className="text-[#475467] text-sm">
                        No Shorts available
                      </p>
                      <div>
                        <label
                          htmlFor="profilePicUpload"
                          className={`${
                            uploadShortMutation.isPending
                              ? "bg-gray-500 cursor-not-allowed"
                              : "bg-gradient-to-r from-[#00A96E] to-[#22C55E] cursor-pointer"
                          } text-white px-6 py-3 rounded-md inline-block`}
                        >
                          {uploadShortMutation.isPending
                            ? "Uploading..."
                            : "Select shorts"}
                        </label>
                        <input
                          type="file"
                          className="hidden"
                          id="profilePicUpload"
                          onChange={(e) =>
                            handleFile(
                              e,
                              validateForm,
                              setErrors,
                              setFormStep,
                              setFieldValue
                            )
                          }
                          accept="video/mp4,video/x-m4v,video/*"
                        />
                        <ErrorMessage
                          name="url"
                          component="p"
                          className="text-[#880808] text-sm"
                        />
                      </div>
                      <div className="flex flex-col gap-2 items-start sm:items-center">
                        <p className="text-xs">
                          By submitting your videos to Toon Central, you
                          acknowledge that you agree to Toon Central’s{" "}
                          <Link
                            href="/terms"
                            className="text-[#4ADD80] ml-1 mr-1"
                          >
                            Terms of Service
                          </Link>{" "}
                          and{" "}
                          <Link
                            href="/policies"
                            className="text-[#4ADD80] ml-1"
                          >
                            Community Guidelines.
                          </Link>
                        </p>
                        <p className="text-xs">
                          Please be sure not to violate others’ copyright or
                          privacy right.{" "}
                          <Link
                            href="/policies"
                            className="text-[#4ADD80] ml-1"
                          >
                            Learn more
                          </Link>
                        </p>
                      </div>
                    </div>
                  </div>
                )}
                {/* Step 2 */}
                {formStep === 1 && (
                  <div className="bg-none md:bg-[#151D29] h-full  w-full px-[0rem] py-[1.5rem] md:px-[1.5rem] md:py-[2.5rem] lg:px-[4.5rem] lg:py-[3.5rem] ">
                    <div className="flex gap-10 flex-col-reverse md:flex-row">
                      <div className="bg-[#151D29] md:bg-none px-[0.8rem] py-[1rem] flex flex-col gap-5 md:py-0 md:px-0 ">
                        <h3 className="text-xl">Details</h3>
                        <div className="flex flex-col gap-1">
                          <label className="text-sm text-gray-300">
                            Title{" "}
                            <span className="text-gray-400">(required)</span>
                          </label>
                          <div className="relative">
                            <input
                              type="text"
                              value={values.title}
                              onChange={(e) =>
                                setFieldValue("title", e.target.value)
                              }
                              maxLength={100}
                              className="w-full bg-[#0f172a] border border-[#05834B] rounded-lg px-3 py-2 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-green-500"
                              name="title"
                              placeholder="Enter title"
                            />
                            <span className="absolute right-3 bottom-1 text-sm text-gray-400">
                              {title.length}/100
                            </span>
                          </div>
                          <ErrorMessage
                            name="title"
                            component="p"
                            className="text-[#880808] text-sm"
                          />
                        </div>

                        {/* Description Field */}
                        <div className="flex flex-col gap-4">
                          <label className="text-sm text-gray-300">
                            Description
                          </label>
                          <textarea
                            value={values.description}
                            onChange={(e) =>
                              setFieldValue("description", e.target.value)
                            }
                            placeholder="Tell viewers about your video (type @ to mention a channel)"
                            className="w-full h-32 bg-[#0f172a] border border-[#05834B] rounded-lg px-3 py-2 text-white placeholder-gray-500 resize-none focus:outline-none focus:ring-2 focus:ring-green-500"
                            name="description"
                            rows={4}
                          />
                          <ErrorMessage
                            name="description"
                            component="p"
                            className="text-[#880808] text-sm"
                          />
                        </div>

                        {/* Comic Selection Field */}
                        <div className="flex flex-col gap-2">
                          <label className="text-sm text-gray-300">
                            Attach to Comic{" "}
                            <span className="text-gray-400">(optional)</span>
                          </label>
                          <Select
                            placeholder="Select a comic (optional)"
                            selectedKeys={
                              values.comicId ? [values.comicId] : []
                            }
                            onSelectionChange={(keys) => {
                              const selectedKey = Array.from(keys)[0] as string;
                              setFieldValue("comicId", selectedKey || "");
                              setFieldValue(
                                "belongToComic",
                                selectedKey ? "1" : "0"
                              );
                            }}
                            className="w-full"
                            classNames={{
                              trigger:
                                "bg-[#0f172a] border border-[#05834B] text-white",
                              value: "text-white",
                              popoverContent: "bg-[#0f172a]",
                            }}
                            isLoading={isLoadingComics}
                            disabled={isLoadingComics}
                          >
                            <SelectItem
                              key=""
                              value=""
                              className="text-white hover:bg-[#05834B]"
                            >
                              Independent Short
                            </SelectItem>
                            {comics?.map((comic: any) => (
                              <SelectItem
                                key={comic.id}
                                value={comic.id}
                                className="text-white hover:bg-[#05834B]"
                              >
                                {comic.title || comic.name}
                              </SelectItem>
                            ))}
                          </Select>
                        </div>

                        {/* Overlay image upload */}
                        <div className="flex flex-col gap-2">
                          <label className="text-sm text-gray-300">
                            Overlay image (optional)
                          </label>
                          <div className="flex items-center gap-3">
                            <label
                              htmlFor="overlayUpload"
                              className={`${
                                uploadImageMutation.isPending
                                  ? "bg-gray-500 cursor-not-allowed"
                                  : "bg-gradient-to-r from-[#00A96E] to-[#22C55E] cursor-pointer"
                              } text-white px-4 py-2 rounded-md inline-block text-sm`}
                            >
                              {uploadImageMutation.isPending
                                ? "Uploading..."
                                : "Upload overlay image"}
                            </label>
                            <input
                              id="overlayUpload"
                              type="file"
                              accept="image/*"
                              className="hidden"
                              onChange={(e) =>
                                handleOverlayFile(e, setFieldValue)
                              }
                              disabled={uploadImageMutation.isPending}
                            />
                            {overlayPreview && (
                              <img
                                src={overlayPreview}
                                alt="overlay preview"
                                className="w-24 h-24 object-cover rounded"
                              />
                            )}
                          </div>
                          <ErrorMessage
                            name="overlayUrl"
                            component="p"
                            className="text-[#880808] text-sm"
                          />
                        </div>

                        <div className="flex flex-col gap-3">
                          <h3 className="text-xl">Audience</h3>
                          <p className="text-medium ">
                            is this video for kids? (required)
                          </p>
                          <p className="text-medium text-[#969AA0]">
                            Regardless of your location, you’re legally required
                            to comply with the Children’s Online Privacy
                            Protection Act (COPPA) and/or other laws. You’re
                            required to tell us whether your videos are made for
                            kids.
                          </p>
                          <RadioGroup
                            color="success"
                            value={values.isForKids}
                            onChange={(e) =>
                              setFieldValue("isForKids", e.target.value)
                            }
                          >
                            <Radio value={"1"}>
                              Yes it&apos;s made for kids
                            </Radio>
                            <Radio value={"2"}> aged 18 years and older</Radio>
                          </RadioGroup>
                          <ErrorMessage
                            name="isForKids"
                            component="p"
                            className="text-[#880808] text-sm"
                          />
                        </div>
                      </div>
                      <div className="bg-[#151D29] md:bg-none px-[0.8rem] py-[1rem] md:py-0 md:px-0 flex flex-col gap-5">
                        <div className="relative w-full h-full md:max-w-[40rem] md:max-h-[35rem] overflow-hidden">
                          <video
                            controls
                            src={
                              values.url
                                ? values.url
                                : "https://www.w3schools.com/html/mov_bbb.mp4"
                            }
                            className="w-full h-full object-contain"
                          />
                          {overlayPreview && (
                            <img
                              src={overlayPreview}
                              alt="overlay"
                              className="absolute bottom-4 right-4 w-28 h-16 object-cover rounded-md border border-slate-700"
                            />
                          )}
                        </div>
                        <p>Video link</p>
                        <div className="flex gap-5">
                          <Link
                            href={`${values.url}`}
                            className="text-[#05834B]"
                          >
                            {`${values.url.slice(0, 40)}...`}
                          </Link>{" "}
                          <Copyicon />
                        </div>
                        <p>Filename</p>

                        <p>BigBuckBunny.mp4</p>
                      </div>
                    </div>
                    <div className="flex justify-between mt-10  items-center">
                      <p className="text-medium text-[#969AA0]">
                        Check complete. Copyright potrcted content found.
                      </p>
                      <button
                        onClick={() =>
                          handleNext(validateForm, setErrors, setFormStep)
                        }
                        className="bg-gradient-to-r from-[#00A96E] to-[#22C55E] text-white px-6 py-3 rounded-md"
                      >
                        Next
                      </button>
                    </div>
                  </div>
                )}

                {/* Step 3 */}
                {formStep === 2 && (
                  <div className=" md:bg-[#151D29] h-screen w-full  px-[1rem] py-[1.5rem] md:px-[1.5rem] md:py-[2.5rem] lg:px-[4.5rem] lg:py-[3.5rem] flex flex-col  justify-between">
                    <div className="flex flex-col gap-8">
                      <h3 className="text-xl"> Checks</h3>
                      <p className="text-[#969AA0]">
                        We’ll check your video for issues that may restrict its
                        visibility and then you will have the opportunity to fix
                        issues before publishing your video.{" "}
                        <Link href={"#"} className="text-[#05834B]">
                          Learn more
                        </Link>
                      </p>

                      <div className="flex flex-col gap-7">
                        <h3 className="text-medium">Copyright</h3>
                        <p className="flex gap-4">
                          <CautionIcon className="h-8 w-8" />
                          <p className="text-[#969AA0]">
                            {" "}
                            Copyright-protected content found. People in some
                            countries can’t watch your video.
                          </p>
                        </p>
                        <p className="text-[#969AA0]">
                          Remember. These check result aren’t final. Issues may
                          come up in the future that impact your video.{" "}
                          <Link href={"#"} className="text-[#05834B]">
                            Learn more
                          </Link>
                        </p>
                      </div>
                    </div>

                    <div className="flex justify-between mt-10">
                      <div className="flex gap-1">
                        <CopyrightCheckIcon className="h-5 w-5" />{" "}
                        <p>
                          Check complete. Copyright protected content found.
                        </p>
                      </div>
                      <button
                        onClick={() =>
                          handleNext(validateForm, setErrors, setFormStep)
                        }
                        className="bg-gradient-to-r from-[#00A96E] to-[#22C55E] text-white px-6 py-3 rounded-md"
                      >
                        Next
                      </button>
                    </div>
                  </div>
                )}
                {
                  // Step 4
                  formStep === 3 && (
                    <div className="bg-none md:bg-[#151D29] h-full md:h-full w-full px-[0rem] py-[1.5rem] md:px-[1.5rem] md:py-[2.5rem] lg:px-[4.5rem] lg:py-[3.5rem]">
                      <h3 className="text-xl mb-5">Visibility</h3>
                      <p className="text-[#969AA0] mb-5">
                        Choose when to publish and who can see your video
                      </p>
                      <div className="flex gap-10 flex-col-reverse md:flex-row">
                        <div className="w-full md:w-2/3 flex flex-col justify-between bg-[#151D29] md:bg-none px-[0.5rem] py-[1.5rem] sm:px-[1.5rem] sm:py-[2.5rem] md:px-[0rem] md:py-[0rem]">
                          <div className="border-[1px] border-[#05834B] rounded-xl flex flex-col gap-3 p-5 ">
                            <h3 className="text-medium">Save or publish</h3>
                            <p>
                              Make your video{" "}
                              <Link href={"#"} className="text-[#05834B]">
                                public or private
                              </Link>{" "}
                            </p>
                            <div className="ml-8">
                              <RadioGroup
                                color="success"
                                value={values.visibility}
                                onChange={(e) =>
                                  setFieldValue("visibility", e.target.value)
                                }
                              >
                                <Radio
                                  value="public"
                                  description="Any one with the video link can watch your video"
                                >
                                  Public
                                </Radio>
                                <Radio
                                  value="private"
                                  description="Only you and people you choose can watch your video"
                                >
                                  Private
                                </Radio>
                              </RadioGroup>
                            </div>
                          </div>
                          <div className="flex justify-between items-center ">
                            <span className="flex gap-2">
                              <ForwardShortsIcon className="h-5 w-5" />
                              <p>Share to</p>
                            </span>
                            <div className="flex gap-7">
                              <FacebookShareButton url={"#"}>
                                <div className="bg-[#475467] p-1 rounded-full">
                                  <FacebookShortsIcon className="h-9 w-9" />
                                </div>
                              </FacebookShareButton>
                              <Link href={"#"}>
                                <div className="bg-[#475467] p-1 rounded-full ">
                                  <WhatsappshortsIcon className="h-9 w-9" />
                                </div>
                              </Link>
                              <TelegramShareButton url={"#"}>
                                <div className="bg-[#475467] p-1 rounded-full">
                                  <TelegramShortsIcon className="h-9 w-9" />
                                </div>
                              </TelegramShareButton>
                            </div>
                          </div>
                        </div>
                        <div className="flex flex-col w-full gap-5 md:w-1/2 bg-[#151D29] md:bg-none px-[0.5rem] py-[1.5rem] sm:px-[1.5rem] sm:py-[2.5rem] md:px-[0rem] md:py-[0rem]">
                          <div className="w-full h-full md:max-w-[40rem] md:max-h-[35rem] overflow-hidden">
                            <video
                              controls
                              src={
                                values.url
                                  ? values.url
                                  : "https://www.w3schools.com/html/mov_bbb.mp4"
                              }
                              className="w-full h-full object-contain"
                            />
                          </div>
                          <p>Video link</p>
                          <div className="flex gap-5">
                            <Link
                              href={
                                "http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4"
                              }
                            >
                              http://commondatastorage.googleapis.com/gtv...{" "}
                            </Link>
                            <Copyicon />
                          </div>
                          <p>Filename</p>

                          <p>BigBuckBunny.mp4</p>
                        </div>
                      </div>
                      <div className=" flex flex-col gap-5 mt-8">
                        <h3>Monetization</h3>
                        <div className="flex gap-5">
                          <TailwindSwitch
                            enabled={enabled}
                            setEnabled={setEnabled}
                          />
                          <p>Monetize this episode?</p>
                        </div>

                        {/* <div className="border-1 border-[#3D434D] rounded-lg py-8 px-10 flex flex-col gap-5">
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
                            <p>
                              Monitization is only available from chapter 4
                              onwards
                            </p>
                          </div>
                        </div> */}
                      </div>
                      <div className="flex justify-between mt-10">
                        <div className="flex gap-1">
                          <CopyrightCheckIcon className="h-5 w-5" />{" "}
                          <p>
                            Check complete. Copyright protected content found.
                          </p>
                        </div>
                        <button
                          type="submit"
                          className="bg-gradient-to-r from-[#00A96E] to-[#22C55E] text-white px-6 py-3 rounded-md"
                        >
                          submit
                        </button>
                      </div>
                    </div>
                  )
                }
              </Form>
            )}
          </Formik>
        </div>
      </div>
    </div>
  );
}

export default Page;
