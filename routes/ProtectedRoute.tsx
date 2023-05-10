import { useUser } from "contexts/UserProvider";
import { useCustomRouter } from "hooks";

export const ProtectRoute = ({ children }: any) => {
  const router = useCustomRouter();
  const userContext = useUser();

  const user = userContext.data;
  const isLoggedIn = userContext.data ? true : false;

  if (!user || isLoggedIn === false) {
    return <>loading...</>;
  }

  return children;

  //   if (isLoggedIn && window.location.pathname === "/") {
  //   } else if (!isLoggedIn && window.location.pathname !== "/") {
  //     router.push("/");
  //   }
};
