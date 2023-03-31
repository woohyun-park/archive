import { useRouter } from "next/router";
import BtnIcon from "../../../../components/atoms/BtnIcon";
import Motion from "../../../../components/wrappers/WrapMotion";
import PagePosts from "../../../../components/PagePosts";
import { useEffect, useState } from "react";
import { IUser } from "../../../../apis/def";
import { readData } from "../../../../apis/fbRead";
import { useLoading } from "../../../../hooks/useLoading";

export default function ProfileTag({}) {
  const router = useRouter();
  const [user, setUser] = useState<IUser>();

  const tag = router.query.tag as string;
  const uid = router.query.uid as string;

  useEffect(() => {
    async function init() {
      const newUser = await readData<IUser>("users", uid);
      setUser(newUser);
    }
    init();
  }, []);

  return (
    <Motion type="fade">
      <div className="flex items-center justify-center mt-2">
        <BtnIcon icon="back" onClick={() => router.back()} />
        <div className="title-page-sm">#{tag}</div>
      </div>
      <div className="top-0 m-auto text-xs text-center text-gray-2f">
        {user?.displayName}
      </div>
      <PagePosts
        query={{
          type: "uidAndTag",
          value: { tag, uid },
        }}
        as="posts"
        numCols={1}
      />
    </Motion>
  );
}
