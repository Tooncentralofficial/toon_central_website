import { Metadata } from "next";
import PageClient from "./pageClient";
import { getRequest, getRequestProtected } from "@/app/utils/queries/requests";
import { DEFAULT_OG_URL } from "@/app/layout";
import { getToken } from "@/lib/session/retrieveUser";

type Props = {
  params: { shortId: string };
};

export const generateMetadata = async ({
  params,
}: Props): Promise<Metadata> => {
  const token = await getToken();
  const pathname = `/shorts/${params.shortId}`;
  try {
    const { title, description, upload } = await getRequestProtected(
      `/shorts/${params?.shortId}/view`,
      token,
      pathname
    ).then((data) => {
      if (data?.success) {
        console.log(data?.data);
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

        let d = {
          title: data?.data?.title || "Short Video",
          description:
            data?.data?.description || "Watch this short video on Toon Central",
          upload: cleanImageUrl(data?.data?.upload || data?.data?.cover_image),
        };

        return d;
      }
      return {
        title: "",
        description: "",
        upload: DEFAULT_OG_URL,
      };
    });

    const images = [
      {
        url: upload || DEFAULT_OG_URL,
        width: 1200,
        height: 630,
        alt: title || "Toon Central Short",
      },
    ];

    return {
      title: `Toon Central - ${title}`,
      description: description || `Watch ${title} on Toon Central`,

      openGraph: {
        title: `Toon Central - ${title}`,
        description: description || `Watch ${title} on Toon Central`,
        url: `https://tooncentralhub.com/shorts/${params.shortId}`,
        type: "website",
        images: images,
      },

      twitter: {
        card: "summary_large_image",
        site: "@tooncentralhub",
        title: `Toon Central - ${title}`,
        description: description || `Watch ${title} on Toon Central`,
        images: images,
      },
    };
  } catch (error) {
    console.error("❌ Error generating metadata for:", params?.shortId, error);

    return {
      title: "Toon Central - Short",
      description: "Watch short videos on Toon Central",
      openGraph: {
        title: "Toon Central - Short",
        description: "Watch short videos on Toon Central",
        url: `https://tooncentralhub.com/shorts/${params.shortId}`,
        type: "website",
        images: [
          {
            url: DEFAULT_OG_URL,
            width: 1200,
            height: 630,
            alt: "Toon Central Short",
          },
        ],
      },
      twitter: {
        card: "summary_large_image",
        site: "@tooncentralhub",
        title: "Toon Central - Short",
        description: "Watch short videos on Toon Central",
        images: [
          {
            url: DEFAULT_OG_URL,
            width: 1200,
            height: 630,
            alt: "Toon Central Short",
          },
        ],
      },
    };
  }
};

export default async function Page({ params }: Props) {
  return (
    <PageClient
      params={{
        shortId: params.shortId,
      }}
    />
  );
}
