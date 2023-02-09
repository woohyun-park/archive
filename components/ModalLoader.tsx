import React, { ReactNode, useEffect, useState } from "react";
import ReactDOM from "react-dom";
import Modal from "./Modal";

interface IModalLoaderProps {
  show: boolean;
}

export default function ModalLoader({ show }: IModalLoaderProps) {
  return (
    <Modal
      show={show}
      content={
        <div className="flex items-center justify-center w-full h-full bg-white">
          LOADING
        </div>
      }
    />
  );
}
