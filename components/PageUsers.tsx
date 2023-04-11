import { useRouter } from "next/router";
import React, { Children } from "react";
import PullToRefresh from "react-simple-pull-to-refresh";
import { IFetchQueryUsers } from "../apis/firebase/fbDef";
import { useCachedPage } from "../hooks/useCachedPage";
import { IUser } from "../apis/def";
import { useUser } from "../stores/useUser";
import Profile from "./Profile";
import WrapPullToRefresh from "./wrappers/WrapPullToRefresh";

export interface IPageUsersProps {
  query: IFetchQueryUsers;
  as: string;
  isPullable?: boolean;
  childrenWhenEmpty?: React.ReactNode;
  paddingBottom?: string;
  displayWhenEmpty?: React.ReactNode;
}

export default function PageUsers({
  query,
  as,
  isPullable = true,
  paddingBottom,
  displayWhenEmpty,
}: IPageUsersProps) {
  const router = useRouter();

  const { data, onRefresh, onFetchMore, canFetchMore } = useCachedPage(
    "users",
    query,
    { as, isPullable }
  );
  const { curUser } = useUser();

  const users = data as IUser[];

  return (
    <>
      <WrapPullToRefresh
        onRefresh={onRefresh}
        onFetchMore={onFetchMore}
        canFetchMore={canFetchMore}
        isPullable={isPullable}
      >
        {users.length !== 0 ? (
          <div className="mx-4">
            {Children.toArray(
              users.map((user, i) => (
                <>
                  <Profile
                    user={user}
                    info="intro"
                    action={curUser.id !== user.id ? "follow" : undefined}
                  />
                </>
              ))
            )}
          </div>
        ) : (
          displayWhenEmpty
        )}
      </WrapPullToRefresh>
      <div className={paddingBottom} />
    </>
  );
}
