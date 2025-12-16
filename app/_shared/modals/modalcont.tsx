"use client";
import {
  Button,
  Divider,
  Input,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  Spinner,
} from "@nextui-org/react";
import { usePathname } from "next/navigation";
import { ReactNode, useEffect } from "react";
import OtakuBanner from "@/public/static/images/events/otakubanner.jpg";
export interface ModalBaseProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenChange: () => void;
  children: ReactNode;
}
const ModalContainer = ({
  isOpen,
  onClose,
  onOpenChange,
  children,
}: ModalBaseProps) => {
  const pathname = usePathname();
  useEffect(() => {
    onClose();
  }, [pathname]);
  return (
    <Modal
      isOpen={isOpen}
      onOpenChange={onOpenChange}
      placement="center"
      className="bg-[#FFFFFF] text-[#000000]"
      classNames={{
        closeButton: "hidden",
      }}
      size="4xl"
    >
      <ModalContent
        style={{
          backgroundImage: `url(${OtakuBanner.src})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        {(onClose) => (
          <>
            <ModalHeader className="flex  gap-1 w-full items-start justify-end">
              <Button
                isIconOnly
                size="sm"
                variant="light"
                className="text-[#000000] items-center "
                onPress={onClose}
              >
                ✖️
              </Button>
            </ModalHeader>
            <ModalBody>{children}</ModalBody>
            <ModalFooter className="bg-transparent"></ModalFooter>
          </>
        )}
      </ModalContent>
    </Modal>
  );
};

export default ModalContainer;
