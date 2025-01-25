import React, { ReactNode } from 'react'

const Iconlay = ({label,children}:{label:string ,children:ReactNode}) => {
  return (
    <div className='flex flex-col items-center gap-1'>
      <div className="w-[3rem] h-[3rem] rounded-[50%] bg-[#05834B] flex items-center justify-center ">
        {children}
      </div>
      <p className='text-[0.8rem]'>{label}</p>
    </div>
  );
}

export default Iconlay