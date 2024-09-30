const NumCircle = ({ number }: { number: number }) => {
  return (
    <div className="w-[30px] h-[30px] flex justify-center items-center rounded-[50%] bg-[#ffffff]">
      <span className="text-[#05834B]">{number}</span>
    </div>
  );
};

export default NumCircle;
