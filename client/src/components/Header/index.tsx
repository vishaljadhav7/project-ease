import React, { ReactElement } from "react";

type Props = {
  name: string;
  buttonComponent?: ReactElement;
  isSmallText?: boolean;
};

const Header = ({ name, buttonComponent }: Props) => {
  return (
    <div className="mb-6 flex w-full items-center justify-between px-6">
      <h1 className="text-2xl text-gray-800 font-semibold tracking-tight">
        {name}
      </h1>
      {buttonComponent}
    </div>
  );
};

export default Header;