import React, { ReactNode, useEffect, useState } from "react";
import Modal from "./Modal";

interface IModalLoaderProps {
  isVisible: boolean;
}

export default function ModalLoader({ isVisible }: IModalLoaderProps) {
  return (
    <Modal
      isVisible={isVisible}
      content={
        <div className="flex items-center justify-center w-full h-full bg-white">
          LOADING
        </div>
      }
    />
  );
}
