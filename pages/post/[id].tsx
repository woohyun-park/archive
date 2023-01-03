import { useRouter } from "next/router";

export default function Post({}) {
  const router = useRouter();
  const id = router.query.id;
  return (
    <>
      <h1>{id}</h1>
    </>
  );
}
