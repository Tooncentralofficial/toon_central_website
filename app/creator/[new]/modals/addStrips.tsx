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

interface AddStripsProps extends ModalBaseProps{
  uuid:string|null,
  comicId:string|null
}

const AddStrips = ({comicId,uuid,isOpen, onOpenChange, onClose }: AddStripsProps) => {
  return (
    <Modal
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
                Add more images or strips to your comic
              </p>
              <Link href={`/user/library/books/addpart?uuid${uuid}&comicId=${comicId}`}>
                <SolidPrimaryButton>Add more</SolidPrimaryButton>
              </Link>
            </ModalBody>
            <ModalFooter></ModalFooter>
          </>
        )}
      </ModalContent>
    </Modal>
  );
};

export default AddStrips;
