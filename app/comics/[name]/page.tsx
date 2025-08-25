import { Metadata } from "next";
import PageClient from "./pageClient";
import { getRequest } from "@/app/utils/queries/requests";
import { DEFAULT_OG_URL } from "@/app/layout";

type Props = {
  params: { name: string };
};

// export async function generateStaticParams() {
//   const response = await getRequest("/comics/pull/all");
//   const comics = response?.data || [];
//   return comics.map((comic: { slug: string }) => ({
//     name: comic.slug,
//   }));
// }

export const generateMetadata = async ({
  params,
}: Props): Promise<Metadata> => {
  try {
    const { title, description, bgUrl, logoUrl } = await getRequest(
      `/comics/${params?.name}/view`
    ).then((data) => {
      if (data?.success) {
        const cleanImageUrl = (url: string) => {
          if (!url) return DEFAULT_OG_URL;

          // Remove any leading/trailing whitespace
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

          // If URL doesn't start with http/https, treat as relative
          if (!url.startsWith("http")) {
            return `https://tooncentralhub.com/${url}`;
          }

          return url;
        };

        let d = {
          title: data?.data?.title,
          description: data?.data?.description,
          bgUrl: cleanImageUrl(data?.data?.backgroundImage),
          logoUrl: cleanImageUrl(data?.data?.coverImage),
        };

        // ✅ Enhanced logging for debugging
        console.log(`🔍 Metadata Debug for "${params?.name}":`, {
          title: d.title,
          logoUrl: d.logoUrl,
          bgUrl: d.bgUrl,
          originalCoverImage: data?.data?.coverImage,
          originalBackgroundImage: data?.data?.backgroundImage,
          isLogoUrlValid: d.logoUrl?.startsWith("https://"),
        });

        return d;
      }
      return {
        title: "",
        description: "",
        bgUrl: DEFAULT_OG_URL,
        logoUrl: DEFAULT_OG_URL,
      };
    });

    const images = [
      {
        url: logoUrl || DEFAULT_OG_URL,
        width: 1200,
        height: 630,
        alt: title || "Toon Central Comic",
      },
      {
        url: logoUrl || DEFAULT_OG_URL,
        width: 800,
        height: 420,
        alt: title || "Toon Central Comic",
      },
      {
        url: logoUrl || DEFAULT_OG_URL,
        width: 600,
        height: 315,
        alt: title || "Toon Central Comic",
      },
    ];

    // ✅ Final metadata logging
    console.log(`📝 Final metadata for "${params?.name}":`, {
      title: `Toon Central - ${title}`,
      url: `https://tooncentralhub.com/comics/${params.name}`,
      imageUrl: logoUrl || DEFAULT_OG_URL,
    });

    return {
      title: `Toon Central - ${title}`,
      description:
        description || `Discover Toon Central, the pioneering comic platform`,

      openGraph: {
        title: `Toon Central - ${title}`,
        description:
          description ||
          `Discover Toon Central, the pioneering comic platform showcasing Afrocentric comics.`,
        url: `https://tooncentralhub.com/comics/${params.name}`,
        type: "website",
        images: images,
      },

      twitter: {
        card: "summary_large_image",
        site: "@tooncentralhub",
        title: `Toon Central - ${title}`,
        description:
          description ||
          `Discover Toon Central, the pioneering comic platform showcasing Afrocentric comics.`,
        images: images,
      },
    };
  } catch (error) {
    console.error("❌ Error generating metadata for:", params?.name, error);

    // ✅ Return fallback metadata on error
    return {
      title: "Toon Central - Comic",
      description: "Discover Toon Central, the pioneering comic platform",
      openGraph: {
        title: "Toon Central - Comic",
        description: "Discover Toon Central, the pioneering comic platform",
        url: `https://tooncentralhub.com/comics/${params.name}`,
        type: "website",
        images: [
          {
            url: DEFAULT_OG_URL,
            width: 1200,
            height: 630,
            alt: "Toon Central Comic",
          },
        ],
      },
      twitter: {
        card: "summary_large_image",
        site: "@tooncentralhub",
        title: "Toon Central - Comic",
        description: "Discover Toon Central, the pioneering comic platform",
        images: [
          {
            url: DEFAULT_OG_URL,
            width: 1200,
            height: 630,
            alt: "Toon Central Comic",
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
        name: params.name,
      }}
    />
  );
}
