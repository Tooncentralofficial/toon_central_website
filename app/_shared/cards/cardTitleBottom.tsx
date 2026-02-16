"use client";
import Image from "next/image";
import { optimizeCloudinaryUrl } from "@/app/utils/imageUtils";
import Likes from "./likes";
import Link from "next/link";
import { motion } from "framer-motion";
import { getRequestProtected } from "@/app/utils/queries/requests";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useSelector } from "react-redux";
import { selectAuthState } from "@/lib/slices/auth-slice";
import { usePathname, useRouter } from "next/navigation";
import { toast } from "react-toastify";
import { useEffect, useState } from "react";
const COOLDOWN_TIME = 10000; // 10 seconds in milliseconds
const STORAGE_KEY = "global_comic_click_time";
const AD_SEEN_KEY = "global_ad_seen";
const CardTitleBottom = ({
  cardData,
  index,
  cardWidth,
  expand,
  queryKey,
  small,
}: {
  cardData: any;
  index: number;
  cardWidth?: string;
  expand?: boolean;
  queryKey?: string;
  small?: boolean;
}) => {
  const date: number = Date.now();
  const finaltime = date * 9000;

  // const adLink = process.env.NEXT_PUBLIC_AD_LINK;
  const router = useRouter();
  const { user, token } = useSelector(selectAuthState);
  const [isSubscribed, setIsSubscribed] = useState(false);
  useEffect(() => {
    if (user) {
      const isUserSubscribed = cardData?.likesAndViews?.likes?.some(
        (like: any) => like.user_id === user.id
      );
      setIsSubscribed(isUserSubscribed);
    }
  }, [user, cardData]);
  const uid = cardData?.uuid;
  const queryClient = useQueryClient();
  const pathname = usePathname();
  const [lastClickTime, setLastClickTime] = useState(0);
  const [hasSeenAd, setHasSeenAd] = useState(false);
  useEffect(() => {
    const storedTime = localStorage.getItem(STORAGE_KEY);
    if (storedTime) {
      setLastClickTime(parseInt(storedTime));
    }
  }, []);

  // const handleClick= ()=>{
  //   const currentTime = Date.now()
  //   if (!lastClickTime || currentTime-lastClickTime>COOLDOWN_TIME){
  //     if(!hasSeenAd){
  //       window.open(adLink, "_blank");
  //       setHasSeenAd(true);
  //       localStorage.setItem(AD_SEEN_KEY, "true");
  //       router.push(`/comics/${cardData?.uuid}`);
  //     }else{
  //       router.push(`/comics/${cardData?.uuid}`);

  //       if(currentTime - (lastClickTime)>COOLDOWN_TIME){
  //         window.open(adLink, "_blank");

  //       }
  //     }
  //     setLastClickTime(currentTime);
  //     localStorage.setItem(STORAGE_KEY, currentTime.toString());

  //   }else{
  //     router.push(`/comics/${cardData?.uuid}`);
  //   }
  // }

  const { mutate: subscibe, isPending } = useMutation({
    mutationKey: ["subscribe"],
    mutationFn: () =>
      getRequestProtected(`/comics/${uid}/subscribe`, token, pathname),
    onSuccess: (data) => {
      if (data?.success) {
        toast(data?.message, {
          toastId: `toast_${uid}`,
          type: "success",
        });
        setIsSubscribed(!isSubscribed);
        // queryClient.invalidateQueries({
        //   queryKey: [queryKey],
        // });
        return;
      }
      toast(data?.message, {
        toastId: `toast_${uid}`,
        type: "error",
      });
    },
    onError(error, variables, context) {
      toast("Failed to subscribe", {
        toastId: `toast_${uid}`,
        type: "error",
      });
    },
  });
  return (
    <div
      className={`${
        small ? "h-[110px]" : "h-[390px] "
      } md:h-[260px] rounded-[10px] overflow-hidden`}
      style={{ width: cardWidth || "100%" }} // Inline style for dynamic width
      //className="h-[260px] min-w-max w-max  rounded-[8px] overflow-hidden"
    >
      <div className="h-full overflow-hidden w-auto relative">
        <Image
          src={optimizeCloudinaryUrl(cardData?.coverImage ?? "")}
          alt={`${cardData?.title || "toon_central"}`}
          width={200}
          height={260}
          sizes="(max-width: 550px) 83vw, (max-width: 700px) 50vw, (max-width: 1024px) 33vw, 25vw"
          style={{
            objectFit: "cover",
            width: "100%",
            maxWidth: "100%",
            height: "100%",
          }}
          priority
        />
        <Link href={`${cardData?.uuid ? `/comics/${cardData?.uuid}` : ""}`}>
          <div className="absolute top-0 left-0  h-full w-full flex flex-col  p-4 justify-end bg-[#0D111D70] ">
            <div>
              <div className="font-bold text-xl">{cardData?.title}</div>
              <div className="flex justify-between">
                <Likes
                  likesNViews={cardData?.likesAndViews}
                  queryKey={queryKey}
                  uid={cardData?.uuid}
                  favourites={cardData?.favourites}
                />
                {expand &&
                  user?.id && ( //check if user is logged in and expand is true
                    <motion.a
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        subscibe();
                      }}
                      href=""
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ duration: 0.3, delay: 0.2 }}
                      className="bg-[--green100] px-4 py-1 rounded-[4px] hover:cursor-pointer"
                    >
                      {/*check if logged in user is subscibed to this comic */}
                      {isSubscribed ? "Unsubscribe" : "Subscribe"}{" "}
                      {/*if subscribed then show unsubscribe else subscribe*/}
                    </motion.a>
                  )}
              </div>
            </div>
          </div>
        </Link>
      </div>
    </div>
  );
};

export default CardTitleBottom;
