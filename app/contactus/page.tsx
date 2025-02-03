import React from "react";

export default function page() {
  return (
    <div className="parent-wrap py-10">
      <div className="child-wrap">
        <h3 className="text-3xl lg:text-[40px]">Contact us </h3>

        <h3 className="text-xl  text-gray-800 mb-6 mt-5">
          Welcome to Toon Central™
        </h3>
        <p className="text-gray-700 text-lg leading-relaxed mb-8">
          We’re transforming storytelling by creating a space for creators to
          share their unique visions with the world. At Toon Central, we’re
          proud to be the home of creator-owned comics and animations, featuring
          fresh, exciting, and diverse stories from Africa and beyond. Explore
          the latest in romance, comedy, action, fantasy, horror, and more —
          created by passionate Marafiki, our talented creators. Whether you’re
          a reader, creator, or simply a fan of amazing stories, Toon Central is
          your destination for great content, anytime, anywhere — and always for
          free.
        </p>

        <ul className="list-disc pl-6 flex flex-col gap-5">
          <li>
            <h2 className="text-xl font-semibold text-gray-800 mb-2">
              General Support and Feedback
            </h2>
            <p className="text-gray-700">
              For help with our platform, questions, or general feedback, email
              us at{" "}
              <a
                href="mailto:support@tooncentral.com"
                className="text-blue-600 underline"
              >
                support@tooncentral.com
              </a>
              .
            </p>
          </li>

          <li>
            <h2 className="text-xl font-semibold text-gray-800 mb-2">
              IP and Licensing Inquiries
            </h2>
            <p className="text-gray-700">
              For IP business, rights, and licensing opportunities, contact us
              at{" "}
              <a
                href="mailto:ip@tooncentral.com"
                className="text-blue-600 underline"
              >
                ip@tooncentral.com
              </a>
              .
            </p>
          </li>

          <li>
            <h2 className="text-xl font-semibold text-gray-800 mb-2">
              Advertising and Partnerships
            </h2>
            <p className="text-gray-700">
              Interested in advertising or partnership opportunities? Reach out
              to us at{" "}
              <a
                href="mailto:ads@tooncentral.com"
                className="text-blue-600 underline"
              >
                ads@tooncentral.com
              </a>
              .
            </p>
          </li>

          <li>
            <h2 className="text-xl font-semibold text-gray-800 mb-2">
              Press/Media Inquiries
            </h2>
            <p className="text-gray-700">
              For press or media-related inquiries, email us at{" "}
              <a
                href="mailto:press@tooncentral.com"
                className="text-blue-600 underline"
              >
                press@tooncentral.com
              </a>
              .
            </p>
          </li>

          <li>
            <h2 className="text-xl font-semibold text-gray-800 mb-2">
              Phone Support
            </h2>
            <p className="text-gray-700">
              Call us directly at{" "}
              <a href="tel:+2348148292571" className="text-blue-600 underline">
                +2348148292571
              </a>{" "}
              for assistance or inquiries.
            </p>
          </li>

          <li>
            <h2 className="text-xl font-semibold text-gray-800 mb-2">
              Pitch Your Ideas
            </h2>
            <p className="text-gray-700">
              Have an amazing idea or comic you’d like to pitch to us? We’d love
              to hear from you! Send your pitches to{" "}
              <a
                href="mailto:toooncentralhub@gmail.com"
                className="text-blue-600 underline"
              >
                toooncentralhub@gmail.com
              </a>{" "}
              or{" "}
              <a
                href="mailto:tcadmin@tooncentralhub.com"
                className="text-blue-600 underline"
              >
                tcadmin@tooncentralhub.com
              </a>
              .
            </p>
          </li>
        </ul>
      </div>
    </div>
  );
}
