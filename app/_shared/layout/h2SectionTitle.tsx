
import React from "react";
const H2SectionTitle = ({
  title,
  children,
}: {
  title: string;
  children?: React.ReactNode;
}) => {
  return (
    <div className="flex justify-between items-center mb-5">
      <h2 className="text-[1rem] md:text-[1.5rem] ">{title}</h2>
      {children}
    </div>
  );
};

export default H2SectionTitle;
