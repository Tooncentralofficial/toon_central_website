"use client";

import H2SectionTitle from "@/app/_shared/layout/h2SectionTitle";
import { useFormik } from "formik";
import * as Yup from "yup";
import { toast } from "react-toastify";
import {
  QueryClient,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import {
  getRequest,
  getRequestProtected,
  patchRequestProtected,
  postRequestProtected,
} from "@/app/utils/queries/requests";
import InputPicture from "@/app/_shared/inputs_actions/inputPicture";
import { Button, MenuItem, Select } from "@nextui-org/react";
import { useSelector } from "react-redux";
import {
  selectAuthState,
  updateProfile,
  updateSuccess,
} from "@/lib/slices/auth-slice";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useDispatch } from "react-redux";
import { usePathname } from "next/navigation";
import { DateInput } from "@nextui-org/react";
import {  parseDate } from "@internationalized/date";
export default function DetailsTab() {
  const queryClient = useQueryClient();
  const pathname = usePathname();
  const dispatch = useDispatch();
  const [profile, setProfile] = useState<any>(null);
  const [countries, setCountries] = useState<any>([]);
  const { user, userType, token } = useSelector(selectAuthState);
  const parse = (dateString: any): any => {
    if (!dateString) return null; // Handle undefined or empty values properly
    const [year, month, day] = dateString.split("-");
    return new Date(parseInt(year), parseInt(month) - 1, parseInt(day));
  };
  const initialValues = useMemo(() => {
    let vals = {
      photo: profile?.photo || user?.photo || "",
      firstName: profile?.firstName || user?.first_name || "",
      lastName: profile?.lastName || user?.last_name || "",
      phone: profile?.phone || user?.phone || "",
      username: profile?.username || user?.username || "",
      countryId: profile?.countryId || user?.country_id || null,
      dob: profile?.dob || user?.dob || "",
      email: profile?.email || user?.email || "",
      welcomeNote: profile?.welcomeNote || user?.welcome_note || "",
    };
    return vals;
  }, [user, profile]);

  const initialPhoto = useMemo(() => {
    let vals = {
      photo: profile?.photo || user?.photo || "",
    };
    return vals;
  }, [user, profile]);

  const { data, isLoading, isFetching, isSuccess } = useQuery({
    queryKey: ["user_details"],
    queryFn: () => getRequestProtected("/profile", token, pathname),
    enabled: token !== null,
  });

  const {
    data: countriesData,
    isLoading: countriesLoading,
    isSuccess: countriesSuccess,
  } = useQuery({
    queryKey: ["countyList"],
    queryFn: () => getRequest("/selectables/countries"),
  });
  console.log(countriesData)
  useEffect(() => {
    if (isSuccess) {
      setProfile(data?.data);
    }
    if (countriesSuccess) {
      setCountries(countriesData?.data);
    }
  }, [isSuccess, isLoading, isFetching, countriesSuccess]);

  const validationSchema = Yup.object().shape({
    welcomeNote: Yup.string().required(" is required"),
    username: Yup.string().required(" is required"),
    // email: Yup.string().required(" is required"),
    phone: Yup.string().required(" is required"),
    dob: Yup.string()
      .required("Date of birth is required")
      .test("is-18", "You must be at least 18 years old", function (value) {
        const today = new Date();
        const birthDate = new Date(value);
        const age = today.getFullYear() - birthDate.getFullYear();
        const monthDifference = today.getMonth() - birthDate.getMonth();
        if (
          monthDifference < 0 ||
          (monthDifference === 0 && today.getDate() < birthDate.getDate())
        ) {
          return age > 18;
        }
        return age >= 18;
      }),
    firstName: Yup.string().required(" is required"),
    lastName: Yup.string().required(" is required"),
    countryId: Yup.number().required("is required"),
  });
  const photoValidation = Yup.object().shape({
    photo: Yup.mixed().required(" is required"),
  });
  const formik = useFormik({
    initialValues,
    validationSchema,
    enableReinitialize: true,
    onSubmit: (values) => {
      updateUser.mutate(values);
    },
  });

  const updateProfileFormik = useFormik({
    initialValues: initialPhoto,
    validationSchema: photoValidation,
    enableReinitialize: true,
    onSubmit: (values) => {
      let formData = new FormData();
      formData.append("photo", values.photo);
      updateProfilePicture.mutate(formData);
    },
  });

  const updateUser = useMutation({
    mutationFn: (data: any) =>
      patchRequestProtected(data, "profile/update", token || "", pathname),
    onSuccess(data, variables, context) {
      const { success, message, data: resData } = data;
      if (success) {
        dispatch(updateProfile(null));
        toast(message, {
          toastId: "profile",
          type: "success",
        });
      } else {
        toast(message, {
          toastId: "profile",
          type: "error",
        });
      }
    },
    onError(error, variables, context) {
      toast("Some error occured. Contact help !", {
        toastId: "profile",
        type: "error",
      });
    },
  });

  const updateProfilePicture = useMutation({
    mutationFn: (data: any) =>
      postRequestProtected(
        data,
        "/profile/upload-image",
        token || "",
        pathname,
        "form"
      ),
    onSuccess(data, variables, context) {
      const { success, message, data: resData } = data;
      if (success) {
        toast(message, {
          toastId: "profile",
          type: "success",
        });
      } else {
        toast(message, {
          toastId: "profile",
          type: "error",
        });
      }
    },
    onError(error, variables, context) {
      toast("Some error occured. Contact help !", {
        toastId: "profile",
        type: "error",
      });
    },
  });
  return (
    <div className="w-full min-h-dvh">
      <H2SectionTitle title="Profile" />
      <form
        onSubmit={formik.handleSubmit}
        className="bg-[var(--bg-secondary)] p-6 md:p-9 rounded-[8px]"
      >
        <div className="flex flex-col xl:flex-row gap-6">
          <div className="w-full xl:w-[40%]">
            <div className="flex flex-col gap-2">
              <label>Profile photo</label>
              <InputPicture
                formik={updateProfileFormik}
                fieldName={"photo"}
                submitOnChange={true}
                isLoading={updateProfilePicture.isPending}
              />
            </div>
          </div>
          <div className="w-full xl:w-[60%] pt-6 flex flex-col gap-4">
            <div className="flex gap-6 mb-1">
              @ToonCentral 1.1k subscription 20.1k subscribers
            </div>
            <div className="flex justify-between items-center bg-[#FBFBFB] p-4 rounded-[12px]">
              <div className="flex flex-col gap-2 min-w-[50%]">
                <label className="text-[#272727]">Username</label>
                <input
                  name="username"
                  aria-label="username"
                  placeholder="Enter username"
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  value={formik.values.username}
                  className={`text-[#000000] p-2 rounded-md ${
                    Boolean(formik.errors.username)
                      ? "bg-[#efc2c2]"
                      : " bg-[#FBFBFB]"
                  }  outline-none`}
                />
              </div>

              {/* <Button
                    variant="bordered"
                    className="border-[#EAEAEA] text-[#272727]"
                  >
                    Edit
                  </Button> */}
            </div>
            <div className="flex flex-col sm:flex-row gap-6 justify-between items-start bg-[#FBFBFB] p-4 rounded-[12px]">
              <div className="flex flex-col gap-2 min-w-[30%] outline">
                <label className="text-[#272727]">First Name</label>
                <input
                  disabled={updateUser.isPending}
                  name="firstName"
                  aria-label="firstName"
                  placeholder="Enter first name"
                  onChange={formik.handleChange}
                  value={formik.values.firstName}
                  className={`text-[#000000] p-2 rounded-md ${
                    Boolean(formik.errors.firstName)
                      ? "bg-[#efc2c2]"
                      : " bg-[#FBFBFB]"
                  }  outline-none`}
                />
              </div>
              <div className="flex flex-col gap-2 min-w-[30%]">
                <label className="text-[#272727]">Last name</label>
                <input
                  disabled={updateUser.isPending}
                  name="lastName"
                  aria-label="lastName"
                  placeholder="Enter last name"
                  onChange={formik.handleChange}
                  value={formik.values.lastName}
                  className={`text-[#000000] p-2 rounded-md ${
                    Boolean(formik.errors.lastName)
                      ? "bg-[#efc2c2]"
                      : " bg-[#FBFBFB]"
                  }  outline-none`}
                />
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-6 justify-between items-start bg-[#FBFBFB] p-4 rounded-[12px]">
              <div className="flex flex-col gap-2 min-w-[30%] outline">
                <label className="text-[#272727]">Phone</label>
                <input
                  disabled={updateUser.isPending}
                  name="phone"
                  aria-label="phone"
                  placeholder="Enter phone"
                  onChange={formik.handleChange}
                  value={formik.values.phone}
                  className={`text-[#000000] p-2 rounded-md ${
                    Boolean(formik.errors.phone)
                      ? "bg-[#efc2c2]"
                      : " bg-[#FBFBFB]"
                  }  outline-none`}
                />
              </div>
              {/* <div className="flex flex-col gap-2 min-w-[30%]">
                    <label className="text-[#272727]">Email</label>
                    <input
                      disabled={updateUser.isPending}
                      name="email"
                      aria-label="email"
                      placeholder="Enter email"
                      onChange={formik.handleChange}
                      value={formik.values.email}
                      className={`text-[#000000] p-2 rounded-md ${
                        Boolean(formik.errors.email)
                          ? "bg-[#efc2c2]"
                          : " bg-[#FBFBFB]"
                      }  outline-none`}
                    />
                  </div> */}
            </div>
            <div className="flex flex-col sm:flex-row gap-6 justify-between items-start bg-[#FBFBFB] p-4 rounded-[12px]">
              <div className="flex flex-col gap-2 ">
                <label className="text-[#272727]">Date of Birth</label>
                <DateInput
                  name="dob"
                  isInvalid={Boolean(formik.touched.dob && formik.errors.dob)}
                  onChange={(value: any) => {
                    const formattedDate = new Date(value)
                      .toISOString()
                      .split("T")[0];
                    formik.setFieldValue("dob", formattedDate);
                  }}
                  value={
                    formik.values.dob ? parseDate(formik.values.dob) : undefined
                  }
                  
                  variant="flat"
                  color="primary"
                  size="lg"
                  classNames={{
                    innerWrapper:
                      "bg-[#FFFFFF] border-none focus:ring-0 focus:border-none hover:border-none outline-none",
                    input:
                      "text-[#000000] bg-[#FFFFFF] border-none focus:ring-0 focus:border-none hover:border-none outline-none",
                  }}
                />
              </div>
            </div>
            <div className="flex flex-col sm:flex-row gap-6 justify-between items-start bg-[#FBFBFB] p-4 rounded-[12px]">
              <div className="flex flex-col gap-2 min-w-[30%] outline">
                <label className="text-[#272727]">Country</label>
                <select
                  disabled={!isSuccess}
                  name="countryId"
                  aria-label="countryId"
                  onChange={(e) =>
                    formik.setFieldValue("countryId", e.target.value)
                  }
                  value={parseInt(formik.values.countryId)}
                  className={`text-[#000000] p-2 rounded-md ${
                    Boolean(formik.errors.countryId)
                      ? "bg-[#efc2c2]"
                      : " bg-[#FBFBFB]"
                  } outline-none`}
                >
                  <option value="" label="Select country" />
                  {countries?.map((country: any, index: any) => (
                    <option key={index} value={country?.id}>
                      {country?.name}
                    </option>
                  ))}
                </select>
              </div>
              {/* <div className="flex flex-col gap-2 min-w-[30%]">
                    <label className="text-[#272727]">Email</label>
                    <input
                      disabled={updateUser.isPending}
                      name="email"
                      aria-label="email"
                      placeholder="Enter email"
                      onChange={formik.handleChange}
                      value={formik.values.email}
                      className={`text-[#000000] p-2 rounded-md ${
                        Boolean(formik.errors.email)
                          ? "bg-[#efc2c2]"
                          : " bg-[#FBFBFB]"
                      }  outline-none`}
                    />
                  </div> */}
            </div>

            <div className="flex justify-between items-center bg-[#FBFBFB] p-4 rounded-[12px]">
              <div className="flex flex-col gap-2 min-w-[50%]">
                <label className="text-[#272727]">Description of self</label>
                <input
                  disabled={updateUser.isPending}
                  name="welcomeNote"
                  aria-label="welcomeNote"
                  placeholder="Enter welcome note"
                  onChange={formik.handleChange}
                  value={formik.values.welcomeNote}
                  className={`text-[#000000] p-2 rounded-md ${
                    Boolean(formik.errors.welcomeNote)
                      ? "bg-[#efc2c2]"
                      : " bg-[#FBFBFB]"
                  }  outline-none`}
                />
              </div>
            </div>
          </div>
        </div>
        {/* <InputPicture formik={formik} fieldName={""} /> */}
        <div className="flex mt-7 gap-5">
          <Button
            isLoading={updateUser.isPending}
            type="submit"
            className="w-full rounded-lg"
            size="lg"
          >
            Update
          </Button>
          <Button className="w-full   rounded-lg" size="lg" color="danger">
            Delete account
          </Button>
        </div>
      </form>
    </div>
  );
}
