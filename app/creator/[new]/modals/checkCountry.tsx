import { SolidPrimaryButton } from "@/app/_shared/inputs_actions/buttons";
import { ModalBaseProps } from "@/app/_shared/layout/search";
import {
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
} from "@nextui-org/react";
import Link from "next/link";

const CheckCountry = ({ isOpen, onOpenChange, onClose }: ModalBaseProps) => {
  return (
    <Modal
      isDismissable={false}
      hideCloseButton
      isKeyboardDismissDisabled={false}
      isOpen={isOpen}
      onOpenChange={onOpenChange}
      placement="center"
    >
      <ModalContent>
        {(onClose) => (
          <>
            <ModalHeader className="flex flex-col gap-1"></ModalHeader>
            <ModalBody className="flex flex-col gap-5 justify-center">
              <p className="text-center">
                Update your country to continue creating
              </p>
              <Link href="/user/profile">
                <SolidPrimaryButton>Update</SolidPrimaryButton>
              </Link>
            </ModalBody>
            <ModalFooter></ModalFooter>
          </>
        )}
      </ModalContent>
    </Modal>
  );
};

export default CheckCountry;
