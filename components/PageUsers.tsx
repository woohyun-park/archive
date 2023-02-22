import { AnimatePresence } from "framer-motion";
import { useRouter } from "next/router";
import React, { Children, useEffect } from "react";
import { useCachedPage } from "../hooks/useCachedPage";
import { useInfiniteScroll } from "../hooks/useInfiniteScroll";
import { IPost, IUser } from "../libs/custom";
import { ICacheType } from "../stores/useCacheHelper";
import { useStatus } from "../stores/useStatus";
import { useUser } from "../stores/useUser";
import PostBox from "./PostBox";
import PostCard from "./PostCard";
import Profile from "./Profile";
import WrapRefreshAndLoad from "./wrappers/WrapLink copy";

export interface IPageUsersProps {
  fetchType: ICacheType;
}

export default function PageUsers({
  fetchType = "usersByKeyword",
}: IPageUsersProps) {
  const router = useRouter();

  const cache = useCachedPage(fetchType);
  const { setModalLoader } = useStatus();
  const { curUser } = useUser();

  const path = router.asPath;
  const keyword = (router.query.keyword as string) || "";
  const tag = (router.query.tag as string) || "";

  const users = cache.data as IUser[];
  function onIntersect() {
    if (fetchType === "usersByKeyword") {
      cache.fetchUsersByKeyword &&
        cache.fetchUsersByKeyword("load", path, keyword);
    }
  }
  function onChange() {}
  async function onRefresh() {
    if (fetchType === "usersByKeyword") {
      cache.fetchUsersByKeyword &&
        cache.fetchUsersByKeyword("refresh", path, keyword);
    }
  }
  const changeListener = users;
  const isLast = cache.isLast;

  useEffect(() => {
    async function init() {
      if (cache.data.length === 0) {
        if (fetchType === "usersByKeyword") {
          cache.fetchUsersByKeyword &&
            cache.fetchUsersByKeyword("init", path, keyword);
        }
      }
    }
    init();
  }, []);

  const { setLastIntersecting, loading } = useInfiniteScroll({
    handleIntersect: onIntersect,
    handleChange: onChange,
    changeListener,
  });

  return (
    <>
      <WrapRefreshAndLoad onRefresh={onRefresh} loading={loading}>
        <div className="mx-4">
          <AnimatePresence>
            {Children.toArray(
              users.map((user) => (
                <Profile
                  user={user}
                  info="intro"
                  action={curUser.id !== user.id ? "follow" : undefined}
                />
              ))
            )}
          </AnimatePresence>
        </div>
      </WrapRefreshAndLoad>
    </>
  );
}
