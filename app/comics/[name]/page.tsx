import { Metadata } from "next";
import PageClient from "./pageClient";
import { getRequest } from "@/app/utils/queries/requests";
import { DEFAULT_OG_URL } from "@/app/layout";

type Props = {
  params: { name: string };
};

export const generateMetadata = async ({
  params,
}: Props): Promise<Metadata> => {
  const { title, description, imageUrl } = await getRequest(
    `/comics/${params?.name}/view`
  ).then((data) => {
    if (data?.success) {
      // Extract title, description, and image URL from the response
      let d = {
        title: data?.data?.title,
        description: data?.data?.description,
        imageUrl: data?.data?.coverImage, 
      };
      return d;
    }
    return {
      title: "",
      description: "",
      imageUrl: DEFAULT_OG_URL,
    };
  });


  return {
    title: `Toon Central - ${title}`,
    description: description || `Discover Toon Central, the pioneering comic platform`,

    openGraph: {
      title: `Toon Central - ${title}`,
      description: description || `Discover Toon Central, the pioneering comic platform showcasing Afrocentric comics.`,
      url: `https://tooncentralhub.com/comics/${params.name}`,
      type: "website",
      images: [
        {
          url: imageUrl || DEFAULT_OG_URL, 
          width: 1200,
          height: 630,
          alt: title || "Toon Central Comic",
        },
      ],
    },

    twitter: {
      card: "summary_large_image",
      site: "@tooncentralhub", 
      title: `Toon Central - ${title}`,
      description: description || `Discover Toon Central, the pioneering comic platform showcasing Afrocentric comics.`,
      images: [
        {
          url: imageUrl || DEFAULT_OG_URL, 
          width: 1200,
          height: 630,
          alt: title || "Toon Central Comic",
        },
      ],
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
