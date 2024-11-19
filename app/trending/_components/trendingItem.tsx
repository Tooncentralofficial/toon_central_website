import { AddBox } from "@/app/_shared/icons/icons";
import Image from "next/image";
import { useSelector } from "react-redux";
import { selectAuthState } from "@/lib/slices/auth-slice";
import { getRequestProtected } from "@/app/utils/queries/requests";
import { useMemo } from "react";
import { parseArray } from "@/helpers/parsArray";
import { useQueryClient } from "@tanstack/react-query";
const TrendingItem = ({ data }: { data: any }) => {
  console.log(data)
  const { user, token } = useSelector(selectAuthState);
  const queryClient = useQueryClient();
  //  const { mutate: likeComic, isPending } = useMutation({
  //    mutationKey: ["like"],
  //    mutationFn: () =>
  //      getRequestProtected(`/comics/${data.uuid}/like`, token, pathname),
  //    onSuccess: (data) => {
  //      if (data?.success) {
  //        toast(data?.message, {
  //          toastId: `toast_${data.uuid}`,
  //          type: "success",
  //        });
  //        queryClient.invalidateQueries({
  //          queryKey: [queryKey],
  //        });
  //        return;
  //      }
  //      toast(data?.message, {
  //        toastId: `toast_${uid}`,
  //        type: "error",
  //      });
  //    },
  //    onError(error, variables, context) {
  //      toast("Failed to like", {
  //        toastId: `toast_${uid}`,
  //        type: "error",
  //      });
  //    },
  //  });
  const subscribed = useMemo(() => {
    return parseArray(data?.likesAndViews?.likes).some((value) => {
      return value?.user_id === user?.id;
    });
  }, [user, data]);
  return (
    <div className="flex items-center gap-4 justify-between">
      <div className="flex items-center gap-4">
        <div className="w-[60px] h-[60px] overflow-hidden rounded-[6px]">
          <Image
            src={`${data?.coverImage || ""}`}
            layout="responsive"
            width={60}
            height={60}
            alt={`${data?.title || "toon_central"}`}
            style={{
              objectFit: "cover",
              width: "100%",
              minHeight: "100%",
            }}
          />
        </div>
        <span>{data.title} </span>
      </div>
      {subscribed  ? ""  : <AddBox />}
    </div>
  );
};

export default TrendingItem;
