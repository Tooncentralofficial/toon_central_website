import { AddBox, RemoveBox } from "@/app/_shared/icons/icons";
import Image from "next/image";
import { useSelector } from "react-redux";
import { selectAuthState } from "@/lib/slices/auth-slice";
import { getRequestProtected } from "@/app/utils/queries/requests";
import { useMemo } from "react";
import { parseArray } from "@/helpers/parsArray";
import { useQueryClient, useMutation } from "@tanstack/react-query";
import { usePathname, useRouter } from "next/navigation";
import { toast } from "react-toastify";
import Likes from "@/app/_shared/cards/likes";
interface Genre {
  id: number; // Unique identifier for the genre
  name: string; // Name of the genre
  slug: string; // Slug for the genre
  description: string; // Description of the genre
  created_at: string; // Timestamp for creation
  updated_at: string; // Timestamp for the last update
}

export interface ComicGenre {
  id: number; // Unique identifier for the comic-genre relationship
  comic_id: number; // Associated comic ID
  genre_id: number; // Genre ID
  genre: Genre; // The nested genre object

}
const TrendingItem = ({ data ,refetchTrending}: { data: any,refetchTrending: any }) => {
  const { user, token } = useSelector(selectAuthState);
  const queryClient = useQueryClient();
  const pathname = usePathname();
  const queryKey = `comic_${data.uuid}`;
  const { mutate: likeComic, isPending } = useMutation({
    mutationKey: ["like"],
    mutationFn: () =>
      getRequestProtected(`/comics/${data.uuid}/like`, token, pathname),
    onSuccess: (data) => {
      if (data?.success) {
        toast(data?.message === 'you have successfully liked this comic' ? 'Comic has been added to your library' : 'Comic has been removed from your library', {
          toastId: `toast_${data.uuid}`,
          type: "success",
        });
        refetchTrending();
        queryClient.invalidateQueries({
          queryKey: [queryKey],
        });
        queryClient.invalidateQueries({
          queryKey: ['my_likes'],
        });
        return;
      }
      toast(data?.message, {
        toastId: `toast_${data.uuid}`,
        type: "error",
      });
    },
    onError(error, variables, context) {
      toast("Failed to like", {
        toastId: `toast_${data.uuid}`,
        type: "error",
      });
    },
  });
  const subscribed = useMemo(() => {
    return parseArray(data?.likesAndViews?.likes).some((value) => {
      return value?.user_id === user?.id;
    });
  }, [user, data]);
  console.log(data.genres);
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
        <div className=" flex flex-col gap-2">
          <span className="font-bold">{data.title} </span>
          <span className="flex">
            {data.genres.map((item: ComicGenre, i: number) => (
              <p
                key={i}
                className={`text-[#FCFCFD] font-extralight text-[0.75rem] ${
                  i < data.genres.length - 1 && "mr-1"
                }`}
              >
                {item.genre.name}
                {i < data.genres.length - 1 && ","}
              </p>
            ))}
          </span>
          <Likes
            likesNViews={data?.likesAndViews}
            queryKey={queryKey}
            uid={data?.uuid}
            favourites={data?.favourites}
          />
        </div>
      </div>
      {subscribed ? (
        <div
          onClick={() => likeComic()}
          className={"cursor-pointer hover:bg-[#afb0af21] p-2 rounded-full"}
        >
          <RemoveBox />
        </div>
      ) : (
        <div
          onClick={() => likeComic()}
          className={"cursor-pointer hover:bg-[#afb0af21] p-2 rounded-full"}
        >
          <AddBox />
        </div>
      )}
    </div>
  );
};

export default TrendingItem;
