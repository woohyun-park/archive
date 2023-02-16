import { useEffect, useState } from "react";
import { deletePost as deletePostFb } from "../apis/firebase";
import { IDict, IPost } from "../libs/custom";
import { IFetchType } from "../libs/queryLib";
import { useCache } from "../stores/useCache";
import { useFeed } from "../stores/useFeed";
import { useSearch } from "../stores/useSearch";

export const useGlobal = () => {
  const feed = useFeed();
  const search = useSearch();

  const { cachedPosts, setCachedPosts, deleteCachedPosts } = useCache();

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
    posts.forEach((post) => (updatedPosts[post.id || ""] = post));
    setCachedPosts(updatedPosts);
  }

  async function deletePost(pid: string) {
    await deletePostFb(pid);
    deleteCachedPosts(pid);
  }

  return { getFeed, getFilteredFeed, getSearch, deletePost };
};
