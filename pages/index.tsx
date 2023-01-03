import FeedPost from "../components/FeedPost";
import { Post } from "../types";

const post: Post = {
  user: {
    name: "iamdooddi",
    img: "https://res.cloudinary.com/dl5qaj6le/image/upload/v1664891276/archive/static/profile_temp.png",
  },
  title: "노티드",
  tags: ["카페", "도넛", "디저트"],
  imgs: [
    "https://res.cloudinary.com/dl5qaj6le/image/upload/v1664891643/archive/static/carousel_temp.png",
  ],
  createdAt: "6시간 전",
  numLikes: 0,
  arrLikes: [],
  numComments: 0,
  arrComments: [],
};

export default function Feed() {
  return (
    <>
      <div className="cont">
        <h1>feed</h1>
        <FeedPost post={post} />
      </div>
      <style jsx>{`
        .cont {
          margin: 16px;
        }
      `}</style>
    </>
  );
}
