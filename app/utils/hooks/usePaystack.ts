import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { selectAuthState } from "@/lib/slices/auth-slice";
import { toast } from "react-toastify";

interface PaystackConfig {
  amount: number;
  planType: string;
  onSuccess: (reference: string) => void;
  onClose?: () => void;
}

declare global {
  interface Window {
    PaystackPop: any;
  }
}
// type InitiatePaymentFn = (config: PaystackConfig) => void;

export const usePaystack = () => {
  const { user } = useSelector(selectAuthState);
  const [isReady, setIsReady] = useState(false);
  const publicKey = process.env.NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY as string;

  // Load Paystack script
  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://js.paystack.co/v1/inline.js";
    script.async = true;
    script.onload = () => {
      setIsReady(true);
    };
    script.onerror = () => {
      toast.error("Failed to load Paystack. Please try again.", {
        toastId: "paystack-load-error",
      });
    };
    document.head.appendChild(script);

    return () => {
      if (script.parentNode) {
        script.parentNode.removeChild(script);
      }
    };
  }, []);

  const initiatePayment = (config: PaystackConfig) => {
    const { amount, planType, onSuccess, onClose } = config;

    if (!isReady) {
      toast.error("Payment system is loading. Please try again.", {
        toastId: "paystack-not-ready",
      });
      return;
    }

    if (!user?.email) {
      toast.error("User email not found. Please log in again.", {
        toastId: "user-email-error",
      });
      return;
    }

    const handler = window.PaystackPop.setup({
      key: publicKey,
      email: user.email,
      amount: amount * 100, // convert to kobo
      currency: "NGN",
      ref: `${Date.now()}`, // generate unique reference
      metadata: {
        custom_fields: [
          {
            display_name: "Plan Type",
            variable_name: "plan_type",
            value: planType,
          },
          {
            display_name: "User ID",
            variable_name: "user_id",
            value: user?.id || "unknown",
          },
        ],
      },
      onClose: () => {
        toast.info("Payment cancelled.", { toastId: "payment-cancelled" });
        if (onClose) onClose();
      },
      callback: (response: any) => {
        // Dummy call - backend will integrate verify endpoint later
        console.log("Payment Success:", response);
        const reference = response.reference;

        // Store reference in localStorage for backend sync
        localStorage.setItem(`payment_ref_${Date.now()}`, reference);

        toast.success("Payment initiated successfully!", {
          toastId: "payment-success",
        });

        if (onSuccess) {
          onSuccess(reference);
        }
      },
    });

    handler.openIframe();
  };

  return {
    isReady,
    initiatePayment,
  };
};
