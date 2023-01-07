import { collection, doc, getDoc, getDocs } from "firebase/firestore";
import { db } from "../../apis/firebase";
import Header from "../../components/Header";
import ProfileSmall from "../../components/ProfileSmall";
import { COLOR, IPost, IUser } from "../../custom";

interface IPostProps {
  post: IPost;
  user: IUser;
}

export default function Post({ post, user }: IPostProps) {
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
      <ProfileSmall post={post} user={user} style="post" />
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
      <div className="text">{post?.txt}</div>

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

interface IServerSidePaths {
  params: IServerSideProps;
}
interface IServerSideProps {
  id: string;
}

export async function getServerSidePaths() {
  const pathSnap = await getDocs(collection(db, "posts"));
  const paths: IServerSidePaths[] = [];
  pathSnap.forEach((post) => {
    paths.push({ params: { id: post.id } });
  });

  return { paths, fallback: false };
}

export async function getServerSideProps({ params }: IServerSidePaths) {
  const postRef = doc(db, "posts", params.id);
  const postSnap = await getDoc(postRef);
  const post: IPost = { ...(postSnap.data() as IPost), id: postSnap.id };

  const userRef = doc(db, "users", post?.uid);
  const userSnap = await getDoc(userRef);
  const user: IUser = { ...(userSnap.data() as IUser), uid: userSnap.id };

  return { props: { post, user } };
}
