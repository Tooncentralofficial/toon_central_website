import { axiosInstance } from "@/app/utils/queries/axiosInstance";
import { redirect } from "next/navigation";
import SetPassword from "./setPass";

export default async function Page({
  params,
  searchParams,
}: {
  params: { slug: string };
  searchParams: { [key: string]: string | string[] | undefined };
}) {
  const { verification_code,email } = searchParams;
  if (!verification_code) {
    redirect("/auth/signup");
  }
  const verify = await axiosInstance
    .get(`/onboard/verify?verification_code=${verification_code}`)
    .then((data) => data)
    .catch((error: any) => {
      return null;
    });

  if (!verify) {
    return <div>Could not verify</div>;
  }

  return <SetPassword verification_code={verification_code} email={email} />;
}
