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
  const [loading, setLoading] = useState(false);

  const onIntersect: IntersectionObserverCallback = (entries, observer) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        console.log("intersect");
        setLoading(true);
        console.log("loadingTrue");
        handleIntersect();
        console.log("handleIntersect");
        observer.unobserve(entry.target);
      }
    });
  };

  async function change() {
    await handleChange();
    console.log("handleChange");
    setLoading(false);
    console.log("loadingFalse");
  }

  useEffect(() => {
    change();
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
    loading,
  };
};
