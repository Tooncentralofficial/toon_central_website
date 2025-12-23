import { Metadata } from "next";
import ProfileClient from "./profileClient";
import { getRequest } from "@/app/utils/queries/requests";
import { DEFAULT_OG_URL } from "@/app/layout";

type Props = {
  params: { userid: string };
};

export const generateMetadata = async ({
  params,
}: Props): Promise<Metadata> => {
  try {
    const profileData = await getRequest(`/profile/${params?.userid}/view`);

    if (profileData?.success) {
      const data = profileData.data;
      const creatorName =
        data?.username || `${data?.first_name} ${data?.last_name}` || "Creator";
      const description =
        data?.welcome_note || `View ${creatorName}'s profile on Toon Central`;

      const cleanImageUrl = (url: string) => {
        if (!url) return DEFAULT_OG_URL;
        url = url.trim();
        if (url.startsWith("https://res.cloudinary.com")) {
          return url;
        }
        if (url.includes("https://res.cloudinary.com")) {
          const cloudinaryIndex = url.indexOf("https://res.cloudinary.com");
          return url.substring(cloudinaryIndex);
        }
        if (url.startsWith("/")) {
          return `https://tooncentralhub.com${url}`;
        }
        if (!url.startsWith("http")) {
          return `https://tooncentralhub.com/${url}`;
        }
        return url;
      };

      const profileImage = cleanImageUrl(data?.photo || DEFAULT_OG_URL);

      const images = [
        {
          url: profileImage,
          width: 1200,
          height: 630,
          alt: `${creatorName} - Toon Central Creator`,
        },
      ];

      return {
        title: `${creatorName} - Toon Central Creator Profile`,
        description: description,
        openGraph: {
          title: `${creatorName} - Toon Central Creator Profile`,
          description: description,
          url: `https://tooncentralhub.com/profile/${params.userid}`,
          type: "profile",
          images: images,
        },
        twitter: {
          card: "summary_large_image",
          site: "@tooncentralhub",
          title: `${creatorName} - Toon Central Creator Profile`,
          description: description,
          images: images,
        },
      };
    }
  } catch (error) {
    console.error(
      "Error generating metadata for profile:",
      params?.userid,
      error
    );
  }

  return {
    title: "Creator Profile - Toon Central",
    description: "View creator profile on Toon Central",
  };
};

export default async function Page({ params }: Props) {
  return <ProfileClient params={{ userid: params.userid }} />;
}
