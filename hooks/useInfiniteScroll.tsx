import { SetStateAction, useEffect, useState } from "react";
import { useStore } from "../apis/zustand";

export const useInfiniteScroll = () => {
  const { gCurUser, gPosts, gUsers, gSetPostsAndUsers } = useStore();
  const [page, setPage] = useState(1);
  const [lastIntersecting, setLastIntersecting] = useState<HTMLElement | null>(
    null
  );

  const onIntersect: IntersectionObserverCallback = (entries, observer) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        setPage((prev) => prev + 1);
        observer.unobserve(entry.target);
      }
    });
  };

  useEffect(() => {
    gSetPostsAndUsers(gCurUser, page);
  }, [page]);

  useEffect(() => {
    let observer: IntersectionObserver;
    if (lastIntersecting) {
      observer = new IntersectionObserver(onIntersect, { threshold: 0.5 });
      observer.observe(lastIntersecting);
    }
    return () => observer && observer.disconnect();
  }, [lastIntersecting]);

  return {
    page,
    setLastIntersecting,
  };
};
