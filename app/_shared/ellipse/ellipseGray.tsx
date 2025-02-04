const EllipseGray = () => {
  return (
    <div className="absolute h-[36px] top-[87px] md:top-[80px] left-0 w-full z-10">
      <svg
        width="1242"
        height="42"
        viewBox="0 0 1242 33"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        style={{ width: "100%", height: "max-content" }}
      >
        <path
          d="M1242 0.501122C1242 18.4504 963.969 33.0011 621 33.0011C278.031 33.0011 0 18.4504 0 0.501122C0 0.501122 278.031 0.5 621 0.5C963.969 0.5 1242 0.501122 1242 0.501122Z"
          fill="#0D111D"
          style={{ width: "100%" }}
        />
      </svg>
    </div>
  );
};

export const Ellipse = () => {
  return (
    <div className="absolute h-[46px] top-[-12%] left-0 w-full z-10">
      <svg
        width="1440"
        height="63"
        viewBox="0 0 1440 63"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        style={{ width: "100%", height: "max-content" }}
      >
        <ellipse cx="720" cy="31.5" rx="720" ry="31.5" fill="#6D2445" />
      </svg>
    </div>
  );
};

export default EllipseGray;
