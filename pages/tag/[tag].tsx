import { collection, orderBy, query, where } from "firebase/firestore";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { getPostsByQuery } from "../../apis/firebase";
import IconBtn from "../../components/atoms/IconBtn";
import PageInfinite from "../../components/PageInfinite";
import WrapScroll from "../../components/wrappers/WrapScroll";
import Motion from "../../motions/Motion";
import { useModal } from "../../stores/useModal";
import { useTag } from "../../stores/useTag";

export default function Tag({}) {
  const { modalLoader } = useModal();
  const { dictPosts, getPosts } = useTag();

  const router = useRouter();

  const tag = router.query.tag as string;

  useEffect(() => {
    async function init() {
      getPosts("init", tag);
    }
    init();
  }, []);

  return (
    <Motion type="fade">
      {!modalLoader && (
        <>
          <div className="flex items-center justify-center mt-2 mb-4">
            <WrapScroll className="absolute left-0 flex ml-4">
              <IconBtn icon="back" onClick={() => router.back()} />
            </WrapScroll>
            <div className="title-page-sm">#{tag}</div>
          </div>
          {dictPosts[tag] && (
            <PageInfinite
              page="feed"
              data={dictPosts[tag]}
              onIntersect={() => getPosts("load", tag)}
              onChange={() => {}}
              onRefresh={async () => {
                await getPosts("refresh", tag);
              }}
              changeListener={dictPosts[tag]}
            />
          )}
        </>
      )}
    </Motion>
  );
}
