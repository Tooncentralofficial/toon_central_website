"use client";
import React, { useEffect, useState } from "react";
import shareimg from "@/public/static/images/shareimg.png";
import ModalContainer from "./modalcont";
import Image from "next/image";
import {
  EmailShareButton,
  FacebookShareButton,
  TwitterShareButton,
  LinkedinShareButton,
  WhatsappShareButton,
  WhatsappIcon,
} from "react-share";
import Iconlay from "../layout/iconlay";
import { Facebook, Linkedin, Twitter, Insta, Copyicon } from "../icons/icons";
import copy from "copy-to-clipboard";
import { Input } from "@nextui-org/react";
import { useRouter } from "next/router";
import { usePathname } from "next/navigation";
import { PUBLICURL } from "@/envs";
import { toast } from "react-toastify";
import QRCode from "qrcode";
export interface ModalBaseProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenChange: () => void;
  comicImageUrl: string;
  customUrl?: string;
}

const icons = [
  { label: "Facebook", icon: Facebook },
  { label: "Twitter", icon: Twitter },
  { label: "Linkedin", icon: Linkedin },
  { label: "Instagram", icon: Insta },
];
const ShareModal = ({
  isOpen,
  onClose,
  onOpenChange,
  comicImageUrl,
  customUrl,
}: ModalBaseProps) => {
  const pathname = usePathname();
  const currentUrl =
    customUrl || `${PUBLICURL || "http://localhost:3000"}${pathname}`;
  const [copied, setCopiedId] = useState<string>();
  const [copiedText, setCopiedText] = useState<string>(currentUrl);
  const [qr, setQr] = useState("");
  useEffect(() => {
    QRCode.toDataURL(currentUrl)
      .then((url) => setQr(url))
      .catch((err) => console.error(err));
  }, [currentUrl]);
  return (
    <ModalContainer
      isOpen={isOpen}
      onClose={onClose}
      onOpenChange={onOpenChange}
    >
      <div className="">
        <div className="flex gap-5 items-center">
          <div className="w-[5rem] h-[5rem] rounded-2xl  overflow-auto relative ">
            <div style={{ width: "100%", height: "100%" }}>
              <Image
                src={comicImageUrl} // no "url()" here
                alt="shareimage"
                fill
                style={{
                  objectFit: "cover",
                  objectPosition: "center",
                }}
              />
            </div>
          </div>
          <p className="mt-2 "> Share to your social network</p>
        </div>
        <div className=" flex justify-between mt-4">
          <FacebookShareButton url={currentUrl}>
            <Iconlay label={"Facebook"}>
              <Facebook />
            </Iconlay>
          </FacebookShareButton>
          <TwitterShareButton url={currentUrl}>
            <Iconlay label="x">
              <Twitter />
            </Iconlay>
          </TwitterShareButton>
          <LinkedinShareButton url={currentUrl}>
            <Iconlay label="Linkedin">
              <Linkedin />
            </Iconlay>
          </LinkedinShareButton>
          <WhatsappShareButton url={currentUrl}>
            <Iconlay label="Whatsapp">
              <Insta />
            </Iconlay>
          </WhatsappShareButton>
        </div>
        <div className="mt-4">
          <div className=" w-full h-[0.5px] bg-[#D9D9D9] " />
          <div className="mt-4">
            <p>Copy Share Code</p>
            <div className="relative mt-4">
              <input
                className="bg-[#E3EFF3] w-full rounded-lg h-[3rem] pl-[1rem] pr-[3rem]   "
                value={currentUrl}
              />
              <span
                className="absolute top-[1rem] right-[1rem] hover:cursor-pointer"
                onClick={async () => {
                  if ("clipboard" in navigator) {
                    await navigator.clipboard.writeText(currentUrl);
                  } else {
                    copy(currentUrl);
                  }

                  setCopiedId("write-text");
                  toast("copied", {
                    toastId: "copy text",
                    type: "success",
                  });
                }}
              >
                <Copyicon />
              </span>
            </div>
          </div>

          <div className="mt-4 w-full flex justify-center">
            {qr && <img src={qr} alt="QR Code" />}
          </div>
        </div>
      </div>
    </ModalContainer>
  );
};

export default ShareModal;
