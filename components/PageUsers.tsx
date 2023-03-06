import { useRouter } from "next/router";
import React, { Children } from "react";
import { IFetchQueryUsers } from "../apis/fbDef";
import { useCachedPage } from "../hooks/useCachedPage";
import { IUser } from "../libs/custom";
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

  const { data, isLast, onRefresh, setLastIntersecting, loading } =
    useCachedPage("users", query, { as, isPullable });
  const { curUser } = useUser();

  const users = data as IUser[];

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
