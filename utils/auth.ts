import { AUTH_USER_DEFAULT } from "consts/auth";
import { User } from "firebase/auth";

export function getNewUser(user: User) {
  return {
    ...AUTH_USER_DEFAULT,
    id: user.uid,
    email: String(user.email),
    displayName: `아카이버-${user.uid.slice(0, 11)}`,
    createdAt: new Date(),
  };
}
