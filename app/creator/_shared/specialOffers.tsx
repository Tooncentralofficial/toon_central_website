"use client";

import Image from "next/image";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination } from "swiper/modules";
// @ts-ignore
import "swiper/css";
// @ts-ignore
import "swiper/css/pagination";

/**
 * Artwork is referenced by public path rather than imported: next.config.mjs
 * runs @svgr/webpack over svg imports from .tsx, which returns a component
 * instead of a url. Leave `image` undefined to get a placeholder block.
 */
interface PopularTitle {
  name: string;
  genre: string;
  image?: string;
}

type Offer =
  | {
      id: string;
      kind: "deal";
      tag: string;
      title: string;
      subtitle: string;
      oldPrice: string;
      price: string;
      cta: string;
      image?: string;
    }
  | {
      id: string;
      kind: "titles";
      title: string;
      items: PopularTitle[];
    }
  | {
      id: string;
      kind: "promo";
      title: string;
      description: string;
      cta: string;
      image?: string;
    };

const offers: Offer[] = [
  {
    id: "3d-rendering",
    kind: "deal",
    tag: "Featured Sale",
    title: "Learn 3d Rendering",
    subtitle: "start your journey today as a 3d Artist",
    oldPrice: "$40.99",
    price: "$20.99",
    cta: "Get Deal",
  },
  {
    id: "popular-titles",
    kind: "titles",
    title: "Popular Titles",
    items: [
      { name: "Senza Replica", genre: "Fantasy" },
      { name: "Senza Replica", genre: "Fantasy" },
      { name: "Absolute", genre: "Sci-Fi" },
    ],
  },
  // {
  //   id: "ai-friend",
  //   kind: "promo",
  //   title: "Virtual AI Friend",
  //   description:
  //     "AI Friend that cares, have a friendly chat, roles play and tells secrets about characters in their comics",
  //   cta: "Get Started",
  // },
  {
    id: "character-design",
    kind: "deal",
    tag: "Featured Sale",
    title: "Master Character Design",
    subtitle: "build casts your readers will remember",
    oldPrice: "$32.99",
    price: "$18.99",
    cta: "Get Deal",
  },
];

const Placeholder = ({ label, rounded }: { label: string; rounded?: string }) => (
  <div
    className={`flex h-full w-full items-center justify-center border border-dashed border-[#FFFFFF33] bg-[#FFFFFF1A] ${
      rounded ?? "rounded-lg"
    }`}
  >
    <span className="px-2 text-center text-[10px] uppercase tracking-wide text-[#FFFFFF80]">
      {label}
    </span>
  </div>
);

const DealCard = ({ offer }: { offer: Extract<Offer, { kind: "deal" }> }) => (
  <div className="relative flex h-[272px] w-[290px] lg:h-[310px] lg:w-[340px] flex-col overflow-hidden rounded-xl bg-[#DE4A3E] p-5 lg:p-6">
    <span className="absolute right-0 top-0 rounded-bl-lg bg-[#E3A03C] px-4 py-1.5 text-xs">
      {offer.tag}
    </span>

    <h3 className="mt-6 max-w-[190px] text-xl lg:text-2xl font-bold leading-tight">
      {offer.title}
    </h3>
    <p className="mt-3 max-w-[210px] text-sm text-[#FCFCFD]">{offer.subtitle}</p>

    <div className="mt-auto flex items-end gap-2">
      <span className="text-sm text-[#FFFFFFB3] line-through">
        {offer.oldPrice}
      </span>
      <span className="text-xl lg:text-2xl font-bold">{offer.price}</span>
    </div>

    <button
      type="button"
      className="mt-3 w-max rounded-md bg-[#FCFCFD] px-6 py-2.5 text-sm font-bold text-[#DE4A3E]"
    >
      {offer.cta}
    </button>

    <div className="absolute bottom-[-16px] right-[-12px] h-[140px] w-[140px] lg:h-[160px] lg:w-[160px] overflow-hidden rounded-full">
      {offer.image ? (
        <Image
          src={offer.image}
          alt={offer.title}
          fill
          sizes="132px"
          style={{ objectFit: "cover" }}
        />
      ) : (
        <Placeholder label="Artwork" rounded="rounded-full" />
      )}
    </div>
  </div>
);

