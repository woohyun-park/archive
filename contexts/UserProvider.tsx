import { useMutation, useQuery } from "@tanstack/react-query";
import { IUser } from "apis/def";
import { readUser, updateUser } from "apis/firebase";
import { USER_DEFAULT } from "consts/user";
import React, { createContext, useContext } from "react";

type IUserContext = {
  data: IUser;
  mutate: Function;
  refetch: Function;
};

const UserContext = createContext<IUserContext>({
  data: USER_DEFAULT,
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
  const { data, refetch } = useQuery({
    queryKey: ["user"],
    queryFn: () => readUser(id),
  });
  const { mutate } = useMutation({
    mutationFn: updateUser,
    // onSuccess: () => refetch(),
  });

  return (
    <UserContext.Provider
      value={{ data: data || USER_DEFAULT, mutate, refetch }}
    >
      {children}
    </UserContext.Provider>
  );
}
