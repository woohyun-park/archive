import Layout from "components/common/Layout";
import { useUser } from "contexts/UserProvider";

export default function ProtectedRoute({ children }: any) {
  const { data } = useUser();

  if (!data) return <></>;
  return <Layout>{children}</Layout>;
}
