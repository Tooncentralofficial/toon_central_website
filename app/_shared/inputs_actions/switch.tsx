export function TailwindSwitch({ enabled, setEnabled }:{enabled:boolean, setEnabled:(value:boolean)=>void}) {
  

  return (
    <button
      onClick={() => setEnabled(!enabled)}
      className={`relative inline-flex h-[22px] w-[42px] items-center rounded-full transition-colors duration-200 ${
        enabled ? "bg-[#3EFFA2]" : "bg-[#BDC2C4]"
      }`}
    >
      <span
        className={`inline-block h-[18px] w-[18px] transform rounded-full bg-[#FFFFFF] transition-transform duration-200 ${
          enabled ? "translate-x-[20px]" : "translate-x-[2px]"
        }`}
      />
    </button>
  );
}
