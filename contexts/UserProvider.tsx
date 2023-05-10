import { useMutation, useQuery } from "@tanstack/react-query";
import { IUser } from "apis/def";
import { readUser, updateUser } from "apis/firebase";
import { USER_DEFAULT } from "consts/auth";
import React, { createContext, useContext } from "react";

type IUserContext = {
  data: IUser | undefined;
  mutate: Function;
  refetch: Function;
};

const UserContext = createContext<IUserContext>({
  data: undefined,
  mutate: () => {},
  refetch: () => {},
});

export const useUser = () => useContext(UserContext);

export function UserProvider({
  children,
  id,
}: {
  children: React.ReactNode;
  id: string;
}) {
  console.log("UserProvider", id);
  const { data, refetch } = useQuery({
    queryKey: ["user"],
    queryFn: () => readUser(id),
  });
  const { mutate } = useMutation({
    mutationFn: updateUser,
    // onSuccess: () => refetch(),
  });

  return (
    <UserContext.Provider value={{ data, mutate, refetch }}>
      {children}
    </UserContext.Provider>
  );
}
