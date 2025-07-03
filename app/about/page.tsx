import React from "react";

function AboutPage() {
  return (
    <div className="parent-wrap py-10">
      <div className="child-wrap">
        <h4 className="text-xl lg:text-[25px] mt-10">Who We Are</h4>
        <p className="mt-2">
          Toon Central is Africa’s leading comic and animation studio, founded by
          Emmanuel Ifeanacho with over a decade of creative experience. We
          champion the black narrative, giving voice to characters and worlds
          that resonate with diverse Black audiences worldwide.
        </p>

        <h4 className="text-xl lg:text-[25px] mt-10">Our Mission</h4>
        <p className="mt-2">
          We exist to craft high‑quality, rich comics, games and animations that
          inspire, entertain, and foster a strong sense of identity and belonging
          for African children and beyond.
        </p>

        <h4 className="text-xl lg:text-[25px] mt-10">Our Vision</h4>
        <p className="mt-2">
          To be the global hub where the black narrative thrives—transforming Toon
          Central into a major force in comics and animation, driving meaningful
          job creation across the continent.
        </p>

        <h4 className="text-xl lg:text-[25px] mt-10">Our Creators: Marafiki</h4>
        <p className="mt-2">
          At Toon Central, our talented comic artists—whom we call Marafiki
          (&quot;friends&quot; in Swahili)—blend traditional African art forms with
          cutting‑edge techniques to create what we call Mafiki style: a unique
          fusion of local color, heritage, and modern flair.
        </p>

        <h4 className="text-xl lg:text-[25px] mt-10">What We Do</h4>
        <ul className="list-disc ml-6 mt-2 space-y-2">
          <li>
            <b>Comics & Webtoons:</b> From thrilling adventures like
            <i>The Senator</i> to imaginative worlds like <i>Hammer Games</i>, we
            publish stories that captivate and empower.
          </li>
          <li>
            <b>Animated Shorts & Trailers:</b> Bringing Mafiki to life through
            dynamic animation, ready for web, social media, and conventions.
          </li>
          <li>
            <b>Talent Development:</b> We invest in local talent, providing
            workshops, mentorship, and international training opportunities—taking
            our core Marafiki to animation studios in Japan and beyond.
          </li>
          <li>
            <b>Reader Experience:</b> Our platform uses smart algorithms to
            recommend comics tailored to each reader’s taste, ensuring everyone
            finds their next favorite series.
          </li>
          <li>
            <b>Game development:</b> With our talented team we are able to create
            visually appealing and engaging games for our partners and audience.
          </li>
        </ul>

        <h4 className="text-xl lg:text-[25px] mt-10">Get Involved</h4>
        <p className="mt-2">
          Whether you’re a reader hungry for fresh stories, an artist ready to
          join our Marafiki community, or a partner seeking innovative content
          collaborations—Toon Central welcomes you. Connect with us on Instagram{" "}
          <b>@tooncentralofficial</b> and be part of Africa’s comic revolution.
        </p>
      </div>
    </div>
  );
}

export default AboutPage;
