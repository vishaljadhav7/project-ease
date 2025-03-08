import React, { ReactElement } from "react";

type Props = {
  name: string;
  buttonComponent?: ReactElement;
  isSmallText?: boolean;
};

const Header = ({ name, buttonComponent }: Props) => {
  return (
    <div className="mb-5 flex w-full items-center justify-between px-4">
      <h1
        className={`text-2xl text-black font-semibold `}
      >
        {name}   
      </h1>
      {buttonComponent}
    </div>
  );
};

export default Header;