import { useRouter } from "next/router";
import BtnIcon from "../../components/atoms/BtnIcon";
import Motion from "../../components/wrappers/WrapMotion";
import PagePosts from "../../components/PagePosts";
import { useLoading } from "../../hooks/useLoading";

export default function Tag({}) {
  const router = useRouter();

  useLoading(["posts"]);

  const tag = router.query.tag as string;

  return (
    <Motion type="fade">
      <div className="flex items-center justify-center mt-2 mb-4">
        <BtnIcon icon="back" onClick={() => router.back()} />
        <div className="title-page-sm">#{tag}</div>
      </div>
      <PagePosts
        query={{
          type: "tag",
          value: { tag },
        }}
        as="posts"
        numCols={1}
      />
    </Motion>
  );
}
