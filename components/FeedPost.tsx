import { HiDotsHorizontal } from "react-icons/hi";
import { User, Post } from "../types";
import ImageSmall from "./ImageSmall";

type IFeedPostProps = {
  post: Post;
};

export default function FeedPost({ post }: IFeedPostProps) {
  return (
    <>
      <div className="userCont">
        <div className="row">
          <img className="userImg" src={post.user.img} />
          <div className="col">
            <div className="userName">{post.user.name}</div>
            <div className="createdAt">{post.createdAt}</div>
          </div>
        </div>
        <HiDotsHorizontal />
      </div>
      <ImageSmall post={post} />
      <style jsx>
        {`
          .userCont {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 16px;
          }
          .userImg {
            width: 32px;
            height: 32px;
            border-radius: 32px;
            margin-right: 8px;
          }
          .userName {
            font-size: 16px;
          }
          .createdAt {
            font-size: 12px;
            color: grey;
          }
          .row {
            display: flex;
            flex-direction: row;
          }
          .col {
            display: flex;
            flex-direction: column;
          }
        `}
      </style>
    </>
  );
}
