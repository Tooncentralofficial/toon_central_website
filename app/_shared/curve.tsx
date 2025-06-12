import React from "react";
import image from "@/public/static/images/comics/new_0.png"
const Curve = ({ backgroundImage,activeImage  }: { backgroundImage: string ,activeImage:string}) => {
  const width = window.innerWidth;

  const height = 40;
  const initialPath = `M0 ${height} Q ${width / 2 + 40} ${
    height + 40
  } ${width} ${height}`;
  return (
    <div
      className=" w-full absolute z-[99] h-5  transition-colors duration-300"
      style={{
        backgroundImage: backgroundImage,
        backgroundRepeat: "no-repeat",
        backgroundSize: "cover",
        
      }}
    >
      <svg
        width="1242"
        height="42"
        viewBox="0 0 1242 33"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        style={{
          width: "100%",
          height: "max-content",
          // background: backgroundImage,
          // backgroundSize: "cover",
          // backgroundRepeat: "no-repeat",
        }}
        className="absolute top-3 transition-colors duration-300"
      >
        <defs>
          <pattern
            id="imagePattern"
            patternUnits="userSpaceOnUse"
            width="100%"
            height="100%"
          >
            <image
              href={activeImage} // Adjust the path to your image
              x="0"
              y="0"
              width="1242"
              height="42"
              preserveAspectRatio="xMidYMid slice"
            />
          </pattern>
        </defs>
        <path
          d="M1242 0.501122C1242 18.4504 963.969 33.0011 621 33.0011C278.031 33.0011 0 18.4504 0 0.501122C0 0.501122 278.031 0.5 621 0.5C963.969 0.5 1242 0.501122 1242 0.501122Z"
          fill="url(#imagePattern)"
          style={{ width: "100%" }}
        />
      </svg>
      {/* <svg
        className=" absolute top-0 transition-colors duration-500"
        viewBox={`0 0 ${width} ${height + 75}`}
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          stroke="blue"
          strokeWidth="0"
          d={initialPath}
          fill="var(--homeCouroselbg)"
          className="transition-colors duration-500"
        />
      </svg> */}
    </div>
  );
};

export default Curve;
// fill = "var(--homeCouroselbg)";
// bg - [--homeCouroselbg];