import { useEffect, useState } from "react";

interface IInfiniteScrollType {
  changeListener: any;
  handleIntersect: Function;
  handleChange: Function;
}
export const useInfiniteScroll = ({
  changeListener,
  handleIntersect,
  handleChange,
}: IInfiniteScrollType) => {
  const [lastIntersecting, setLastIntersecting] = useState<HTMLElement | null>(
    null
  );

  const onIntersect: IntersectionObserverCallback = (entries, observer) => {
    console.log("Intersect!", handleIntersect);
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        handleIntersect();
        observer.unobserve(entry.target);
      }
    });
  };

  useEffect(() => {
    console.log("Change!", changeListener);
    handleChange();
  }, [changeListener]);

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
