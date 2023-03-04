import { useRouter } from "next/router";
import React, { Children, useEffect } from "react";
import { IFetchQueryUsers } from "../apis/fbDef";
import { useCachedPage } from "../hooks/useCachedPage";
import { useInfiniteScroll } from "../hooks/useInfiniteScroll";
import { IUser } from "../libs/custom";
import { useStatus } from "../stores/useStatus";
import { useUser } from "../stores/useUser";
import Profile from "./Profile";
import WrapRefreshAndLoad from "./wrappers/WrapRefreshAndReload";

export interface IPageUsersProps {
  query: IFetchQueryUsers;
  as: string;
  isPullable?: boolean;
}

export default function PageUsers({
  query,
  as,
  isPullable = true,
}: IPageUsersProps) {
  const router = useRouter();

  const cache = useCachedPage("users");
  const { curUser } = useUser();
  const { setModalLoader } = useStatus();

  const path = router.asPath;

  const users = cache.data as IUser[];
  function onIntersect() {
    cache.fetchUsers && cache.fetchUsers("load", query, path, "users");
  }
  function onChange() {}
  async function onRefresh() {
    cache.fetchUsers && cache.fetchUsers("refresh", query, path, "users");
  }
  const changeListener = users;
  const isLast = cache.isLast;

  useEffect(() => {
    async function init() {
      if (cache.data.length === 0) {
        cache.fetchUsers && cache.fetchUsers("init", query, path, "users");
      }
      setModalLoader(false);
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
      <WrapRefreshAndLoad
        onRefresh={onRefresh}
        loading={loading}
        isPullable={isPullable}
      >
        <div className="mx-4">
          {Children.toArray(
            users.map((user, i) => (
              <>
                <Profile
                  user={user}
                  info="intro"
                  action={curUser.id !== user.id ? "follow" : undefined}
                />
                {!isLast && i === users.length - 1 && (
                  <div ref={setLastIntersecting}></div>
                )}
              </>
            ))
          )}
        </div>
      </WrapRefreshAndLoad>
    </>
  );
}
