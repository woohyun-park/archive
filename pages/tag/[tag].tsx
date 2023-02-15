import { useRouter } from "next/router";
import { useState } from "react";
import IconBtn from "../../components/atoms/IconBtn";
import WrapScroll from "../../components/wrappers/WrapScroll";
import Motion from "../../motions/Motion";
import { useModal } from "../../stores/useModal";

export default function Tag({}) {
  const { modalLoader } = useModal();

  const router = useRouter();
  const [posts, setPosts] = useState([]);

  const tag = router.query.tag;

  return (
    <Motion type="fade">
      {!modalLoader && (
        <>
          <div className="flex mt-2 mb-4">
            <WrapScroll className="flex">
              <IconBtn icon="back" onClick={() => router.back()} />
            </WrapScroll>
            <div className="title-page">{tag}</div>
          </div>
        </>
      )}
    </Motion>
  );
}
