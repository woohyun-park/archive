import { useMutation, useQuery } from "@tanstack/react-query";
import { IUser } from "apis/def";
import { readUser, updateUser } from "apis/firebase";
import { ModalSpinner } from "components/templates";
import { AUTH_USER_DEFAULT } from "consts/auth";
import React, { createContext, useContext } from "react";

type IUserContext = {
  data: IUser;
  mutate: Function;
  refetch: Function;
};

const UserContext = createContext<IUserContext>({
  data: AUTH_USER_DEFAULT,
  mutate: () => Promise<any>,
  refetch: () => Promise<any>,
});

export const useUser = () => useContext(UserContext);

export function UserProvider({
  children,
  id,
}: {
  children: React.ReactNode;
  id: string;
}) {
  const { data, refetch, isLoading } = useQuery({
    queryKey: ["user"],
    queryFn: async () => await readUser(id),
  });
  const { mutate } = useMutation({
    mutationFn: updateUser,
  });

  if (isLoading) return <ModalSpinner />;

  return (
    <UserContext.Provider
      value={{ data: data || AUTH_USER_DEFAULT, mutate, refetch }}
    >
      {children}
    </UserContext.Provider>
  );
}
