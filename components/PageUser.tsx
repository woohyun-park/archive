import { AnimatePresence } from "framer-motion";
import { Children } from "react";
import { IAlarm, IUser } from "../libs/custom";
import { useUser } from "../stores/useUser";
import AlarmComment from "./AlarmComment";
import AlarmFollow from "./AlarmFollow";
import AlarmLike from "./AlarmLike";
import Profile from "./Profile";
import WrapMotion from "./wrappers/WrapMotion";

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
    </>
  );
}
