import { Metadata } from "next";
import PageClient from "./pageClient";
import { getRequest } from "@/app/utils/queries/requests";
import { DEFAULT_OG_URL } from "@/app/layout";

type Props = {
  params: { name: string };
};
const alternate = "https://tooncentralhub.com/static/images/login.png";
// export async function generateStaticParams() {
//   const response = await getRequest("/comics/pull/all"); // adjust API endpoint if needed
//   const comics = response?.data || [];

//   return comics.map((comic: { slug: string }) => ({
//     name: comic.slug,
//   }));
// }

export const generateMetadata = async ({
  params,
}: Props): Promise<Metadata> => {
  const { title, description, bgUrl, logoUrl } = await getRequest(`
    /comics/${params?.name}/view `).then((data) => {
    if (data?.success) {
      // Extract title, description, and image URL from the response data
      let d = {
        title: data?.data?.title,
        description: data?.data?.description,
        bgUrl: data?.data?.backgroundImage,
        logoUrl: data?.data?.coverImage,
      };
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
      url: bgUrl || DEFAULT_OG_URL,
      width: 1200,
      height: 630,
      alt: title || "Toon Central Comic",
    },
    {
      url: bgUrl || DEFAULT_OG_URL,
      width: 800,
      height: 420,
      alt: title || "Toon Central Comic",
    },
    {
      url: bgUrl || DEFAULT_OG_URL,
      width: 600,
      height: 315,
      alt: title || "Toon Central Comic",
    },
  ];

  return {
    title: `Toon Central - ${title}`,
    description:
      description || "Discover Toon Central, the pioneering comic platform",

    openGraph: {
      title: `Toon Central - ${title}`,
      description:
        description ||
        " Discover Toon Central, the pioneering comic platform showcasing Afrocentric comics.",
      url: ` https://tooncentralhub.com/comics/${params.name}`,
      type: "website",
      images: images,
    },
    twitter: {
      card: "summary_large_image",
      site: "@tooncentralhub",
      title: `Toon Central - ${title}`,
      description:
        description ||
        "Discover Toon Central, the pioneering comic platform showcasing Afrocentric comics.",
      images: images,
    },
  };
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
