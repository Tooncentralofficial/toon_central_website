import { Metadata } from "next";
import PageClient from "./pageClient";
import { getRequest } from "@/app/utils/queries/requests";

type Props = {
  params: { name: string };
};

export const generateMetadata = async ({
  params,
}: Props): Promise<Metadata> => {
  const { title, description } = await getRequest(
    `/comics/${params?.name}/view`
  ).then((data) => {
    if (data?.success) {
      let d = {
        title: data?.data?.title,
        description: data?.data?.description,
      };
      return d;
    }
    return {
      title: "",
      description: "",
    };
  });
  return {
    title: `Toon Central - ${title}`,
    description:
      description || `Discover Toon Central, the pioneering comic platform `,
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
