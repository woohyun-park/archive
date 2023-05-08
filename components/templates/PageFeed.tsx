import useCustomRouter from "../../hooks/useCustomRouter";
import { useUser } from "../../stores/useUser";
import BtnIcon from "../atoms/BtnIcon";
import PostsColOne, { IPostsColOne } from "../organisms/PostsColOne";
import ProfileImg from "../ProfileImg";

export default function PageFeed({
  data,
  hasNextPage,
  refetch,
  fetchNextPage,
}: IPostsColOne) {
  const router = useCustomRouter();
  const { curUser, hasNewAlarms } = useUser();

  return (
    <div className="relative flex flex-col mt-4 bg-white">
      <div className="flex items-center justify-between px-4 pb-2">
        <h1
          className="hover:cursor-pointer title-logo"
          onClick={() => router.reload()}
        >
          archive
        </h1>
        <div className="flex items-center justify-center">
          <BtnIcon
            icon="alarm"
            fill={hasNewAlarms ? true : false}
            onClick={() => router.push("/alarm")}
          />
          <ProfileImg
            size="sm"
            photoURL={curUser.photoURL}
            onClick={() => router.push(`/profile/${curUser.id}`)}
          />
        </div>
      </div>
      <PostsColOne
        data={data}
        hasNextPage={hasNextPage}
        refetch={refetch}
        fetchNextPage={fetchNextPage}
      />
    </div>
  );
}
