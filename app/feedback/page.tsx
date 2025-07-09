"use client";
import { ChangeEvent } from "react";
import { FlatInput, FlatSelect, FlatTextarea } from "../_shared/inputs_actions/inputFields";
import H2SectionTitle from "../_shared/layout/h2SectionTitle";
import { Button, SelectItem } from "@nextui-org/react";
import { issues, loginMethods } from "../utils/constants/constants";
import Link from "next/link";
import InputPicture from "../_shared/inputs_actions/inputPicture";
import { useFormik } from "formik";
import * as Yup from "yup";
import { SolidPrimaryButton } from "../_shared/inputs_actions/buttons";
const BANNER_SIZE = "1952 x 587";
export default function Page() {
  const initialValues = {
    backgroundImage: [],
    email:"",
    issue:"",
    loginMethod:"",
    description: "",
    os:"",
    username :"",
    subject:"",
  };
  const validationSchema = Yup.object().shape({
    backgroundImage: Yup.mixed().optional(),
    email: Yup.string().required(" is required"),
    issue: Yup.string().required(" is required"),
    username: Yup.string().required(" is required"),
   
    subject: Yup.string().required(" is required"),
    description: Yup.string().required(" is required"),
    loginMethod: Yup.string().optional(),
    os: Yup.string().required(" is required"),
  });

  const formik = useFormik({
    initialValues,
    validationSchema,
    onSubmit: (values:any) => {
      console.log(values)
      let formData = new FormData();
      if (values.backgroundImage) {
        if (Array.isArray(values.backgroundImage)) {
          // If it's an array of files
          values.backgroundImage.forEach((file: File, index: number) => {
            formData.append(`backgroundImage[${index}]`, file);
          });
          console.log(
            `Added ${values.backgroundImage.length} files to formData`
          );
        } else {
          // If it's a single file
          formData.append("backgroundImage", values.backgroundImage);
          console.log("Added single file to formData");
        }
      }

      formData?.append("title", values.title);
      formData?.append("email", values.email);
      formData?.append("description", values.description);
      formData?.append("issue", values.issue);
      formData?.append("loginMethod", values.loginMethod);
      formData?.append("username", values.username);
      formData?.append("os", values.os);
      formData?.append("subject", values.subject);
      // addNew.mutate(formData);
    },
    enableReinitialize: true,
  });
  return (
    <div className="parent-wrap py-10">
      <div className="child-wrap">
        <div className="w-full min-h-dvh">
          <H2SectionTitle title="Submit a request" />
          <form
            onSubmit={formik.handleSubmit}
            className="bg-[var(--bg-secondary)] p-6 md:p-9 rounded-[8px]"
          >
            <div className="w-full flex flex-col gap-6">
              <FlatInput
                label={"Your email address"}
                name={"email"}
                value={formik.values.email}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={Boolean(formik.errors.email && formik.touched.email)}
                // isDisabled={addNew.isPending}
              />
              <FlatSelect
                labelPlacement="outside"
                label="What best describes your issue?"
                name="issue"
                value={formik.values.issue}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                placeholder="Select status"
                isInvalid={Boolean(
                  formik.errors.issue && formik.touched.issue
                )}
                selectedKeys={[formik.values.issue]}
                // isDisabled={addNew.isPending}
              >
                {issues.map((item) => (
                  <SelectItem key={item.id} value={item.id.toString()}>
                    {item.name}
                  </SelectItem>
                ))}
              </FlatSelect>
              <FlatSelect
                labelPlacement="outside"
                label="What is your login method"
                name="loginMethod"
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                placeholder="Select status"
                isInvalid={Boolean(
                  formik.errors.loginMethod && formik.touched.loginMethod
                )}
                selectedKeys={[formik.values.loginMethod]}
                // isDisabled={addNew.isPending}
              >
                {loginMethods.map((item) => (
                  <SelectItem key={item.id} value={item.id.toString()}>
                    {item.name}
                  </SelectItem>
                ))}
              </FlatSelect>
              <FlatInput
                label={"What is your account username"}
                name={"username"}
                value={formik.values.username}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={Boolean(formik.errors.username && formik.touched.username)}
              />

              <div>
                <h3>Privacy Notice</h3>
                <p>
                  Toon Central will process the information you provide to
                  assist with your inquiry. For more details on how we handle
                  your information, please refer to our{" "}
                  <Link href={"/policies"} className="text-blue-600 underline">
                    Privacy Policy
                  </Link>
                  .
                </p>
              </div>

              <FlatSelect
                labelPlacement="outside"
                label="What is your device operating system"
                name="os"
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                placeholder="Select status"
                isInvalid={Boolean(
                  formik.errors.os && formik.touched.os
                )}
                selectedKeys={[formik.values.os]}
                // isDisabled={addNew.isPending}
              >
                {loginMethods.map((item) => (
                  <SelectItem key={item.id} value={item.id.toString()}>
                    {item.name}
                  </SelectItem>
                ))}
              </FlatSelect>

              <FlatTextarea
                label={"Subject"}
                name={"subject"}
                value={formik.values.subject}
                placeholder="provide a brief summary of your request or issue"
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={Boolean(formik.errors.subject && formik.touched.subject)}
              />

              <FlatTextarea
                label={"Description"}
                name={"description"}
                value={formik.values.description}
                placeholder="Enter the details of your request or feedback. For faster verification and support, please attach a screenshot of your account information (e.g., the Settings page from the app)."
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={Boolean(formik.errors.description && formik.touched.description)}
              />

              <div className="mt-5 flex flex-col gap-1.5">
                <label className="">Comic Banner</label>
                <InputPicture
                  multiple
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

              <div className="flex mt-10 gap-5">
                <SolidPrimaryButton
                  className="w-full"
                  isLoading={false}
                  type="submit"
                >
                  Submit
                </SolidPrimaryButton>
                <Button
                  // onPress={goBack}
                  className="w-full  rounded-lg"
                  size="lg"
                >
                  Cancel
                </Button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
