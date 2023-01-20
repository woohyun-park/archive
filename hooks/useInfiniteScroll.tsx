import { useEffect, useState } from "react";
import { useStore } from "../apis/zustand";

type IInfintieScrollType = "feed" | "searchPost" | "searchTag" | "searchUser";

export const useInfiniteScroll = (type: IInfintieScrollType) => {
  const { gCurUser, gPage, gSetFeed, gSetPage, gSetSearch, gSearch } =
    useStore();
  const [lastIntersecting, setLastIntersecting] = useState<HTMLElement | null>(
    null
  );

  const onIntersect: IntersectionObserverCallback = (entries, observer) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        if (type === "feed") gSetPage("feed", gPage.feed + 1);
        else if (type === "searchPost") gSetPage("sPost", gPage.sPost + 1);
        observer.unobserve(entry.target);
      }
    });
  };

  useEffect(() => {
    console.log(gPage.sPost);
    if (type === "feed") gSetFeed(gCurUser.id, gPage.feed);
    else if (type === "searchPost") gSetSearch("posts", gPage.sPost);
  }, [gPage]);

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
