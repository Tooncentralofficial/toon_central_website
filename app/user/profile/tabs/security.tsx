"use client";

import H2SectionTitle from "@/app/_shared/layout/h2SectionTitle";
import { useFormik } from "formik";
import * as Yup from "yup";
import { toast } from "react-toastify";
import { useMutation, useQuery } from "@tanstack/react-query";
import {
  getRequestProtected,
  patchRequestProtected,
  postRequestProtected,
} from "@/app/utils/queries/requests";
import InputPicture from "@/app/_shared/inputs_actions/inputPicture";
import { Button } from "@nextui-org/react";
import { useSelector } from "react-redux";
import { selectAuthState } from "@/lib/slices/auth-slice";
import { useEffect, useMemo, useState } from "react";

export default function SecurityTab() {
  const [profile, setProfile] = useState<any>({});
  const { user, userType, token } = useSelector(selectAuthState);
  const initialValues = {
    password: "",
    confirmedPassword: "",
  };
  const { data, isLoading, isFetching, isSuccess } = useQuery({
    queryKey: ["user_details"],
    queryFn: () => getRequestProtected("/profile", token),
  });
  useEffect(() => {
    if (isSuccess) {
      setProfile(data?.data);
    }
  }, [isSuccess, isLoading]);
  const validationSchema = Yup.object().shape({
    password: Yup.string()
      .required("This field is required")
      .min(8, "Password must be at least 6 characters"),
    // .matches(
    //   /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d\W_]*$/, //[a-zA-Z\d\W_]*$
    //   "Must Contain One Uppercase, a letter and a number or symbol"
    // ),
    confirmedPassword: Yup.string().test(
      "passwords-match",
      "Passwords must match",
      function (value) {
        return this.parent.password === value;
      }
    ),
  });
  const formik = useFormik({
    initialValues,
    validationSchema,
    enableReinitialize: true,
    onSubmit: (values) => {
      updatePassword.mutate(values);
    },
  });

  const updatePassword = useMutation({
    mutationFn: (data: any) =>
      patchRequestProtected(data, "/profile/change-password", token || ""),
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

  const updateProfilePicture = useMutation({
    mutationFn: (data: any) =>
      postRequestProtected(data, "/profile/upload-image", token || "", "form"),
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
      <H2SectionTitle title="Security" />
      <form
        onSubmit={formik.handleSubmit}
        className="bg-[var(--bg-secondary)] p-6 md:p-9 rounded-[8px]"
      >
        <div className="flex flex-col xl:flex-row gap-6">
          <div className="w-full  pt-6 flex flex-col gap-4">
           

            <div className="flex flex-col sm:flex-row gap-6 justify-between items-start bg-[#FBFBFB] p-4 rounded-[12px]">
              <div className="flex flex-col gap-2 min-w-[30%] outline">
                <label className="text-[#272727]">Password</label>
                <input
                  disabled={updatePassword.isPending}
                  name="password"
                  aria-label="password"
                  placeholder="Enter password"
                  onChange={formik.handleChange}
                  value={formik.values.password}
                  className={`text-[#000000] p-2 rounded-md ${
                    Boolean(formik.errors.password)
                      ? "bg-[#efc2c2]"
                      : " bg-[#FBFBFB]"
                  }  outline-none`}
                />
              </div>
            </div>
            <div className="flex justify-between items-center bg-[#FBFBFB] p-4 rounded-[12px]">
              <div className="flex flex-col gap-2 min-w-[50%]">
                <label className="text-[#272727]">Confirm password</label>
                <input
                  disabled={updatePassword.isPending}
                  name="confirmedPassword"
                  aria-label="confirmedPassword"
                  placeholder="Must match password"
                  onChange={formik.handleChange}
                  value={formik.values.confirmedPassword}
                  className={`text-[#000000] p-2 rounded-md ${
                    Boolean(formik.errors.confirmedPassword)
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
            isLoading={updatePassword.isPending}
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
