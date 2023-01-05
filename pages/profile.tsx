import { useStore } from "../apis/store";

export default function Profile() {
  const { userState, setUserState } = useStore();
  return (
    <>
      <h1>{userState.displayName}</h1>
    </>
  );
}
