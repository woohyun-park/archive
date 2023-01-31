import { IComment, ILike, IPost, IScrap, IUser } from "../libs/custom";
import {
  collection,
  DocumentData,
  endAt,
  getDocs,
  limit,
  orderBy,
  Query,
  query,
  QuerySnapshot,
  startAfter,
  Timestamp,
  where,
  QueryDocumentSnapshot,
} from "firebase/firestore";
import { db, getData, getEach } from "../apis/firebase";
import { POST_PER_PAGE } from "./useStore";
import { IFeedGetType } from "./useFeedStore";

export let feedFirstVisible: QueryDocumentSnapshot<DocumentData>;
export let feedLastVisible: QueryDocumentSnapshot<DocumentData>;

export function getQueryByType(
  user: IUser,
  type: IFeedGetType
): Query<DocumentData> {
  const id = user.id;
  if (type === "init")
    return query(
      collection(db, "posts"),
      where("uid", "in", [...user.followings, id]),
      orderBy("createdAt", "desc"),
      limit(POST_PER_PAGE.feed.post)
    );
  else if (type === "load")
    return query(
      collection(db, "posts"),
      where("uid", "in", [...user.followings, id]),
      orderBy("createdAt", "desc"),
      startAfter(feedLastVisible),
      limit(POST_PER_PAGE.feed.post)
    );
  else
    return query(
      collection(db, "posts"),
      where("uid", "in", [...user.followings, id]),
      orderBy("createdAt", "desc"),
      endAt(feedLastVisible)
    );
}

export async function getPostsByQuery(
  q: Query
): Promise<[QuerySnapshot<DocumentData>, IPost[]]> {
  const snap = await getDocs(q);
  const posts: IPost[] = [];
  for (const doc of snap.docs) {
    const post: IPost = doc.data() as IPost;
    const uid = post.uid;
    const pid = post.id || "";
    const author: IUser = await getData<IUser>("users", uid);
    const likes = await getEach<ILike>("likes", pid);
    const scraps = await getEach<IScrap>("scraps", pid);
    const comments = await getEach<IComment>("comments", pid);
    post.likes = likes ? likes : [];
    post.scraps = scraps ? scraps : [];
    post.comments = comments ? comments : [];
    post.author = author;
    post.createdAt = (post.createdAt as Timestamp).toDate();
    posts.push(post);
  }
  return [snap, posts];
}

export function combinePrevAndNewPosts(
  prevPosts: IPost[],
  posts: IPost[],
  type: IFeedGetType
) {
  if (type === "init") return [...posts];
  else if (type === "load") return [...prevPosts, ...posts];
  else return [...posts];
}

export function setCursorByType(
  snap: QuerySnapshot<DocumentData>,
  type: IFeedGetType
) {
  if (snap.docs.length !== 0) {
    if (type === "init") {
      feedFirstVisible = snap.docs[0];
      feedLastVisible = snap.docs[snap.docs.length - 1];
    } else if (type === "load") {
      feedLastVisible = snap.docs[snap.docs.length - 1];
    } else if (type === "refresh") {
      feedFirstVisible = snap.docs[0];
      feedLastVisible = snap.docs[snap.docs.length - 1];
    }
  }
}
