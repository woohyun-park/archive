import { useEffect, useState } from "react";
import { useStore } from "../apis/zustand";
import { IPage, IType } from "../custom";

interface IInfiniteScrollType {
  changeRef: any;
  handleIntersect: Function;
  handleChange: Function;
}
export const useInfiniteScroll = ({
  changeRef,
  handleIntersect,
  handleChange,
}: IInfiniteScrollType) => {
  const [lastIntersecting, setLastIntersecting] = useState<HTMLElement | null>(
    null
  );

  const onIntersect: IntersectionObserverCallback = (entries, observer) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        handleIntersect();
        observer.unobserve(entry.target);
      }
    });
  };

  useEffect(() => {
    handleChange();
  }, [changeRef]);

  useEffect(() => {
    let observer: IntersectionObserver;
    if (lastIntersecting) {
      observer = new IntersectionObserver(onIntersect, { threshold: 0.5 });
      observer.observe(lastIntersecting);
    }
    return () => observer && observer.disconnect();
  }, [lastIntersecting]);

  return {
    setLastIntersecting,
  };
};
