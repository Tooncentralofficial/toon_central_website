"use client";

import { useFormik } from "formik";
import { InputOutline } from "../../_shared/inputs_actions/inputFields";
import * as Yup from "yup";
import Link from "next/link";
import { getRequest, postRequest } from "@/app/utils/queries/requests";
import { useMutation, useQuery } from "@tanstack/react-query";
import { SolidPrimaryButton } from "@/app/_shared/inputs_actions/buttons";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import { useState, useMemo } from "react";
import { CountryCodeSelector } from "./_shared/CountryCodeSelector";
import { MobileOperatorSelect } from "./_shared/MobileOperatorSelect";

const Page = () => {
  const router = useRouter();
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [isConfirmPasswordVisible, setIsConfirmPasswordVisible] =
    useState(false);

  const { data: countries } = useQuery({
    queryKey: ["countries"],
    queryFn: () => getRequest("/selectables/countries"),
  });

  const countriesList = useMemo(() => {
    return countries?.data || [];
  }, [countries]);

  // Find Nigeria as default country
  const defaultCountry = useMemo(() => {
    return (
      countriesList.find(
        (country: any) => country.name?.toLowerCase() === "nigeria"
      ) || countriesList[0]
    );
  }, [countriesList]);

  const initialValues = useMemo(
    () => ({
      firstName: "",
      lastName: "",
      username: "",
      email: "",
      countryCode: defaultCountry?.id?.toString() || "",
      phoneNumber: "",
      mobileOperator: "",
      password: "",
      confirmPassword: "",
      referralCode: "",
    }),
    [defaultCountry]
  );

  const validationSchema = Yup.object().shape({
    firstName: Yup.string().required("First name is required"),
    lastName: Yup.string().required("Last name is required"),
    username: Yup.string()
      .required("Username is required")
      .min(3, "Username must be at least 3 characters"),
    email: Yup.string()
      .email("Invalid email address")
      .required("Email is required")
      .typeError("Invalid email address"),
    countryCode: Yup.string().required("Country code is required"),
    phoneNumber: Yup.string()
      .required("Phone number is required")
      .test("phone-format", "Invalid phone number format", function (value) {
        if (!value) return false;
        const selectedCountry = countriesList.find(
          (country: any) =>
            country.id.toString() === this.parent.countryCode?.toString()
        );
        if (!selectedCountry) return true; // Skip validation if country not selected
        // Basic validation - can be enhanced based on country-specific rules
        const digitsOnly = value.replace(/\D/g, "");
        return digitsOnly.length >= 7 && digitsOnly.length <= 15;
      }),
    mobileOperator: Yup.string().required("Mobile operator is required"),
    password: Yup.string()
      .required("Password is required")
      .min(8, "Password must be at least 8 characters"),
    confirmPassword: Yup.string()
      .required("Confirm password is required")
      .oneOf([Yup.ref("password")], "Passwords must match"),
    referralCode: Yup.string(),
  });
  const formik = useFormik({
    initialValues,
    validationSchema,
    enableReinitialize: true,
    onSubmit: (values) => {
      console.log("@@values", values);
      // Map form values to API expected format
      const submitData = {
        firstName: values.firstName,
        lastName: values.lastName,
        username: values.username,
        email: values.email,
        countryId: parseInt(values.countryCode),
        telephone: values.phoneNumber,
        mobileOperatorId: parseInt(values.mobileOperator),
        password: values.password,
        confirmedPassword: values.confirmPassword,
        ...(values.referralCode && { referralCode: values.referralCode }),
      };
      registerUser.mutate(submitData);
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
        console.log("@@code", code);
        router.push(
          `/auth/signup/verify?email=${formik.values.email}&verification_code=${code}`
        );
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
      <div className=" ">
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
              value={formik.values.firstName}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              isInvalid={Boolean(
                formik.touched.firstName && formik.errors.firstName
              )}
              errorMessage={formik.errors.firstName}
            />
            <InputOutline
              name="lastName"
              label="Last Name"
              labelPlacement="outside"
              placeholder="Enter last name"
              value={formik.values.lastName}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              isInvalid={Boolean(
                formik.touched.lastName && formik.errors.lastName
              )}
              errorMessage={formik.errors.lastName}
            />
          </div>

          <InputOutline
            name="username"
            label="Username"
            labelPlacement="outside"
            placeholder="Enter username"
            value={formik.values.username}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            isInvalid={Boolean(
              formik.touched.username && formik.errors.username
            )}
            errorMessage={formik.errors.username}
          />

          <InputOutline
            name="email"
            label="Email"
            labelPlacement="outside"
            placeholder="tooncentral@gmail.com"
            value={formik.values.email}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
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

          <div className="flex flex-col lg:flex-row gap-4">
            <div className="w-full lg:w-auto lg:min-w-[140px]">
              <CountryCodeSelector
                label="Code"
                placeholder="Select"
                countries={countriesList}
                value={formik.values.countryCode}
                onChange={(value) => {
                  formik.setFieldValue("countryCode", value);
                }}
                isInvalid={Boolean(
                  formik.touched.countryCode && formik.errors.countryCode
                )}
              />
            </div>
            <div className="flex-1">
              <InputOutline
                name="phoneNumber"
                label="Phone Number"
                labelPlacement="outside"
                placeholder="Mobile number"
                type="tel"
                value={formik.values.phoneNumber}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                isInvalid={Boolean(
                  formik.touched.phoneNumber && formik.errors.phoneNumber
                )}
                errorMessage={formik.errors.phoneNumber}
              />
            </div>
          </div>

          <MobileOperatorSelect
            label="Mobile Operator"
            placeholder="Select mobile operator"
            value={formik.values.mobileOperator}
            onChange={(value) => {
              formik.setFieldValue("mobileOperator", value);
            }}
            isInvalid={Boolean(
              formik.touched.mobileOperator && formik.errors.mobileOperator
            )}
            errorMessage={formik.errors.mobileOperator}
          />

          <InputOutline
            name="password"
            label="Password"
            type={isPasswordVisible ? "text" : "password"}
            labelPlacement="outside"
            placeholder="Enter password"
            value={formik.values.password}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            isInvalid={Boolean(
              formik.touched.password && formik.errors.password
            )}
            errorMessage={formik.errors.password}
            endContent={
              <div
                onClick={() => setIsPasswordVisible(!isPasswordVisible)}
                className="cursor-pointer"
              >
                <svg
                  width="16"
                  height="15"
                  viewBox="0 0 16 15"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M15.5112 5.7713C14.9096 4.78615 14.1507 3.90616 13.2647 3.16626L15.1307 1.30029C15.2521 1.1746 15.3193 1.00626 15.3177 0.831527C15.3162 0.656794 15.2461 0.489648 15.1226 0.366088C14.999 0.242529 14.8319 0.172442 14.6571 0.170924C14.4824 0.169405 14.3141 0.236577 14.1884 0.35797L12.1591 2.38988C10.9012 1.64271 9.46307 1.25328 8 1.26363C3.8742 1.26363 1.52307 4.08792 0.488783 5.7713C0.169253 6.28811 0 6.88371 0 7.49133C0 8.09894 0.169253 8.69454 0.488783 9.21136C1.0904 10.1965 1.84927 11.0765 2.73528 11.8164L0.869308 13.6824C0.805659 13.7438 0.754889 13.8174 0.719963 13.8987C0.685037 13.98 0.666653 14.0674 0.665884 14.1559C0.665115 14.2444 0.681976 14.3322 0.715484 14.4141C0.748993 14.496 0.798476 14.5704 0.861048 14.6329C0.92362 14.6955 0.998027 14.745 1.07993 14.7785C1.16183 14.812 1.24958 14.8289 1.33807 14.8281C1.42656 14.8273 1.514 14.809 1.59531 14.774C1.67661 14.7391 1.75015 14.6883 1.81163 14.6247L3.84554 12.5908C5.10192 13.3378 6.53832 13.7279 8 13.719C12.1258 13.719 14.4769 10.8947 15.5112 9.21136C15.8307 8.69454 16 8.09894 16 7.49133C16 6.88371 15.8307 6.28811 15.5112 5.7713ZM1.62436 8.51362C1.43452 8.20643 1.33397 7.85244 1.33397 7.49133C1.33397 7.13021 1.43452 6.77623 1.62436 6.46904C2.51337 5.02557 4.52262 2.59647 8 2.59647C9.10644 2.59028 10.1973 2.85694 11.1762 3.37285L9.83465 4.71436C9.19485 4.28958 8.42778 4.09925 7.66361 4.17565C6.89945 4.25206 6.18525 4.59049 5.64221 5.13354C5.09917 5.67658 4.76073 6.39077 4.68433 7.15494C4.60792 7.91911 4.79825 8.68617 5.22303 9.32598L3.6836 10.8654C2.8673 10.2055 2.17072 9.40992 1.62436 8.51362ZM9.99926 7.49133C9.99926 8.02156 9.78862 8.53008 9.41369 8.90502C9.03876 9.27995 8.53024 9.49059 8 9.49059C7.70312 9.48944 7.41035 9.42109 7.14365 9.29066L9.79933 6.63498C9.92976 6.90168 9.99811 7.19445 9.99926 7.49133ZM6.00074 7.49133C6.00074 6.96109 6.21138 6.45257 6.58631 6.07764C6.96124 5.7027 7.46976 5.49207 8 5.49207C8.29688 5.49322 8.58965 5.56157 8.85635 5.69199L6.20067 8.34768C6.07024 8.08098 6.00189 7.78821 6.00074 7.49133ZM14.3756 8.51362C13.4866 9.95708 11.4774 12.3862 8 12.3862C6.89356 12.3924 5.80266 12.1257 4.82384 11.6098L6.16535 10.2683C6.80515 10.6931 7.57222 10.8834 8.33639 10.807C9.10055 10.7306 9.81475 10.3922 10.3578 9.84912C10.9008 9.30608 11.2393 8.59188 11.3157 7.82771C11.3921 7.06355 11.2017 6.29648 10.777 5.65667L12.3164 4.11724C13.1327 4.77719 13.8293 5.57274 14.3756 6.46904C14.5655 6.77623 14.666 7.13021 14.666 7.49133C14.666 7.85244 14.5655 8.20643 14.3756 8.51362Z"
                    fill="#9FA6B2"
                  />
                </svg>
              </div>
            }
          />

          <InputOutline
            name="confirmPassword"
            label="Confirm Password"
            type={isConfirmPasswordVisible ? "text" : "password"}
            labelPlacement="outside"
            placeholder="Confirm password"
            value={formik.values.confirmPassword}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            isInvalid={Boolean(
              formik.touched.confirmPassword && formik.errors.confirmPassword
            )}
            errorMessage={formik.errors.confirmPassword}
            endContent={
              <div
                onClick={() =>
                  setIsConfirmPasswordVisible(!isConfirmPasswordVisible)
                }
                className="cursor-pointer"
              >
                <svg
                  width="16"
                  height="15"
                  viewBox="0 0 16 15"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M15.5112 5.7713C14.9096 4.78615 14.1507 3.90616 13.2647 3.16626L15.1307 1.30029C15.2521 1.1746 15.3193 1.00626 15.3177 0.831527C15.3162 0.656794 15.2461 0.489648 15.1226 0.366088C14.999 0.242529 14.8319 0.172442 14.6571 0.170924C14.4824 0.169405 14.3141 0.236577 14.1884 0.35797L12.1591 2.38988C10.9012 1.64271 9.46307 1.25328 8 1.26363C3.8742 1.26363 1.52307 4.08792 0.488783 5.7713C0.169253 6.28811 0 6.88371 0 7.49133C0 8.09894 0.169253 8.69454 0.488783 9.21136C1.0904 10.1965 1.84927 11.0765 2.73528 11.8164L0.869308 13.6824C0.805659 13.7438 0.754889 13.8174 0.719963 13.8987C0.685037 13.98 0.666653 14.0674 0.665884 14.1559C0.665115 14.2444 0.681976 14.3322 0.715484 14.4141C0.748993 14.496 0.798476 14.5704 0.861048 14.6329C0.92362 14.6955 0.998027 14.745 1.07993 14.7785C1.16183 14.812 1.24958 14.8289 1.33807 14.8281C1.42656 14.8273 1.514 14.809 1.59531 14.774C1.67661 14.7391 1.75015 14.6883 1.81163 14.6247L3.84554 12.5908C5.10192 13.3378 6.53832 13.7279 8 13.719C12.1258 13.719 14.4769 10.8947 15.5112 9.21136C15.8307 8.69454 16 8.09894 16 7.49133C16 6.88371 15.8307 6.28811 15.5112 5.7713ZM1.62436 8.51362C1.43452 8.20643 1.33397 7.85244 1.33397 7.49133C1.33397 7.13021 1.43452 6.77623 1.62436 6.46904C2.51337 5.02557 4.52262 2.59647 8 2.59647C9.10644 2.59028 10.1973 2.85694 11.1762 3.37285L9.83465 4.71436C9.19485 4.28958 8.42778 4.09925 7.66361 4.17565C6.89945 4.25206 6.18525 4.59049 5.64221 5.13354C5.09917 5.67658 4.76073 6.39077 4.68433 7.15494C4.60792 7.91911 4.79825 8.68617 5.22303 9.32598L3.6836 10.8654C2.8673 10.2055 2.17072 9.40992 1.62436 8.51362ZM9.99926 7.49133C9.99926 8.02156 9.78862 8.53008 9.41369 8.90502C9.03876 9.27995 8.53024 9.49059 8 9.49059C7.70312 9.48944 7.41035 9.42109 7.14365 9.29066L9.79933 6.63498C9.92976 6.90168 9.99811 7.19445 9.99926 7.49133ZM6.00074 7.49133C6.00074 6.96109 6.21138 6.45257 6.58631 6.07764C6.96124 5.7027 7.46976 5.49207 8 5.49207C8.29688 5.49322 8.58965 5.56157 8.85635 5.69199L6.20067 8.34768C6.07024 8.08098 6.00189 7.78821 6.00074 7.49133ZM14.3756 8.51362C13.4866 9.95708 11.4774 12.3862 8 12.3862C6.89356 12.3924 5.80266 12.1257 4.82384 11.6098L6.16535 10.2683C6.80515 10.6931 7.57222 10.8834 8.33639 10.807C9.10055 10.7306 9.81475 10.3922 10.3578 9.84912C10.9008 9.30608 11.2393 8.59188 11.3157 7.82771C11.3921 7.06355 11.2017 6.29648 10.777 5.65667L12.3164 4.11724C13.1327 4.77719 13.8293 5.57274 14.3756 6.46904C14.5655 6.77623 14.666 7.13021 14.666 7.49133C14.666 7.85244 14.5655 8.20643 14.3756 8.51362Z"
                    fill="#9FA6B2"
                  />
                </svg>
              </div>
            }
          />

          <InputOutline
            name="referralCode"
            label="Referral Code (Optional)"
            labelPlacement="outside"
            placeholder="Enter referral code"
            value={formik.values.referralCode}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            isInvalid={Boolean(
              formik.touched.referralCode && formik.errors.referralCode
            )}
            errorMessage={formik.errors.referralCode}
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
