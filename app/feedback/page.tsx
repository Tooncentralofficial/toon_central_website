"use client";
import { ChangeEvent } from "react";
import { FlatInput, FlatSelect } from "../_shared/inputs_actions/inputFields";
import H2SectionTitle from "../_shared/layout/h2SectionTitle";
import { SelectItem } from "@nextui-org/react";

export default function Page() {
  return (
    <div className="parent-wrap py-10">
      <div className="child-wrap">
        <div className="w-full min-h-dvh">
          <H2SectionTitle title="Submit a request" />
          <form
            // onSubmit={formik.handleSubmit}
            className="bg-[var(--bg-secondary)] p-6 md:p-9 rounded-[8px]"
          >
            <div className="w-full flex flex-col gap-6">
              <FlatInput
                label={"Your email address"}
                name={"title"}
                value={""}
                onChange={() => ""}
                // onBlur={formik.handleBlur}
                // error={Boolean(formik.errors.title && formik.touched.title)}
                // isDisabled={addNew.isPending}
              />
              <FlatInput
                label={"What best descibes your issue"}
                name={"title"}
                value={""}
                onChange={() => ""}
                // onBlur={formik.handleBlur}
                // error={Boolean(formik.errors.title && formik.touched.title)}
                // isDisabled={addNew.isPending}
              />
              <FlatInput
                label={"What is your account username"}
                name={"title"}
                value={""}
                onChange={() => ""}
                // onBlur={formik.handleBlur}
                // error={Boolean(formik.errors.title && formik.touched.title)}
                // isDisabled={addNew.isPending}
              />
              <FlatInput
                label={"what is your device os"}
                name={"title"}
                value={""}
                onChange={() => ""}
                // onBlur={formik.handleBlur}
                // error={Boolean(formik.errors.title && formik.touched.title)}
                // isDisabled={addNew.isPending}
              />
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
