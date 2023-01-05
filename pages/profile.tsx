import { signOut } from "firebase/auth";
import { auth } from "../apis/firebase";
import { useStore } from "../apis/zustand";

export default function Profile() {
  const { user, setUser } = useStore();
  function handleLogout() {
    signOut(auth);
  }
  return (
    <>
      <h1>{user.displayName}</h1>
      <button onClick={handleLogout}>logout</button>
    </>
  );
}
