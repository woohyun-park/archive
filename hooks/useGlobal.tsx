import { useEffect } from "react";
import {
  deletePost as deletePostFb,
  getPost as getPostFb,
} from "../apis/firebase";
import { IDict, IPost, IUser } from "../libs/custom";
import { IFetchType } from "../libs/queryLib";
import { useCache } from "../stores/useCache";
import { useFeed } from "../stores/useFeed";
import { useSearch } from "../stores/useSearch";

export const useGlobal = () => {
  const {
    cachedPosts,
    cachedUsers,
    setCachedPosts,
    setCachedUsers,
    deleteCachedPosts,
  } = useCache();
  const feed = useFeed();
  const search = useSearch();

  useEffect(() => {
    feed.setPosts(
      feed.posts
        .map((post) => cachedPosts[post.id || ""])
        .filter((post) => post !== undefined)
    );
    feed.setFilteredPosts(
      feed.filteredPosts
        .map((post) => cachedPosts[post.id || ""])
        .filter((post) => post !== undefined)
    );
    search.setPosts(
      search.posts
        .map((post) => cachedPosts[post.id || ""])
        .filter((post) => post !== undefined)
    );
  }, [cachedPosts]);

  async function getFeed(type: IFetchType, uid: string) {
    const newPosts = await feed.getPosts(type, uid);
    updatePosts(newPosts);
  }

  async function getFilteredFeed(type: IFetchType, uid: string, tag: string) {
    const newPosts = await feed.getFilteredPosts(type, uid, tag);
    updatePosts(newPosts);
  }

  async function getSearch(type: IFetchType) {
    const newPosts = await search.getPosts(type);
    updatePosts(newPosts);
  }

  function updatePosts(posts: IPost[]) {
    const updatedPosts: IDict<IPost> = { ...cachedPosts };
    const updatedUsers: IDict<IUser> = { ...cachedUsers };
    posts.forEach((post) => {
      const user = post.author;
      updatedPosts[post.id || ""] = post;
      if (user) updatedUsers[user.id] = user;
    });
    setCachedPosts(updatedPosts);
    setCachedUsers(updatedUsers);
  }

  async function getPost(pid: string) {
    const post = await getPostFb(pid);
    if (post) {
      updatePosts([post]);
      return post;
    }
    return null;
  }

  async function deletePost(pid: string) {
    await deletePostFb(pid);
    deleteCachedPosts(pid);
  }

  return {
    getPost,
    getFeed,
    getFilteredFeed,
    getSearch,
    updatePosts,
    deletePost,
  };
};
