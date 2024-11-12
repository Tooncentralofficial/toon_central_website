"use client";

import { useFormik } from "formik";
import { InputOutline } from "../../_shared/inputs_actions/inputFields";
import * as Yup from "yup";
import Link from "next/link";
import { postRequest } from "@/app/utils/queries/requests";
import { useMutation } from "@tanstack/react-query";
import { SolidPrimaryButton } from "@/app/_shared/inputs_actions/buttons";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";

const Page = () => {
  const router = useRouter();
  const initialValues = {
    firstName: "",
    lastName: "",
    email: "",
  };
  const validationSchema = Yup.object().shape({
    firstName: Yup.string().required(" is required"),
    lastName: Yup.string().required("Username is required"),
    email: Yup.string()
      .email()
      .required("Email is required")
      .typeError("Invalid email address"),
  });
  const formik = useFormik({
    initialValues,
    validationSchema,
    onSubmit: (values) => {
      registerUser.mutate(values);
    },
  });

  const registerUser = useMutation({
    mutationFn: (data: any) => postRequest(data, "/onboard/register"),
    onSuccess(data, variables, context) {
      const { success, message, data: resData } = data;
      if (success) {
        
        toast(message, {
          toastId: "signup",
          type: "success",
        });
        const code = resData;
        router.push(`/auth/signup/verify?email=${formik.values.email}&verification_code=${code}`);
      } else {
        
        toast(message, {
          toastId: "signup",
          type: "error",
        });
      }
    },
    onError(error, variables, context) {
      
      toast("Some error occured. Contact help !", {
        toastId: "signup",
        type: "error",
      });
    },
  });
  return (
    <form onSubmit={formik.handleSubmit}>
      <div className="">
        <p className="text-3xl text-center">Create Account</p>
        <p className="my-5 text-center">
          Read Anywhere. Create Anytime. Get started with us to unlock a world
          of comics and creativity
        </p>
        <div className="flex flex-col gap-4">
          <div className="flex flex-col lg:flex-row gap-4">
            <InputOutline
              name="firstName"
              label="First Name"
              labelPlacement="outside"
              placeholder="Enter first name"
              onChange={formik.handleChange}
              isInvalid={Boolean(
                formik.touched.firstName && formik.errors.firstName
              )}
              //  errorMessage={formik.errors.firstName}
            />
            <InputOutline
              name="lastName"
              label="Last Name"
              labelPlacement="outside"
              placeholder="Enter last name"
              onChange={formik.handleChange}
              isInvalid={Boolean(
                formik.touched.lastName && formik.errors.lastName
              )}
              //  errorMessage={formik.errors.lastName}
            />
          </div>

          <InputOutline
            name="email"
            label="Email"
            labelPlacement="outside"
            placeholder=" tooncentral@gmail.com"
            onChange={formik.handleChange}
            isInvalid={Boolean(formik.touched.email && formik.errors.email)}
            errorMessage={formik.errors.email}
            startContent={
              <svg
                width="14"
                height="12"
                viewBox="0 0 14 12"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M11.4001 0.700195C11.9305 0.700195 12.4392 0.910909 12.8143 1.28598C13.1894 1.66105 13.4001 2.16976 13.4001 2.7002V9.10019C13.4001 9.63063 13.1894 10.1393 12.8143 10.5144C12.4392 10.8895 11.9305 11.1002 11.4001 11.1002H2.6001C2.06966 11.1002 1.56096 10.8895 1.18588 10.5144C0.810811 10.1393 0.600098 9.63063 0.600098 9.10019V2.7002C0.600098 2.16976 0.810811 1.66105 1.18588 1.28598C1.56096 0.910909 2.06966 0.700195 2.6001 0.700195H11.4001ZM12.6001 3.869L7.2033 7.04499C7.15228 7.07495 7.09524 7.09322 7.03631 7.09847C6.97738 7.10373 6.91802 7.09585 6.8625 7.07539L6.7969 7.04499L1.4001 3.87059V9.10019C1.4001 9.41845 1.52653 9.72368 1.75157 9.94872C1.97661 10.1738 2.28184 10.3002 2.6001 10.3002H11.4001C11.7184 10.3002 12.0236 10.1738 12.2486 9.94872C12.4737 9.72368 12.6001 9.41845 12.6001 9.10019V3.869ZM11.4001 1.5002H2.6001C2.28184 1.5002 1.97661 1.62662 1.75157 1.85167C1.52653 2.07671 1.4001 2.38194 1.4001 2.7002V2.9418L7.0001 6.2362L12.6001 2.9402V2.7002C12.6001 2.38194 12.4737 2.07671 12.2486 1.85167C12.0236 1.62662 11.7184 1.5002 11.4001 1.5002Z"
                  fill="#9FA6B2"
                />
              </svg>
            }
          />
        </div>
        <SolidPrimaryButton
         className="w-full mt-6"
          type="submit"
          isLoading={registerUser.isPending}
        >
          Create Account
        </SolidPrimaryButton>
        <div className="flex gap-1 text-md justify-center mt-2">
          <span>Already have an Account ? </span>
          <Link href="/auth/login">
            <span className="text-[var(--green100)]">Login</span>
          </Link>
        </div>
      </div>
    </form>
  );
};

export default Page;
