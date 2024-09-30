"use client";

import { useFormik } from "formik";
import { InputOutline } from "../../_shared/inputs_actions/inputFields";
import * as Yup from "yup";
import Link from "next/link";

import { useMutation } from "@tanstack/react-query";
import { SolidPrimaryButton } from "@/app/_shared/inputs_actions/buttons";
import { useState } from "react";
import { postRequest } from "@/app/utils/queries/requests";
import { toast } from "react-toastify";
import { useDispatch } from "react-redux";
import { loginSuccess } from "@/lib/slices/auth-slice";
import { useRouter } from "next/navigation";
import { LoginUser } from "../login/login";

const Page = () => {
  const dispatch = useDispatch();
  const [isText, setIsText] = useState(false);
  const router = useRouter();
  const initialValues = {
    email: "",
  };
  const validationSchema = Yup.object().shape({
    email: Yup.string().required("Email is required"),
  });
  const formik = useFormik({
    initialValues,
    validationSchema,
    onSubmit: (values) => {
      reset.mutate(values);
    },
  })

  const reset = useMutation({
    mutationKey:["reset"],
    mutationFn: (data: any) => postRequest(data, "/onboard/forgot-password"),
    onSuccess(data, variables, context) {
      const { success, message, data: resData } = data;
      if (success) {
        toast(message, {
          toastId: "reset",
          type: "success",
        });
        const code = resData;
        router.push(`/auth/signup/verify?email=${formik.values.email}&verification_code=${code}`);
        // dispatch(loginSuccess(resData));
        // router.push("/");
      } else {
        toast(message, {
          toastId: "reset",
          type: "error",
        });
      }
    },
    onError(error, variables, context) {},
  });

  return (
    <form onSubmit={formik.handleSubmit}>
      <div className="">
        <p className="text-3xl text-center">Forgot Password</p>
        <p className="my-5 text-center">
          Read Anywhere. Create Anytime. Get started with us to unlock a world
          of comics and creativity
        </p>
        <div className="flex flex-col gap-4">
          <InputOutline
            name="email"
            label="Email"
            labelPlacement="outside"
            placeholder=" "
            onChange={formik.handleChange}
            isInvalid={Boolean(formik.touched.email && formik.errors.email)}
            //  errorMessage={formik.errors.email}
          />
        </div>
        <SolidPrimaryButton
          className="mt-6"
          type="submit"
          isLoading={reset.isPending}
        >
          Send Reset link
        </SolidPrimaryButton>
        <div className="flex gap-1 text-md justify-center mt-2">
          <Link href="/auth/login">
            <span className="text-[var(--green100)]">Login</span>
          </Link>
        </div>
      </div>
    </form>
  );
};

export default Page;
