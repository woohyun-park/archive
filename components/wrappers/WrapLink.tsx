import { useRouter } from "next/router";
import React from "react";
import { wrapPromise } from "../../stores/libStores";
import { useModal } from "../../stores/useModal";
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
  const { scroll } = useStatus();
  const { setModalLoader } = useModal();
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
