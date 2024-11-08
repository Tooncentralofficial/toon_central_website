import { Metadata } from "next";
import CreatorClient from "./creatorClient";

export const metadata: Metadata = {
  title: "Toon Central - Endless Comics, Endless stories.",
  description:
    " Read Anywhere. Create Anytime. Get started with us to unlock a world of comics and creativity",
};

const Page = () => {
  return <CreatorClient />;
};

export default Page;