const TitlesCard = ({ offer }: { offer: Extract<Offer, { kind: "titles" }> }) => (
  <div className="flex h-[300px] w-[400px] lg:h-[340px] lg:w-[470px] flex-col rounded-xl bg-[#0D111D] p-4 lg:p-5">
    <h3 className="text-base lg:text-lg font-bold">{offer.title}</h3>

    <div className="mt-4 grid grid-cols-3 gap-3 lg:gap-4">
      {offer.items.map((item, i) => (
        <div key={`${item.name}-${i}`} className="flex flex-col">
          <div className="relative h-[160px] lg:h-[190px] w-full overflow-hidden rounded-md">
            {item.image ? (
              <Image
                src={item.image}
                alt={item.name}
                fill
                sizes="110px"
                style={{ objectFit: "cover" }}
              />
            ) : (
              <Placeholder label={item.name} rounded="rounded-md" />
            )}
          </div>
          <p className="mt-2 truncate text-sm font-bold text-[#FCFCFD]">
            {item.name}
          </p>
          <p className="text-xs text-gray">{item.genre}</p>
        </div>
      ))}
    </div>
  </div>
);

const PromoCard = ({ offer }: { offer: Extract<Offer, { kind: "promo" }> }) => (
  <div className="relative flex h-[272px] w-[320px] lg:h-[310px] lg:w-[380px] flex-col overflow-hidden rounded-xl bg-[linear-gradient(120deg,#04120A_0%,#0A3B21_55%,#115C33_100%)] p-5 lg:p-6">
    <div className="relative z-10 flex flex-col">
      <span className="w-max rounded bg-[#FCFCFD] px-1.5 py-0.5 text-[10px] font-bold uppercase leading-tight text-[#0D111D]">
        Toon
        <br />
        Central
      </span>
      <h3 className="mt-3 text-xl lg:text-2xl font-bold uppercase leading-tight">
        {offer.title}
      </h3>
      <p className="mt-2 max-w-[185px] lg:max-w-[215px] text-xs leading-[1.6] text-[#FCFCFD]">
        {offer.description}
      </p>
      <button
        type="button"
        className="mt-4 w-max rounded-md bg-[#4ADD80] px-5 py-2.5 text-sm font-bold text-[#0D111D]"
      >
        {offer.cta}
      </button>
    </div>

    <div className="absolute bottom-0 right-0 h-[210px] w-[130px] lg:h-[240px] lg:w-[150px]">
      {offer.image ? (
        <Image
          src={offer.image}
          alt={offer.title}
          fill
          sizes="120px"
          style={{ objectFit: "contain", objectPosition: "bottom" }}
        />
      ) : (
        <Placeholder label="Artwork" />
      )}
    </div>
  </div>
);

const renderOffer = (offer: Offer) => {
  switch (offer.kind) {
    case "deal":
      return <DealCard offer={offer} />;
    case "titles":
      return <TitlesCard offer={offer} />;
    case "promo":
      return <PromoCard offer={offer} />;
  }
};

const SpecialOffers = () => {
  return (
    <section className="w-full bg-[#5B4AE8] py-8">
      <div className="parent-wrap">
        <div className="child-wrap">
          <h2 className="text-xl font-bold">Special offers</h2>

          <Swiper
            modules={[Autoplay, Pagination]}
            className="special-offers-swiper mt-5"
            slidesPerView="auto"
            spaceBetween={22}
            
            watchOverflow={false}
            autoplay={{ delay: 4000, disableOnInteraction: false }}
            pagination={{ clickable: true }}
          >
            {offers.map((offer) => (
              <SwiperSlide key={offer.id} className="!w-auto">
                {renderOffer(offer)}
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
      </div>
    </section>
  );
};

export default SpecialOffers;
