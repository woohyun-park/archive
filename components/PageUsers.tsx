import { useRouter } from "next/router";
import React, { Children } from "react";
import PullToRefresh from "react-simple-pull-to-refresh";
import { IFetchQueryUsers } from "../apis/fbDef";
import { useCachedPage } from "../hooks/useCachedPage";
import { IUser } from "../libs/custom";
import { useUser } from "../stores/useUser";
import Profile from "./Profile";

export interface IPageUsersProps {
  query: IFetchQueryUsers;
  as: string;
  isPullable?: boolean;
  childrenWhenEmpty?: React.ReactNode;
}

export default function PageUsers({
  query,
  as,
  isPullable = true,
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
      <PullToRefresh
        onRefresh={onRefresh}
        onFetchMore={onFetchMore}
        canFetchMore={canFetchMore}
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
              </>
            ))
          )}
        </div>
      </PullToRefresh>
    </>
  );
}
