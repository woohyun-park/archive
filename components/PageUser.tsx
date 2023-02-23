import { AnimatePresence } from "framer-motion";
import { Children } from "react";
import { IUser } from "../libs/custom";
import { useUser } from "../stores/useUser";
import Profile from "./Profile";

interface IPageUserProps {
  users: IUser[];
  isLast: boolean;
  setLastIntersecting: React.Dispatch<React.SetStateAction<HTMLElement | null>>;
}

export default function PageUser({
  users,
  isLast,
  setLastIntersecting,
}: IPageUserProps) {
  const { curUser } = useUser();

  return (
    <>
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
    </>
  );
}
