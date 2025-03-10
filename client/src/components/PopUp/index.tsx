import React from "react";
import ReactDOM from "react-dom";
import Header from "../Header";
import { X } from "lucide-react";

type Props = {
  children: React.ReactNode;
  isOpen: boolean;
  onClose: () => void;
  name: string;
};

const PopUp = ({ children, isOpen, onClose, name }: Props)=> {
    if (!isOpen) return null;     
  
    return ReactDOM.createPortal(
      <div className="fixed inset-0 z-50 flex h-full w-full items-center justify-center overflow-y-auto bg-gray-600 bg-opacity-50 p-4">
        <div className="relative w-full max-w-2xl rounded-lg bg-white p-4 shadow-lg">
          <Header
            name={name}
            buttonComponent={
              <button
                className="absolute right-2 t-2 font-bold flex h-7 w-7 rounded-full text-black"
                onClick={onClose}
              >
                <X size={28} />
              </button>
            }
          />
          {children}
        </div>
      </div>,
      document.body,
    );
  };
  
  export default PopUp;