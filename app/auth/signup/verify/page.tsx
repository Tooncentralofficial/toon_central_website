import { axiosInstance } from "@/app/utils/queries/axiosInstance";
import { redirect } from "next/navigation";
import VerifyEmail from "./VerifyEmail";

export default async function Page({
  params,
  searchParams,
}: {
  params: { slug: string };
  searchParams: { [key: string]: string | string[] | undefined };
}) {
  const { verification_code, email } = searchParams;
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
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px]">
        <div className="text-red-500 text-5xl mb-4">✕</div>
        <p className="text-xl text-center text-red-500">Could not verify</p>
        <p className="text-sm text-gray-400 mt-2 text-center">
          The verification code is invalid or has expired.
        </p>
      </div>
    );
  }

  return (
    <VerifyEmail
      verification_code={verification_code}
      email={email}
      verifyResult={verify}
    />
  );
}
