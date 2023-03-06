import { useRouter } from "next/router";
import { useStatus } from "../stores/useStatus";

export default function useRoute() {
  const router = useRouter();

  const { setModalLoader } = useStatus();

  function pushWithLoader(href: string) {
    setModalLoader(true);
    router.push(href);
  }

  return { pushWithLoader };
}
