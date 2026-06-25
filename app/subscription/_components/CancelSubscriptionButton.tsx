"use client";
import React from "react";
import {
  Button,
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  useDisclosure,
} from "@nextui-org/react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useDispatch, useSelector } from "react-redux";
import { usePathname } from "next/navigation";
import { toast } from "react-toastify";
import { postRequestProtected } from "@/app/utils/queries/requests";
import { selectAuthState, setSubscription } from "@/lib/slices/auth-slice";

export default function CancelSubscriptionButton({
  planName,
  className,
  isCancelled,
}: {
  planName: string;
  className?: string;
  isCancelled: boolean;
}) {
  const { token } = useSelector(selectAuthState);
  const pathname = usePathname();
  const dispatch = useDispatch();
  const queryClient = useQueryClient();
  const { isOpen, onOpen, onClose, onOpenChange } = useDisclosure();

  const { mutate: cancel, isPending } = useMutation({
    mutationKey: ["cancel-subscription"],
    mutationFn: () =>
      postRequestProtected(
        {},
        "recurring-subscription/cancel",
        token || "",
        pathname,
        "json"
      ),
    onSuccess: (data) => {
      if (data?.success) {
        toast(data?.message || "Subscription cancelled", {
          toastId: "cancel-subscription",
          type: "success",
        });
        dispatch(setSubscription({ hasSubscription: false, name: null }));
        queryClient.invalidateQueries({ queryKey: ["subscription_status"] });
        onClose();
      } else {
        toast(data?.message || "Could not cancel. Please try again.", {
          toastId: "cancel-subscription",
          type: "error",
        });
      }
    },
    onError: (error) => {
      console.log("@@cancel-subscription error", error);
      toast("Something went wrong. Please try again.", {
        toastId: "cancel-subscription",
        type: "error",
      });
    },
  });

  return (
    <>
      <Button onPress={onOpen} className={className} isDisabled={isCancelled}>
        {isCancelled ? "Subscription Cancelled" : "Cancel Subscription"}
      </Button>

      <Modal
        isOpen={isOpen}
        onOpenChange={onOpenChange}
        placement="center"
        backdrop="blur"
        classNames={{
          base: "bg-[#0F1622] text-[#FCFCFD]",
          closeButton: "text-[#7f8ca0]",
        }}
      >
        <ModalContent>
          {(close) => (
            <>
              <ModalHeader className="flex flex-col gap-1">
                Cancel subscription?
              </ModalHeader>
              <ModalBody>
                <p className="text-sm text-[#cdd6e2]">
                  Cancel your{" "}
                  <span className="font-semibold">{planName}</span> subscription?
                  You&apos;ll keep access until the current period ends, and it
                  won&apos;t renew after that.
                </p>
              </ModalBody>
              <ModalFooter>
                <Button
                  variant="light"
                  onPress={close}
                  isDisabled={isPending}
                  className="text-[#cdd6e2]"
                >
                  Keep subscription
                </Button>
                <Button
                  onPress={() => cancel()}
                  isLoading={isPending}
                  className="bg-[#E11D48] text-[#FCFCFD] font-semibold"
                >
                  Yes, cancel
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
}
