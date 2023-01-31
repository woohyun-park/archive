import { MutableRefObject, useEffect, useRef } from "react";
import Motion from "../motions/Motion";

interface ILoaderProps {
  isVisible?: boolean;
  scrollIntoView?: boolean;
}

export default function Loader({
  isVisible = true,
  scrollIntoView,
}: ILoaderProps) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    setTimeout(() => {
      isVisible &&
        scrollIntoView &&
        ref.current?.scrollIntoView({ behavior: "smooth" });
    }, 300);
  }, [isVisible]);
  return (
    <>
      <div
        className={
          isVisible
            ? "flex justify-center h-[82px] duration-500"
            : "flex justify-center h-0 duration-500"
        }
        ref={ref}
      >
        <Motion type="float" key="refreshLoader" isVisible={isVisible}>
          <div className="lds-ellipsis">
            <div></div>
            <div></div>
            <div></div>
            <div></div>
          </div>
        </Motion>
      </div>

      <style jsx>
        {`
          .lds-ellipsis {
            display: inline-block;
            position: relative;
            width: 80px;
            height: 80px;
          }
          .lds-ellipsis div {
            position: absolute;
            top: 33px;
            width: 13px;
            height: 13px;
            border-radius: 50%;
            background: black;
            animation-timing-function: cubic-bezier(0, 1, 1, 0);
          }
          .lds-ellipsis div:nth-child(1) {
            left: 8px;
            animation: lds-ellipsis1 0.6s infinite;
          }
          .lds-ellipsis div:nth-child(2) {
            left: 8px;
            animation: lds-ellipsis2 0.6s infinite;
          }
          .lds-ellipsis div:nth-child(3) {
            left: 32px;
            animation: lds-ellipsis2 0.6s infinite;
          }
          .lds-ellipsis div:nth-child(4) {
            left: 56px;
            animation: lds-ellipsis3 0.6s infinite;
          }
          @keyframes lds-ellipsis1 {
            0% {
              transform: scale(0);
            }
            100% {
              transform: scale(1);
            }
          }
          @keyframes lds-ellipsis3 {
            0% {
              transform: scale(1);
            }
            100% {
              transform: scale(0);
            }
          }
          @keyframes lds-ellipsis2 {
            0% {
              transform: translate(0, 0);
            }
            100% {
              transform: translate(24px, 0);
            }
          }
        `}
      </style>
    </>
  );
}
