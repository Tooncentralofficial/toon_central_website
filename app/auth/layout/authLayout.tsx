"use client"
import React from 'react';
const AuthLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <main className="auth-container">
      <div className=" w-full h-full bg-[#05834a68]">
        <div className="w-full h-full bg-[#16172780] parent-wrap flex justify-center items-center py-10 px-6 ">
          <div className=" bg-[var(--bg-secondary)] rounded-lg md:max-w-[668px] w-full  p-6 lg:p-14">
            {children}
          </div>
        </div>
      </div>
    </main>
  );
};

export default AuthLayout;
 