import React, { ReactNode, useEffect, useState } from "react";
import { mergeTailwindClasses } from "../apis/tailwind";
import Modal from "./Modal";

interface IModalLoaderProps {
  isVisible: boolean;
  className?: string;
}

export default function ModalLoader({
  isVisible,
  className,
}: IModalLoaderProps) {
  return (
    <Modal
      isVisible={isVisible}
      className={className}
      content={
        <div className="flex items-center justify-center w-full h-full bg-white">
          LOADING
        </div>
      }
    />
  );
}
