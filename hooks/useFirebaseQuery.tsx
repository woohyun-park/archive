import { DocumentData, Query, QueryDocumentSnapshot } from "firebase/firestore";
import {
  getPostsQuery,
  getPostsQueryByFollowings,
  getPostsQueryByKeyword,
  getPostsQueryByTag,
  getPostsQueryByUid,
  getPostsQueryByUidAndTag,
} from "apis/firebase/queryNew/queryPosts";
import {
  getScrapsQueryByUid,
  getScrapsQueryByUidAndCont,
} from "apis/firebase/queryNew/queryScraps";
import {
  getTagsQueryByKeyword,
  getTagsQueryByUid,
} from "apis/firebase/queryNew/queryTags";
import {
  readAlarms,
  readPosts,
  readScraps,
  readTags,
  readUsers,
} from "apis/firebase";

import { AUTH_USER_DEFAULT } from "consts/auth";
import { IDict } from "apis/def";
import { getAlarmsQueryByUid } from "apis/firebase/queryNew/queryAlarms";
import { getUsersQueryByKeyword } from "apis/firebase/queryNew/queryUsers";
import useCustomRouter from "./useCustomRouter";
import { useUser } from "providers";

export type FirebaseQueryType =
  | "feed/posts"
  | "profile/posts"
  | "profile/scraps"
  | "profile/scraps/detail"
  | "profile/tags"
  | "profile/tags/detail"
  | "alarm/alarms"
  | "search/posts"
  | "search/keyword/posts"
  | "search/keyword/tags"
  | "search/keyword/users"
  | "tag/posts";

export type FirebaseQueryStatus = {
  init: Query<DocumentData>;
  load: Query<DocumentData>;
  refresh: Query<DocumentData>;
  refreshNew: Query<DocumentData>;
};

export default function useFirebaseQuery(type: FirebaseQueryType) {
  const userContext = useUser();
  const router = useCustomRouter();
  const { id: curUid, followings } = userContext.data || AUTH_USER_DEFAULT;
  const { uid, cont, tag, keyword } = router.query;
  const queryFnFor: IDict<
    (docs: QueryDocumentSnapshot<DocumentData>[]) => Promise<any>
  > = {
    "feed/posts": readPosts,
    "profile/posts": readPosts,
    "profile/scraps": readScraps,
    "profile/scraps/detail": readPosts,
    "profile/tags": readTags,
    "profile/tags/detail": readPosts,
    "alarm/alarms": readAlarms,
    "search/posts": readPosts,
    "search/keyword/posts": readPosts,
    "search/keyword/tags": readTags,
    "search/keyword/users": readUsers,
    "tag/posts": readPosts,
  };

  const queryFor: IDict<(params: any) => FirebaseQueryStatus> = {
    "feed/posts": getPostsQueryByFollowings(followings),
    "profile/posts": getPostsQueryByUid(uid as string),
    "profile/scraps": getScrapsQueryByUid(uid as string),
    "profile/scraps/detail": getScrapsQueryByUidAndCont(
      uid as string,
      cont as string
    ),
    "profile/tags": getTagsQueryByUid(uid as string),
    "profile/tags/detail": getPostsQueryByUidAndTag(
      uid as string,
      tag as string
    ),
    "alarm/alarms": getAlarmsQueryByUid(curUid),
    "search/posts": getPostsQuery(),
    "search/keyword/posts": getPostsQueryByKeyword(keyword as string),
    "search/keyword/tags": getTagsQueryByKeyword(keyword as string),
    "search/keyword/users": getUsersQueryByKeyword(keyword as string),
    "tag/posts": getPostsQueryByTag(tag as string),
  };

  return { queryFn: queryFnFor[type], query: queryFor[type] };
}
