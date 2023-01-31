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
    console.log("onIntersect");
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        setLoading(true);
        handleIntersect();
        observer.unobserve(entry.target);
      }
    });
  };

  async function change() {
    console.log("change");
    await handleChange();
    setLoading(false);
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
