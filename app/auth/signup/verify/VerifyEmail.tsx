"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useDispatch } from "react-redux";
import { loginSuccess } from "@/lib/slices/auth-slice";
import { toast } from "react-toastify";
import { useMutation } from "@tanstack/react-query";
import { getRequest } from "@/app/utils/queries/requests";

interface VerifyEmailProps {
  verification_code: string | string[] | undefined;
  email: string | string[] | undefined;
  verifyResult?: any;
}

export default function VerifyEmail({
  verification_code,
  email,
  verifyResult,
}: VerifyEmailProps) {
  const router = useRouter();
  const dispatch = useDispatch();
  const [verificationStatus, setVerificationStatus] = useState<
    "verifying" | "success" | "error"
  >("verifying");

  // Verify email mutation (client-side verification if server didn't provide result)
  const verifyEmail = useMutation({
    mutationFn: () => {
      const code =
        typeof verification_code === "string"
          ? verification_code
          : verification_code?.[0] || "";
      return getRequest(`/onboard/verify?verification_code=${code}`);
    },
    onSuccess: (data) => {
      handleVerificationSuccess(data);
    },
    onError: (error: any) => {
      setVerificationStatus("error");
      toast(
        error?.response?.data?.message ||
          "An error occurred during verification",
        {
          toastId: "verify-email-error",
          type: "error",
        }
      );
    },
  });

  const handleVerificationSuccess = (data: any) => {
    const isSuccess = data?.success === true || data?.status === true;
    if (!isSuccess) {
      setVerificationStatus("error");
      toast(data?.message || "Verification failed", {
        toastId: "verify-email-error",
        type: "error",
      });
      return;
    }

    setVerificationStatus("success");

    const resolveEmail = () => {
      const fromData = data?.data?.email;
      if (fromData)
        return typeof fromData === "string" ? fromData : fromData[0] ?? "";
      return typeof email === "string" ? email : email?.[0] || "";
    };

    // Check if verify endpoint returns auth data (profile, accessToken, userType)
    if (
      data?.data?.accessToken &&
      data?.data?.profile &&
      data?.data?.userType
    ) {
      dispatch(loginSuccess(data.data));
      toast("Email verified successfully! Logging you in...", {
        toastId: "verify-email",
        type: "success",
      });
      setTimeout(() => router.push("/"), 1000);
      return;
    }

    // MOVE_USER_TO_SET_PASSWORD or other success without auth: redirect to login (skip set-password)
    const loginToast =
      data?.message === "MOVE_USER_TO_SET_PASSWORD"
        ? "Email verified! Please sign in with your password."
        : "Email verified successfully! Please login to continue.";
    toast(loginToast, {
      toastId: "verify-email-success",
      type: "success",
    });
    const userEmail = resolveEmail();
    setTimeout(
      () => router.push(`/auth/login?email=${encodeURIComponent(userEmail)}`),
      2000
    );
  };

  useEffect(() => {
    if (verificationStatus !== "verifying") return;
    // If verifyResult is provided from server component, use it
    if (verifyResult) {
      const isFailure =
        verifyResult.success === false || verifyResult.status === false;
      if (!isFailure) {
        handleVerificationSuccess(verifyResult);
      } else {
        setVerificationStatus("error");
        toast("Verification failed", {
          toastId: "verify-email-error",
          type: "error",
        });
      }
    } else if (verification_code) {
      // No server result, verify on client
      verifyEmail.mutate();
    }
  }, [verification_code, verifyResult]);

  if (verificationStatus === "verifying") {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[var(--green100)] mb-4"></div>
        <p className="text-xl text-center">Verifying your email...</p>
        <p className="text-sm text-gray-400 mt-2">Please wait</p>
      </div>
    );
  }

  if (verificationStatus === "error") {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px]">
        <div className="text-red-500 text-5xl mb-4">✕</div>
        <p className="text-xl text-center text-red-500">Verification Failed</p>
        <p className="text-sm text-gray-400 mt-2 text-center">
          Could not verify your email. Please try again.
        </p>
        <button
          onClick={() => router.push("/auth/signup")}
          className="mt-6 px-6 py-2 bg-[var(--green100)] text-white rounded-lg hover:opacity-90 transition-opacity"
        >
          Back to Signup
        </button>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-[400px]">
      <div className="text-green-500 text-5xl mb-4">✓</div>
      <p className="text-xl text-center">Email Verified!</p>
      <p className="text-sm text-gray-400 mt-2">Redirecting...</p>
    </div>
  );
}
