import Image from "next/image";
import React from "react";

const LogoName = () => {
  return (
    <div className="flex items-center gap-3">
      <Image src="/favicon.png" alt="Synap Logo" width={40} height={40} />
      <div className="text-4xl font-bold">Synap</div>
    </div>
  );
};

export default LogoName;
