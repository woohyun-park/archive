import { doc, getDoc } from "firebase/firestore";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { db } from "../../apis/firebase";
import Header from "../../components/Header";
import ProfileSmall from "../../components/ProfileSmall";
import { COLOR, IPost } from "../../custom";

export default function Post({}) {
  const router = useRouter();
  const [post, setPost] = useState<IPost | null>(null);
  async function getPost() {
    if (typeof router.query.id === "string") {
      const docRef = doc(db, "posts", router.query.id);
      const docSnap = await getDoc(docRef);
      setPost(docSnap.data() as IPost);
    }
  }
  useEffect(() => {
    if (typeof router.query.post === "string") {
      setPost(JSON.parse(router.query.post));
    } else {
      getPost();
    }
  }, [router.isReady]);
  return (
    <>
      <Header post={post} />
      {post?.imgs.length === 0 ? (
        <div className="bg"></div>
      ) : (
        <div className="imgCont">
          <img className="img" src={post?.imgs[0]} />
        </div>
      )}
      <ProfileSmall post={post} />
      <h1 className="title">{post?.title}</h1>
      <div className="mainTag">{post && `#${post.tags[0]}`}</div>
      <div className="tagCont">
        {post?.tags.map((e, i) => {
          if (i === 0) {
            return;
          }
          return <div className="subTag">{`#${post?.tags[i]}`}</div>;
        })}
      </div>
      <div className="text">{post?.text}</div>

      <style jsx>{`
        .imgCont {
          position: relative;
          width: calc(100% + 32px);
          max-width: 480px;
          transform: translateX(-16px);
          padding-bottom: calc(100% + 32px);
          overflow: hidden;
        }
        .img {
          position: absolute;
          top: 0;
          left: 0;
          transform: translate(50, 50);
          width: 100%;
          height: 100%;
          object-fit: cover;
        }
        .bg {
          background-color: ${post?.color};
          width: calc(100% + 32px);
          padding-bottom: calc(50%);
          transform: translate(-16px);
        }
        .img {
          width: calc(100% + 32px);
          transform: translateX(-16px);
        }
        .title {
          word-break: keep-all;
        }
        .tagCont {
          display: flex;
          justify-content: flex-end;
        }
        .mainTag {
          text-align: right;
          font-size: 24px;
        }
        .subTag {
          margin-left: 4px;
          color: ${COLOR.txt2};
        }
        .text {
          margin-top: 8px;
        }
      `}</style>
    </>
  );
}
