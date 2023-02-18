import { useRouter } from "next/router";
import React from "react";
import { wrapPromise } from "../../stores/libStores";
import { useStatus } from "../../stores/useStatus";

interface IWrapLink {
  children: React.ReactNode;
  href: string;
  loader?: boolean;
  className?: string;
}

export default function WrapLink({
  children,
  href,
  loader = false,
  className,
}: IWrapLink) {
  const { scroll, setModalLoader } = useStatus();
  const router = useRouter();

  async function onClick(e: React.MouseEvent<HTMLElement>) {
    loader &&
      scroll[href] === undefined &&
      (await wrapPromise(() => setModalLoader(true), 500));
    router.push(href);
  }
  return (
    <div onClick={onClick} className={className}>
      {children}
    </div>
  );
}
